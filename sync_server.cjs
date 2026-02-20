const { WebSocketServer, WebSocket } = require('ws');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 4000;
const REPORT_PATH = path.join(__dirname, 'public', 'auto-qa-report.json');

// Load initial marks from auto-qa-report.json (optional baseline)
let sharedMarks = {};
try {
    if (fs.existsSync(REPORT_PATH)) {
        sharedMarks = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
        console.log(`Loaded ${Object.keys(sharedMarks).length} entries from auto-qa-report.json`);
    }
} catch (e) {
    console.warn('Could not load auto-qa-report.json:', e.message);
}

const wss = new WebSocketServer({ port: PORT });
console.log(`\n🔌 Admin Sync Server running on ws://0.0.0.0:${PORT}`);
console.log(`   Open admin.html on any device on this network.\n`);

// Broadcast to all clients except the sender
function broadcast(sender, data) {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`[+] Client connected: ${ip} (${wss.clients.size} total)`);

    // Send entire mark state to newly connected client so it is immediately up-to-date
    ws.send(JSON.stringify({ type: 'full-sync', marks: sharedMarks }));

    ws.on('message', (raw) => {
        let msg;
        try { msg = JSON.parse(raw); } catch { return; }

        if (msg.type === 'update') {
            // Apply the change server-side
            sharedMarks[msg.id] = msg.mark;

            // Persist to disk (debounced via setTimeout is not needed here since we are single-threaded)
            try {
                fs.writeFileSync(REPORT_PATH, JSON.stringify(sharedMarks, null, 2));
            } catch (e) {
                console.error('Failed to save report:', e.message);
            }

            // Broadcast to other clients
            broadcast(ws, { type: 'update', id: msg.id, mark: msg.mark });
            console.log(`[sync] ${msg.id} updated → broadcast to ${wss.clients.size - 1} other clients`);
        }

        if (msg.type === 'full-marks') {
            // A client is sending its entire marks state (on first connect)
            // Merge (client wins on conflicts — latest update wins)
            Object.assign(sharedMarks, msg.marks);
            try {
                fs.writeFileSync(REPORT_PATH, JSON.stringify(sharedMarks, null, 2));
            } catch (e) { }
        }

        if (msg.type === 'update-content') {
            const { id, subject, question } = msg;
            if (subject && question) {
                const filePath = path.join(__dirname, 'src', 'data', `${subject}.json`);
                if (fs.existsSync(filePath)) {
                    try {
                        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        let index = data.findIndex(q => q.id === id);
                        if (index !== -1) {
                            // Merge updates
                            data[index] = { ...data[index], ...question };
                            delete data[index]._subject;
                            delete data[index]._subjectLabel;

                            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                            console.log(`[sync] Directly saved ${id} to ${subject}.json`);

                            // Broadcast an update to other clients if needed, or just let them re-fetch next reload
                            broadcast(ws, { type: 'content-updated', id, subject });
                        }
                    } catch (e) {
                        console.error(`Failed to apply direct content update to ${subject}.json:`, e.message);
                    }
                }
            }
        }

        if (msg.type === 'deploy-netlify') {
            console.log('[sync] Triggering Netlify deployment via Git...');
            // We use git add src/data/*.json to only deploy changes in the questions data
            exec('git add "src/data/*.json" && git commit -m "Admin QA fixes" && git push', (error, stdout, stderr) => {
                let status = 'success';
                let output = stdout || '';
                if (error) {
                    console.error('[sync] Git deploy error:', stderr || error.message);
                    // It might fail if there's nothing to commit, which is fine, but we'll return error so client knows
                    status = 'error';
                    output = stderr || error.message;
                } else {
                    console.log('[sync] Git pushed successfully:', stdout);
                }
                ws.send(JSON.stringify({ type: 'deploy-status', status, output }));
            });
        }
    });

    ws.on('close', () => {
        console.log(`[-] Client disconnected: ${ip} (${wss.clients.size} remaining)`);
    });

    ws.on('error', (err) => {
        console.error(`[!] Error from ${ip}:`, err.message);
    });
});
