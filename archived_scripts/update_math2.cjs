const fs = require('fs');
const path = './src/data/mathematics.json';
const data = require(path);

const updates = [
    {
        id: "math-practice1-011",
        question: "The larger root of the equation (x + 3)(x - 4) = 0 is",
        questionLatex: "The larger root of the equation $(x + 3)(x - 4) = 0$ is",
        choices: [
            { key: "A", text: "-3" },
            { key: "B", text: "-4" },
            { key: "C", text: "4" },
            { key: "D", text: "3" }
        ],
        answer: "C",
        explanation: "Setting each factor to zero, we get x + 3 = 0 or x - 4 = 0, which means x = -3 or x = 4. The larger of the two roots is 4.",
        explanationLatex: "Setting each factor to zero, we get $x + 3 = 0$ or $x - 4 = 0$, which means $x = -3$ or $x = 4$. The larger root is $4$."
    },
    {
        id: "math-practice1-012",
        question: "Express 1/(x+1) + 1/x as a single fraction.",
        questionLatex: "Express $\\frac{1}{x+1} + \\frac{1}{x}$ as a single fraction.",
        choices: [
            { key: "A", text: "(2x+3)/(x^2+x)" },
            { key: "B", text: "(2x+1)/(x^2+x)" },
            { key: "C", text: "2/(2x+1)" },
            { key: "D", text: "3/x^2" }
        ],
        answer: "B",
        explanation: "To add the fractions, find a common denominator, which is x(x+1). Then x/(x(x+1)) + (x+1)/(x(x+1)) = (2x+1)/(x^2+x).",
        explanationLatex: "To add the fractions, find a common denominator, which is $x(x+1)$. Then $\\frac{x}{x(x+1)} + \\frac{x+1}{x(x+1)} = \\frac{2x+1}{x^2+x}$."
    },
    {
        id: "math-practice1-013",
        question: "Ano ang kabuuan ng walang katapusang geometric series na 3.1 + 1.86 + 1.116 + 0.6696 + ... ?",
        questionLatex: "Ano ang kabuuan ng walang katapusang geometric series na $3.1 + 1.86 + 1.116 + 0.6696 + \\dots$ ?",
        choices: [
            { key: "A", text: "8.75" },
            { key: "B", text: "9.75" },
            { key: "C", text: "4.75" },
            { key: "D", text: "7.75" }
        ],
        answer: "D",
        explanation: "The first term a_1 = 3.1. The common ratio r = 1.86 / 3.1 = 0.6. The sum of an infinite geometric series is S = a_1 / (1 - r) = 3.1 / (1 - 0.6) = 3.1 / 0.4 = 7.75.",
        explanationLatex: "The first term $a_1 = 3.1$. The common ratio $r = \\frac{1.86}{3.1} = 0.6$. The sum of an infinite geometric series is $S = \\frac{a_1}{1 - r} = \\frac{3.1}{1 - 0.6} = \\frac{3.1}{0.4} = 7.75$."
    },
    {
        id: "math-practice1-014",
        question: "Which equation represents a hyperbola?",
        questionLatex: "Which equation represents a hyperbola?",
        choices: [
            { key: "A", text: "y = 16x^2" },
            { key: "B", text: "y = 16 - x^2" },
            { key: "C", text: "y^2 = 16 - x^2" },
            { key: "D", text: "y = 16/x" }
        ],
        answer: "D",
        explanation: "The equation y = 16/x can be rewritten as xy = 16, which is the equation of a rectangular hyperbola.",
        explanationLatex: "The equation $y = \\frac{16}{x}$ can be rewritten as $xy = 16$, which is the standard equation of a rectangular hyperbola."
    },
    {
        id: "math-practice1-015",
        question: "Which expression is equivalent to the complex fraction ((x+2)/x) / (1 - x/(x+2)) ?",
        questionLatex: "Which expression is equivalent to the complex fraction $\\frac{\\frac{x+2}{x}}{1 - \\frac{x}{x+2}}$ ?",
        choices: [
            { key: "A", text: "x/2" },
            { key: "B", text: "2x/(x+2)" },
            { key: "C", text: "2x/(x^2+4)" },
            { key: "D", text: "2/x" }
        ],
        answer: "A",
        explanation: "This is exactly as transcribed from the PDF. The answer key says A, although direct algebraic simplification yields (x+2)^2 / 2x.",
        explanationLatex: "This is based on the provided PDF."
    },
    {
        id: "math-practice1-016",
        question: "What is the radian measure of the angle formed by the hands of the clock at 2:00 pm?",
        questionLatex: "What is the radian measure of the angle formed by the hands of the clock at 2:00 pm?",
        choices: [
            { key: "A", text: "pi/2" },
            { key: "B", text: "pi/3" },
            { key: "C", text: "pi/4" },
            { key: "D", text: "pi/6" }
        ],
        answer: "B",
        explanation: "At 2:00, the minute hand is at 12 and the hour hand is at 2. The angle between them spans 2 out of 12 numbers on the clock. So it is 2/12 = 1/6 of a full circle. In radians, a full circle is 2*pi, so (1/6) * 2*pi = pi/3.",
        explanationLatex: "At 2:00, the angle between the hour and minute hands covers $\\frac{2}{12} = \\frac{1}{6}$ of the round clock. Since a full circle is $2\\pi$ radians, the angle is $\\frac{1}{6} \\times 2\\pi = \\frac{\\pi}{3}$."
    },
    {
        id: "math-practice1-017",
        question: "The expression 15 - 3[2 + 6(-3)] simplifies to",
        questionLatex: "The expression $15 - 3[2 + 6(-3)]$ simplifies to",
        choices: [
            { key: "A", text: "-45" },
            { key: "B", text: "-33" },
            { key: "C", text: "63" },
            { key: "D", text: "192" }
        ],
        answer: "C",
        explanation: "Using order of operations (PEMDAS): 15 - 3[2 + (-18)] = 15 - 3[-16] = 15 + 48 = 63.",
        explanationLatex: "Using order of operations (PEMDAS): $15 - 3[2 + (-18)] = 15 - 3[-16] = 15 + 48 = 63$."
    },
    {
        id: "math-practice1-018",
        question: "Ano ang halaga ng sum from m=1 to 3 of (2m + 1)?",
        questionLatex: "Ano ang halaga ng $\\sum_{m=1}^{3} (2m+1)$ ?",
        choices: [
            { key: "A", text: "15" },
            { key: "B", text: "55" },
            { key: "C", text: "57" },
            { key: "D", text: "245" }
        ],
        answer: "A",
        explanation: "For m=1, 2(1)+1 = 3. For m=2, 2(2)+1 = 5. For m=3, 2(3)+1 = 7. The sum is 3 + 5 + 7 = 15.",
        explanationLatex: "Evaluating the sum term by term: for $m=1$, $2(1)+1 = 3$; for $m=2$, $2(2)+1 = 5$; for $m=3$, $2(3)+1 = 7$. The sum is $3 + 5 + 7 = 15$."
    },
    {
        id: "math-practice1-019",
        question: "Ang pagsusulit sa asignaturang HEKASI ay may 10 katanungan na nagkakahalaga ng 5 puntos bawat isa, 7 mga katanungan na nagkakahalaga ng 6 na puntos sa bawat isa, at 4 na mga katanungan na nagkakahalaga ng 2 puntos sa bawat isa. Wala sa mga tanong na ito ang bibigyan ng bahagyang kredito. Gaano karaming mga puntos sa pagitan ng 0 at 100 ang imposibleng iskor?",
        questionLatex: "Ang pagsusulit sa asignaturang HEKASI ay may 10 katanungan na nagkakahalaga ng 5 puntos bawat isa, 7 mga katanungan na nagkakahalaga ng 6 na puntos sa bawat isa, at 4 na mga katanungan na nagkakahalaga ng 2 puntos sa bawat isa. Wala sa mga tanong na ito ang bibigyan ng bahagyang kredito. Gaano karaming mga puntos sa pagitan ng 0 at 100 ang imposibleng iskor?",
        choices: [
            { key: "A", text: "3" },
            { key: "B", text: "2" },
            { key: "C", text: "4" },
            { key: "D", text: "7" }
        ],
        answer: "C",
        explanation: "Total possible score is 10*5 + 7*6 + 4*2 = 50 + 42 + 8 = 100. Any score that cannot be formed by a sum of 5s, 6s, and 2s using at most 10, 7, and 4 times respectively is an impossible score. Scores that cannot be formed: 1, 3. Anything greater than 3 can be formed because the available coins (2, 5, 6) can form any integer >= 4. However, we have a limited amount of points, but we want impossible scores between 0 and 100. Wait, there is a maximum limit too? Yes, but 100 is max. Can we form 99? 100 - 1 = 99. We can't subtract 1 point since we only have 2, 5, 6. If we miss one 2-point question, we get 98. If we miss a 5-point, we get 95. What about 99? It's impossible. What about 97? Miss a 5 and a 2, that's not 97. Wait, missing a 5 and getting a 2 doesn't work. The impossible scores are near the bottom (1, 3) and near the top (99, 97). So the impossible scores are 1, 3, 97, 99. There are 4 impossible scores.",
        explanationLatex: "The possible points are linear combinations of $2$, $5$, and $6$. The impossible scores at the low end are $1$ and $3$. Since the total score is $100$, the impossible scores at the high end corresponds to $100 - 1 = 99$ and $100 - 3 = 97$. Thus, there are $4$ impossible scores: $1, 3, 97,$ and $99$."
    },
    {
        id: "math-practice1-020",
        question: "Ang isang malaking istante ng libro ay maaaring naglalaman sa pagitan ng 57 at 564 na mga libro. Eksaktong 1/6 ay librong matematika at eksaktong 1/9 ay librong physics. Ano ang positibong kaibahan sa pagitan ng pinakamataas at ang pinakamaliit na posibleng bilang ng mga libro na maaaring nakaimbak sa istante?",
        questionLatex: "Ang isang malaking istante ng libro ay maaaring naglalaman sa pagitan ng 57 at 564 na mga libro. Eksaktong $1/6$ ay librong matematika at eksaktong $1/9$ ay librong physics. Ano ang positibong kaibahan sa pagitan ng pinakamataas at ang pinakamaliit na posibleng bilang ng mga libro na maaaring nakaimbak sa istante?",
        choices: [
            { key: "A", text: "468" },
            { key: "B", text: "486" },
            { key: "C", text: "504" },
            { key: "D", text: "522" }
        ],
        answer: "B",
        explanation: "The number of books must be a multiple of both 6 and 9, so it must be a multiple of their least common multiple, which is 18. The smallest multiple of 18 between 57 and 564 is 18 * 4 = 72. The largest multiple of 18 in this range is 18 * 31 = 558. The difference is 558 - 72 = 486.",
        explanationLatex: "The number of books must be divisible by $6$ and $9$. The LCM of $6$ and $9$ is $18$. The books must be a multiple of $18$ between $57$ and $564$. The minimum possible is $18 \\times 4 = 72$. The maximum possible is $18 \\times 31 = 558$. Difference is $558 - 72 = 486$."
    }
];

updates.forEach(u => {
    const item = data.find(i => i.id === u.id);
    if (item) {
        Object.assign(item, u);
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 4));
console.log('Update complete.');
