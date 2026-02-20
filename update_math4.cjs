const fs = require('fs');
const path = './src/data/mathematics.json';
const data = require(path);

const updates = [
    {
        id: "math-practice1-031",
        question: "The product of the square roots of two consecutive positive numbers is 2*sqrt(14), what is their sum?",
        questionLatex: "The product of the square roots of two consecutive positive numbers is $2\\sqrt{14}$, what is their sum?",
        choices: [
            { key: "A", text: "15" },
            { key: "B", text: "17" },
            { key: "C", text: "19" },
            { key: "D", text: "21" }
        ],
        answer: "A",
        explanation: "Let the numbers be x and x+1. sqrt(x) * sqrt(x+1) = 2*sqrt(14). Squaring both sides: x(x+1) = 4(14) = 56. Thus x^2 + x - 56 = 0, which factors as (x+8)(x-7) = 0. Since the numbers are positive, x = 7. The consecutive numbers are 7 and 8. Their sum is 7 + 8 = 15.",
        explanationLatex: "Let the numbers be $x$ and $x+1$. $\\sqrt{x} \\cdot \\sqrt{x+1} = 2\\sqrt{14}$. Squaring both sides: $x(x+1) = 4(14) = 56$. Thus $x^2 + x - 56 = 0$, which factors as $(x+8)(x-7) = 0$. Since the numbers are positive, $x = 7$. The numbers are $7$ and $8$. Their sum is $7 + 8 = 15$."
    },
    {
        id: "math-practice1-032",
        question: "Given the formula C = 5/9(F - 32); find F when C is 20.",
        questionLatex: "Given the formula $C = \\frac{5}{9}(F - 32)$; find F when C is 20.",
        choices: [
            { key: "A", text: "15" },
            { key: "B", text: "17" },
            { key: "C", text: "68" },
            { key: "D", text: "21" }
        ],
        answer: "C",
        explanation: "20 = 5/9 * (F - 32). Multiply both sides by 9/5: 20 * 9/5 = 36. So 36 = F - 32, which gives F = 36 + 32 = 68.",
        explanationLatex: "$20 = \\frac{5}{9}(F - 32)$. Multiply both sides by $\\frac{9}{5}$: $20 \\times \\frac{9}{5} = 36$. So $36 = F - 32$, which gives $F = 36 + 32 = 68$."
    },
    {
        id: "math-practice1-033",
        question: "What number added to 6% of itself equals 31.8?",
        questionLatex: "What number added to $6\\%$ of itself equals $31.8$?",
        choices: [
            { key: "A", text: "29.892" },
            { key: "B", text: "31.74" },
            { key: "C", text: "30" },
            { key: "D", text: "31" }
        ],
        answer: "C",
        explanation: "Let the number be x. x + 0.06x = 31.8. This means 1.06x = 31.8. So x = 31.8 / 1.06 = 30.",
        explanationLatex: "Let the number be $x$. $x + 0.06x = 31.8$. This means $1.06x = 31.8$. Hence $x = \\frac{31.8}{1.06} = 30$."
    },
    {
        id: "math-practice1-034",
        question: "Perform the indicated operations: (2a - 3)^2 - 3a(a - 2) - (3 - a)^2",
        questionLatex: "Perform the indicated operations: $(2a - 3)^2 - 3a(a - 2) - (3 - a)^2$",
        choices: [
            { key: "A", text: "2" },
            { key: "B", text: "0" },
            { key: "C", text: "-3" },
            { key: "D", text: "2a" }
        ],
        answer: "B",
        explanation: "Expanding the terms: (2a - 3)^2 = 4a^2 - 12a + 9. -3a(a - 2) = -3a^2 + 6a. -(3 - a)^2 = -(9 - 6a + a^2) = -a^2 + 6a - 9. Summing these: (4a^2 - 3a^2 - a^2) + (-12a + 6a + 6a) + (9 - 9) = 0 + 0 + 0 = 0.",
        explanationLatex: "Expanding the terms: $(2a - 3)^2 = 4a^2 - 12a + 9$. $-3a(a - 2) = -3a^2 + 6a$. $-(3 - a)^2 = -(9 - 6a + a^2) = -a^2 + 6a - 9$. Summing these: $(4a^2 - 3a^2 - a^2) + (-12a + 6a + 6a) + (9 - 9) = 0 + 0 + 0 = 0$."
    },
    {
        id: "math-practice1-035",
        question: "What must be the value of m if x - 5 is a factor of 2x^2 - mx - 35 ?",
        questionLatex: "What must be the value of m if $x - 5$ is a factor of $2x^2 - mx - 35$ ?",
        choices: [
            { key: "A", text: "3" },
            { key: "B", text: "5" },
            { key: "C", text: "7" },
            { key: "D", text: "10" }
        ],
        answer: "A",
        explanation: "By the Factor Theorem, if x-5 is a factor, then evaluating the polynomial at x=5 will yield 0. P(5) = 2(5)^2 - m(5) - 35 = 50 - 5m - 35 = 15 - 5m = 0. 5m = 15, so m = 3.",
        explanationLatex: "By the Factor Theorem, if $x - 5$ is a factor, then evaluating the polynomial at $x = 5$ will yield $0$. $P(5) = 2(5)^2 - m(5) - 35 = 50 - 5m - 35 = 15 - 5m = 0$. $5m = 15 \\implies m = 3$."
    },
    {
        id: "math-practice1-036",
        question: "Reduce (b+a)/(b-a) - 2(b/a - b/(a-b)) to a single fraction in its lowest terms.",
        questionLatex: "Reduce $\\frac{b+a}{b-a} - 2\\left(\\frac{b}{a} - \\frac{b}{a-b}\\right)$ to a single fraction in its lowest terms.",
        choices: [
            { key: "A", text: "(a+2b)/b" },
            { key: "B", text: "(-2a-b)/a" },
            { key: "C", text: "(-a-2b)/a" },
            { key: "D", text: "(2a+b)/b" }
        ],
        answer: "C",
        explanation: "First, simplify the term inside the parentheses: b/a - b/(a-b) = [b(a-b) - ab]/[a(a-b)] = [ab - b^2 - ab]/[a(a-b)] = -b^2/[a(a-b)]. Multiply by -2: 2b^2/[a(a-b)]. So the whole expression is (a+b)/(-(a-b)) + 2b^2/[a(a-b)] = [-a(a+b) + 2b^2] / [a(a-b)] = [-a^2 - ab + 2b^2] / [a(a-b)]. The numerator -a^2 - ab + 2b^2 factors into -(a-b)(a+2b). Dividing by a(a-b) gives -(a+2b)/a = (-a-2b)/a.",
        explanationLatex: "First simplify $\\frac{b}{a} - \\frac{b}{a-b} = \\frac{b(a-b) - ab}{a(a-b)} = \\frac{-b^2}{a(a-b)}$. The full expression is $\\frac{b+a}{-(a-b)} - 2\\left(\\frac{-b^2}{a(a-b)}\\right) = \\frac{-a(b+a) + 2b^2}{a(a-b)} = \\frac{-a^2-ab+2b^2}{a(a-b)}$. Factoring the numerator gives $-(a-b)(a+2b)$. Canceling $(a-b)$, the result is $\\frac{-(a+2b)}{a} = \\frac{-a-2b}{a}$."
    },
    {
        id: "math-practice1-037",
        question: "Find the quotient if 2x^3 - 3x^2 - 5x + 6 is divided by x^2 - 3x + 2.",
        questionLatex: "Find the quotient if $2x^3 - 3x^2 - 5x + 6$ is divided by $x^2 - 3x + 2$.",
        choices: [
            { key: "A", text: "2x - 3" },
            { key: "B", text: "2x + 3" },
            { key: "C", text: "-2x + 3" },
            { key: "D", text: "-2x - 3" }
        ],
        answer: "B",
        explanation: "Factor the divisor x^2 - 3x + 2 = (x-1)(x-2). Both are factors of the numerator. Doing polynomial long division, dividing 2x^3 - 3x^2 - 5x + 6 by x^2 - 3x + 2 yields quotient 2x + 3, since (x^2 - 3x + 2)(2x + 3) = 2x^3 + 3x^2 - 6x^2 - 9x + 4x + 6 = 2x^3 - 3x^2 - 5x + 6.",
        explanationLatex: "By polynomial long division, dividing $2x^3 - 3x^2 - 5x + 6$ by $x^2 - 3x + 2$ yields $2x + 3$. \\\\ $(x^2 - 3x + 2)(2x + 3) = 2x^3 + 3x^2 - 6x^2 - 9x + 4x + 6 = 2x^3 - 3x^2 - 5x + 6$."
    },
    {
        id: "math-practice1-038",
        question: "Ang mga bahay sa Tinio Street ay may sunud-sunod na bilang mula 1 hanggang 447. Ilang tanso na numero ang kailangan upang magawa ang lahat ng bilang ng mga bahay?",
        questionLatex: "Ang mga bahay sa Tinio Street ay may sunud-sunod na bilang mula 1 hanggang 447. Ilang tanso na numero ang kailangan upang magawa ang lahat ng bilang ng mga bahay?",
        choices: [
            { key: "A", text: "1232" },
            { key: "B", text: "1231" },
            { key: "C", text: "1236" },
            { key: "D", text: "1233" }
        ],
        answer: "D",
        explanation: "The numbers 1 to 9 use 9x1 = 9 digits. The numbers 10 to 99 use 90x2 = 180 digits. The numbers 100 to 447 represent 348 integers (447 - 100 + 1), and each uses 3 digits, so 348x3 = 1044 digits. Number of copper digits required = 9 + 180 + 1044 = 1233.",
        explanationLatex: "The numbers $1$ to $9$ use $9 \\times 1 = 9$ digits. The numbers $10$ to $99$ use $90 \\times 2 = 180$ digits. The numbers $100$ to $447$ run for $348$ integers ($447 - 100 + 1$), and each uses $3$ digits, so $348 \\times 3 = 1044$ digits. Total digits (tanso) required = $9 + 180 + 1044 = 1233$."
    },
    {
        id: "math-practice1-039",
        question: "Solve for x: (7x)/5 - (1/14)(x - 11) = (3/7)(x - 25) + 34",
        questionLatex: "Solve for x: $\\frac{7x}{5} - \\frac{1}{14}(x-11) = \\frac{3}{7}(x-25) + 34$",
        choices: [
            { key: "A", text: "4" },
            { key: "B", text: "11" },
            { key: "C", text: "18" },
            { key: "D", text: "25" }
        ],
        answer: "D",
        explanation: "Multiply the entire equation by the LCM of 5, 14, and 7, which is 70. 70*(7x)/5 - 70*(1/14)(x-11) = 70*(3/7)(x-25) + 70*34. This simplifies to 14(7x) - 5(x-11) = 30(x-25) + 2380. 98x - 5x + 55 = 30x - 750 + 2380. 93x + 55 = 30x + 1630. 63x = 1575. x = 25.",
        explanationLatex: "Multiply the entire equation by the LCM of $5, 14, 7$, which is $70$. \\\\ $70\\left(\\frac{7x}{5}\\right) - 70\\left(\\frac{1}{14}(x-11)\\right) = 70\\left(\\frac{3}{7}(x-25)\\right) + 70(34)$ \\\\ $14(7x) - 5(x-11) = 30(x-25) + 2380$ \\\\ $98x - 5x + 55 = 30x - 750 + 2380$ \\\\ $93x + 55 = 30x + 1630 \\implies 63x = 1575 \\implies x = 25$."
    },
    {
        id: "math-practice1-040",
        question: "The length of a room is 8 feet greater than its width; if each dimension is increased by 2 feet, the area will be increased by 60 square feet. Find the area of the floor.",
        questionLatex: "The length of a room is $8$ feet greater than its width; if each dimension is increased by $2$ feet, the area will be increased by $60$ square feet. Find the area of the floor.",
        choices: [
            { key: "A", text: "65" },
            { key: "B", text: "105" },
            { key: "C", text: "153" },
            { key: "D", text: "180" }
        ],
        answer: "D",
        explanation: "Let the width be w and the length be l = w + 8. The area A = w(w + 8) = w^2 + 8w. If each is increased by 2, old width becomes w+2 and old length becomes w+10. New Area = (w+2)(w+10) = w^2 + 12w + 20. The increase in area is New Area - A = (w^2 + 12w + 20) - (w^2 + 8w) = 4w + 20 = 60. So 4w = 40, w = 10. The length is 18, and the initial area is 10 * 18 = 180 square feet.",
        explanationLatex: "Let the width be $w$ and length be $w + 8$. Area $A = w(w + 8) = w^2 + 8w$. \\\\ If each is increased by $2$, the new width is $w+2$ and new length is $w+10$. \\\\ New Area $= (w+2)(w+10) = w^2 + 12w + 20$. \\\\ The increase is $(w^2 + 12w + 20) - (w^2 + 8w) = 4w + 20 = 60$. \\\\ $4w = 40 \\implies w = 10$. \\\\ The length is $18$, and the initial area is $10 \\times 18 = 180$."
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
