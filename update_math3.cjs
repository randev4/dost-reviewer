const fs = require('fs');
const path = './src/data/mathematics.json';
const data = require(path);

const updates = [
    {
        id: "math-practice1-021",
        question: "Simplify: 2*sqrt(5/3) - sqrt(60) - 5*sqrt(3/5)",
        questionLatex: "Simplify: $2\\sqrt{\\frac{5}{3}} - \\sqrt{60} - 5\\sqrt{\\frac{3}{5}}$",
        choices: [
            { key: "A", text: "(-29*sqrt(15))/15" },
            { key: "B", text: "(-7*sqrt(15))/3" },
            { key: "C", text: "(7*sqrt(15))/15" },
            { key: "D", text: "(-29*sqrt(15))/3" }
        ],
        answer: "B",
        explanation: "2*sqrt(5/3) = 2*sqrt(15)/3. sqrt(60) = sqrt(4*15) = 2*sqrt(15). 5*sqrt(3/5) = 5*sqrt(15)/5 = sqrt(15). So the expression is (2/3)sqrt(15) - 2*sqrt(15) - sqrt(15) = (2/3 - 3)sqrt(15) = (-7/3)sqrt(15).",
        explanationLatex: "$2\\sqrt{\\frac{5}{3}} = \\frac{2\\sqrt{15}}{3}$. $\\sqrt{60} = \\sqrt{4 \\times 15} = 2\\sqrt{15}$. $5\\sqrt{\\frac{3}{5}} = \\frac{5\\sqrt{15}}{5} = \\sqrt{15}$. So the expression is $\\frac{2}{3}\\sqrt{15} - 2\\sqrt{15} - \\sqrt{15} = (\\frac{2}{3} - 3)\\sqrt{15} = -\\frac{7}{3}\\sqrt{15}$."
    },
    {
        id: "math-practice1-022",
        question: "Given: R is the midpoint of MS. TR is perpendicular to MS. If you outlined a proof that shows TM is congruent to TS, which would NOT be used?",
        questionLatex: "Given: $R$ is the midpoint of $MS$. $\\overline{TR} \\perp \\overline{MS}$. If you outlined a proof that shows $\\overline{TM} \\cong \\overline{TS}$, which would NOT be used?",
        choices: [
            { key: "A", text: "Triangle TMR is congruent to Triangle TSR by the SAS congruency postulate" },
            { key: "B", text: "TM is congruent to TS by CPCTC" },
            { key: "C", text: "Triangle TMR is congruent to Triangle TSR by the ASA congruency postulate" },
            { key: "D", text: "The fact that perpendicular lines form right angles" }
        ],
        answer: "C",
        explanation: "We know MR = RS because R is midpoint. TR = TR (reflexive property). And Angle TRM = Angle TRS = 90 because the lines are perpendicular. This gives Side-Angle-Side (SAS) congruence. From there, changing TM = TS requires CPCTC. ASA is not used because we do not initially know Angle M = Angle S or Angles at T.",
        explanationLatex: "We know $MR = RS$ because $R$ is midpoint. $TR = TR$ (reflexive property). And $\\angle TRM = \\angle TRS = 90$ because the lines are perpendicular. This gives Side-Angle-Side (SAS) congruence. From there, changing $TM = TS$ requires CPCTC. ASA is not used because we do not initially know $\\angle M = \\angle S$."
    },
    {
        id: "math-practice1-023",
        question: "Refer to the figure shown. State the congruency postulate that can be used to prove that Triangle TUV is congruent to Triangle WXV. Given: TV is congruent to WV and UV is congruent to XV.",
        questionLatex: "Refer to the figure shown. State the congruency postulate that can be used to prove that $\\Delta TUV \\cong \\Delta WXV$. Given: $\\overline{TV} \\cong \\overline{WV}$ and $\\overline{UV} \\cong \\overline{XV}$.",
        choices: [
            { key: "A", text: "SSS" },
            { key: "B", text: "SAS" },
            { key: "C", text: "ASA" },
            { key: "D", text: "AAS" }
        ],
        answer: "B",
        explanation: "The vertical angles at the intersection V (Angle TVU and Angle WVX) are congruent. Combining this with the given two sets of congruent sides (TV = WV, UV = XV), we have two sides and the included angle, which is the SAS (Side-Angle-Side) congruency postulate.",
        explanationLatex: "The vertical angles at the intersection $V$ ($\\angle TVU$ and $\\angle WVX$) are congruent. Combining this with the given two sets of congruent sides ($TV = WV$, $UV = XV$), we have two sides and the included angle, which is the SAS (Side-Angle-Side) congruency postulate."
    },
    {
        id: "math-practice1-024",
        question: "Find OM if LO bisects Angle NLM, LM = 20, NO = 3, and LN = 5.",
        questionLatex: "Find $OM$ if $\\overline{LO}$ bisects $\\angle NLM$, $LM = 20$, $NO = 3$, and $LN = 5$.",
        choices: [
            { key: "A", text: "10.23" },
            { key: "B", text: "0.75" },
            { key: "C", text: "12" },
            { key: "D", text: "33.33" }
        ],
        answer: "C",
        explanation: "According to the Triangle Angle Bisector Theorem, an angle bisector of a triangle divides the opposite side into two segments that are proportional to the other two sides of the triangle. So, LN/LM = NO/OM. 5/20 = 3/OM -> 1/4 = 3/OM -> OM = 12.",
        explanationLatex: "According to the Angle Bisector Theorem, an angle bisector of a triangle divides the opposite side into two segments that are proportional to the other two sides of the triangle. So, $\\frac{LN}{LM} = \\frac{NO}{OM}$. $\\frac{5}{20} = \\frac{3}{OM} \\implies \\frac{1}{4} = \\frac{3}{OM} \\implies OM = 12$."
    },
    {
        id: "math-practice1-025",
        question: "What value of x will give the maximum value for -7x^2 + 7x + 3 ?",
        questionLatex: "What value of x will give the maximum value for $-7x^2 + 7x + 3$ ?",
        choices: [
            { key: "A", text: "0" },
            { key: "B", text: "1" },
            { key: "C", text: "1/2" },
            { key: "D", text: "3/2" }
        ],
        answer: "C",
        explanation: "For a quadratic equation y = ax^2 + bx + c, the vertex (maximum or minimum point) occurs at x = -b/(2a). Here, a = -7 and b = 7. x = -7 / (2(-7)) = -7 / -14 = 1/2.",
        explanationLatex: "For a quadratic equation $y = ax^2 + bx + c$, the vertex occurs at $x = -\\frac{b}{2a}$. Here, $a = -7$ and $b = 7$. $x = -\\frac{7}{2(-7)} = -\\frac{7}{-14} = \\frac{1}{2}$."
    },
    {
        id: "math-practice1-026",
        question: "Written in simplest form (x^2 y - 4) / (4 - x^2 y) is",
        questionLatex: "Written in simplest form $\\frac{x^2 y - 4}{4 - x^2 y}$ is",
        choices: [
            { key: "A", text: "1" },
            { key: "B", text: "0" },
            { key: "C", text: "(x^2 y - 4)/(4 - x^2 y)" },
            { key: "D", text: "-1" }
        ],
        answer: "D",
        explanation: "The numerator is the exact negative of the denominator. If you factor out -1 from the denominator, you get -(x^2 y - 4). So (x^2 y - 4) / -(x^2 y - 4) = -1.",
        explanationLatex: "The numerator is the exact negative of the denominator. If you factor out $-1$ from the denominator, you get $-(x^2 y - 4)$. So $\\frac{x^2 y - 4}{-(x^2 y - 4)} = -1$."
    },
    {
        id: "math-practice1-027",
        question: "Which expression is equivalent to (sqrt(7) + sqrt(2)) / (sqrt(7) - sqrt(2)) ?",
        questionLatex: "Which expression is equivalent to $\\frac{\\sqrt{7} + \\sqrt{2}}{\\sqrt{7} - \\sqrt{2}}$ ?",
        choices: [
            { key: "A", text: "9/5" },
            { key: "B", text: "-1" },
            { key: "C", text: "(9 + 2*sqrt(14))/5" },
            { key: "D", text: "(11 + sqrt(2))/14" }
        ],
        answer: "C",
        explanation: "Rationalize the denominator by multiplying numerator and denominator by the conjugate (sqrt(7) + sqrt(2)). The numerator becomes (sqrt(7) + sqrt(2))^2 = 7 + 2*sqrt(14) + 2 = 9 + 2*sqrt(14). The denominator becomes (sqrt(7))^2 - (sqrt(2))^2 = 7 - 2 = 5. So the result is (9 + 2*sqrt(14)) / 5.",
        explanationLatex: "Rationalize the denominator by multiplying numerator and denominator by the conjugate $(\\sqrt{7} + \\sqrt{2})$. The numerator becomes $(\\sqrt{7} + \\sqrt{2})^2 = 7 + 2\\sqrt{14} + 2 = 9 + 2\\sqrt{14}$. The denominator becomes $(\\sqrt{7})^2 - (\\sqrt{2})^2 = 7 - 2 = 5$. So the result is $\\frac{9 + 2\\sqrt{14}}{5}$."
    },
    {
        id: "math-practice1-028",
        question: "Given two lines whose equations are 3x + y - 8 = 0 and -2x + ky + 9 = 0, determine the value of k such that the two lines are perpendicular.",
        questionLatex: "Given two lines whose equations are $3x + y - 8 = 0$ and $-2x + ky + 9 = 0$, determine the value of k such that the two lines are perpendicular.",
        choices: [
            { key: "A", text: "-2/3" },
            { key: "B", text: "6" },
            { key: "C", text: "8" },
            { key: "D", text: "-9" }
        ],
        answer: "B",
        explanation: "For two lines to be perpendicular, the product of their slopes must be -1. The slope of the first line (y = -3x + 8) is m1 = -3. The slope of the second line (ky = 2x - 9 -> y = (2/k)x - 9/k) is m2 = 2/k. So (-3)(2/k) = -1. -6/k = -1 -> k = 6.",
        explanationLatex: "For two lines to be perpendicular, the product of their slopes must be $m_1 m_2 = -1$. The slope of the first line ($y = -3x + 8$) is $m_1 = -3$. The slope of the second line ($ky = 2x - 9 \\implies y = \\frac{2}{k}x - \\frac{9}{k}$) is $m_2 = \\frac{2}{k}$. So $(-3)(\\frac{2}{k}) = -1 \\implies -\\frac{6}{k} = -1 \\implies k = 6$."
    },
    {
        id: "math-practice1-029",
        question: "Solve for x: 256^(2x) = 64^(x-2)",
        questionLatex: "Solve for x: $256^{2x} = 64^{x-2}$",
        choices: [
            { key: "A", text: "-6/11" },
            { key: "B", text: "-6/5" },
            { key: "C", text: "-1/5" },
            { key: "D", text: "0" }
        ],
        answer: "B",
        explanation: "Express both sides with the same base, which is 4. 256 = 4^4 and 64 = 4^3. So (4^4)^(2x) = (4^3)^(x-2). This simplifies to 4^(8x) = 4^(3x-6). Since the bases are equal, the exponents are equal: 8x = 3x - 6. Subtracting 3x from both sides gives 5x = -6. Dividing by 5 gives x = -6/5.",
        explanationLatex: "Express both sides with the same base, which is $4$. $256 = 4^4$ and $64 = 4^3$. So $(4^4)^{2x} = (4^3)^{x-2}$, which simplifies to $4^{8x} = 4^{3x-6}$. Setting exponents equal: $8x = 3x - 6 \\implies 5x = -6 \\implies x = -\\frac{6}{5}$."
    },
    {
        id: "math-practice1-030",
        question: "Find the square root of x^4 + 2x^3 + 5x^2 + 4x + 4.",
        questionLatex: "Find the square root of $x^4 + 2x^3 + 5x^2 + 4x + 4$.",
        choices: [
            { key: "A", text: "x^2 + x + 2" },
            { key: "B", text: "x^2 + 2x + 2" },
            { key: "C", text: "x^2 + 3x + 2" },
            { key: "D", text: "x^2 + 2" }
        ],
        answer: "A",
        explanation: "If you try squaring the first choice, (x^2 + x + 2)^2, you get (x^2 + x + 2)(x^2 + x + 2) = x^4 + x^3 + 2x^2 + x^3 + x^2 + 2x + 2x^2 + 2x + 4. Combining like terms gives x^4 + 2x^3 + 5x^2 + 4x + 4. This matches the original expression.",
        explanationLatex: "Let's test option (A) by squaring it: $(x^2 + x + 2)^2 = x^4 + x^3 + 2x^2 + x^3 + x^2 + 2x + 2x^2 + 2x + 4 = x^4 + 2x^3 + 5x^2 + 4x + 4$, which correctly matches."
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
