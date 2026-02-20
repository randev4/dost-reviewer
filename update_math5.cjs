const fs = require('fs');
const path = './src/data/mathematics.json';
const data = require(path);

const updates = [
    {
        id: "math-practice1-041",
        question: "Find the greatest common factor of 3x^2 + 6x - 9, 6x^2 - 21x + 15, and 6x^3 - 6.",
        questionLatex: "Find the greatest common factor of $3x^2 + 6x - 9$, $6x^2 - 21x + 15$, and $6x^3 - 6$.",
        choices: [
            { key: "A", text: "3(x-1)" },
            { key: "B", text: "3(x+3)" },
            { key: "C", text: "3(x+1)" },
            { key: "D", text: "3(x-3)" }
        ],
        answer: "A",
        explanation: "Factor each expression: 3x^2 + 6x - 9 = 3(x^2 + 2x - 3) = 3(x+3)(x-1). 6x^2 - 21x + 15 = 3(2x^2 - 7x + 5) = 3(2x-5)(x-1). 6x^3 - 6 = 6(x^3 - 1) = 6(x-1)(x^2 + x + 1). The common factor in all three is 3(x-1).",
        explanationLatex: "Factor each polynomial: \\\\ $3x^2 + 6x - 9 = 3(x^2 + 2x - 3) = 3(x+3)(x-1)$ \\\\ $6x^2 - 21x + 15 = 3(2x^2 - 7x + 5) = 3(2x-5)(x-1)$ \\\\ $6x^3 - 6 = 6(x^3 - 1) = 6(x-1)(x^2 + x + 1)$ \\\\ The greatest common factor in all three expressions is $3(x-1)$."
    },
    {
        id: "math-practice1-042",
        question: "Find the equation of the line that passes through the point (-2,-5) and is parallel to the line 5x-4y=2.",
        questionLatex: "Find the equation of the line that passes through the point $(-2,-5)$ and is parallel to the line $5x-4y=2$.",
        choices: [
            { key: "A", text: "5x-4y=-17" },
            { key: "B", text: "-2x-5y=2" },
            { key: "C", text: "5x+4y=2" },
            { key: "D", text: "5x-4y=10" }
        ],
        answer: "D",
        explanation: "Parallel lines have the same slope, so the new line will be in the form 5x - 4y = C. Substitute the given point (-2, -5) into this equation: 5(-2) - 4(-5) = -10 + 20 = 10. Thus, C = 10, and the equation is 5x - 4y = 10.",
        explanationLatex: "Parallel lines have the same slope, so the new line is of the form $5x - 4y = C$. Substitute the given point $(-2, -5)$: $5(-2) - 4(-5) = -10 + 20 = 10$. Thus, $C = 10$ and the equation is $5x - 4y = 10$."
    },
    {
        id: "math-practice1-043",
        question: "Simplify: ((4x^-3 p^2)/y^-2)^-2 * ((y^3 p^5)/x^2)^-3",
        questionLatex: "Simplify: $\\left(\\frac{4x^{-3}p^2}{y^{-2}}\\right)^{-2} \\left(\\frac{y^3 p^5}{x^2}\\right)^{-3}$",
        choices: [
            { key: "A", text: "(x^6 y^4) / (16p^14)" },
            { key: "B", text: "(-16x^12) / (y^11 p^15)" },
            { key: "C", text: "(x^6) / (4y^10 p^19)" },
            { key: "D", text: "(x^12) / (16y^13 p^19)" }
        ],
        answer: "D",
        explanation: "First part: ((4p^2 y^2)/x^3)^-2 = (x^3 / (4p^2 y^2))^2 = x^6 / (16p^4 y^4). Second part: (x^2 / (y^3 p^5))^3 = x^6 / (y^9 p^15). Multiplying these: x^6/(16p^4 y^4) * x^6/(y^9 p^15) = x^12 / (16y^13 p^19).",
        explanationLatex: "First fraction: $\\left(\\frac{4x^{-3}p^2}{y^{-2}}\\right)^{-2} = \\left(\\frac{4p^2 y^2}{x^3}\\right)^{-2} = \\left(\\frac{x^3}{4p^2 y^2}\\right)^2 = \\frac{x^6}{16p^4 y^4}$. \\\\ Second fraction: $\\left(\\frac{y^3 p^5}{x^2}\\right)^{-3} = \\left(\\frac{x^2}{y^3 p^5}\\right)^3 = \\frac{x^6}{y^9 p^{15}}$. \\\\ Multiplying gives $\\frac{x^6}{16p^4 y^4} \\cdot \\frac{x^6}{y^9 p^{15}} = \\frac{x^{12}}{16y^{13} p^{19}}$."
    },
    {
        id: "math-practice1-044",
        question: "Simplify: (6x^(1/2) - 7y^(7/2))(6x^(1/2) + 7y^(7/2))",
        questionLatex: "Simplify: $\\left(6x^{1/2} - 7y^{7/2}\\right)\\left(6x^{1/2} + 7y^{7/2}\\right)$",
        choices: [
            { key: "A", text: "36x - 42xy + 49y^7" },
            { key: "B", text: "36x - 49y^7" },
            { key: "C", text: "36x + 42xy - 49y^7" },
            { key: "D", text: "36x + 49y^7" }
        ],
        answer: "B",
        explanation: "This is a difference of squares: (a - b)(a + b) = a^2 - b^2. Here a = 6x^(1/2) and b = 7y^(7/2). So (6x^(1/2))^2 - (7y^(7/2))^2 = 36x - 49y^7.",
        explanationLatex: "Using the difference of squares $(a - b)(a + b) = a^2 - b^2$, we have: \\\\ $\\left(6x^{1/2}\\right)^2 - \\left(7y^{7/2}\\right)^2 = 36x - 49y^{7/2 \\times 2} = 36x - 49y^7$."
    },
    {
        id: "math-practice1-045",
        question: "Simplify: (cuberoot(x^6 y^3) * x y^4) / (sqrt(x^2 y^8) * (xy)^-3)",
        questionLatex: "Simplify: $\\frac{\\sqrt[3]{x^6 y^3} x y^4}{\\sqrt{x^2 y^8} (xy)^{-3}}$",
        choices: [
            { key: "A", text: "x^4 y^3" },
            { key: "B", text: "xy" },
            { key: "C", text: "x^5 y^6" },
            { key: "D", text: "x^5 y^4" }
        ],
        answer: "D",
        explanation: "Simplify the numerator: cuberoot(x^6 y^3) = x^2 y. So numerator is (x^2 y)(x y^4) = x^3 y^5. Simplify the denominator: sqrt(x^2 y^8) = x y^4. (xy)^-3 = x^-3 y^-3. So denominator is (x y^4)(x^-3 y^-3) = x^-2 y^1. Divide numerator by denominator: (x^3 y^5) / (x^-2 y^1) = x^(3 - -2) * y^(5 - 1) = x^5 y^4.",
        explanationLatex: "Numerator: $\\sqrt[3]{x^6 y^3} = x^2 y$. The numerator becomes $(x^2 y)(x y^4) = x^3 y^5$. \\\\ Denominator: $\\sqrt{x^2 y^8} = x y^4$. $(xy)^{-3} = x^{-3} y^{-3}$. The denominator becomes $(x y^4)(x^{-3} y^{-3}) = x^{-2} y^1$. \\\\ Dividing numerator by denominator: $\\frac{x^3 y^5}{x^{-2} y} = x^{3 - (-2)} y^{5 - 1} = x^5 y^4$."
    },
    {
        id: "math-practice1-046",
        question: "Use similar triangles to find x. (The base of the large right triangle is 9 ft and its height is 5 ft. The nested smaller right triangle shares the same acute angle, with base 3 ft and height x.)",
        questionLatex: "Use similar triangles to find x. (The base of the large right triangle is $9\\text{ ft}$ and its height is $5\\text{ ft}$. The nested smaller right triangle shares the same acute angle, with base $3\\text{ ft}$ and height $x$.)",
        choices: [
            { key: "A", text: "8/9 ft" },
            { key: "B", text: "5.4 ft" },
            { key: "C", text: "15 ft" },
            { key: "D", text: "1 2/3 ft" }
        ],
        answer: "D",
        explanation: "Since the triangles are similar, the ratio of their corresponding sides must be equal. x / 3 = 5 / 9. Multiply both sides by 3 to solve for x: x = (5 / 9) * 3 = 5 / 3. Written as a mixed fraction, this is 1 2/3.",
        explanationLatex: "By similar triangles, the ratio of height to base is equal: $\\frac{x}{3} = \\frac{5}{9} \\implies 9x = 15 \\implies x = \\frac{15}{9} = \\frac{5}{3} = 1\\frac{2}{3}\\text{ ft}$."
    },
    {
        id: "math-practice1-047",
        question: "Given: PQ is parallel to BC. Find the length of AC. (In triangle ABC, P is on AB, Q is on AC, AP=6, PB=8, QC=12)",
        questionLatex: "Given: $\\overline{PQ} \\parallel \\overline{BC}$. Find the length of $\\overline{AC}$. (In $\\Delta ABC$, $P$ is on $AB$, $Q$ is on $AC$, $AP=6$, $PB=8$, $QC=12$)",
        choices: [
            { key: "A", text: "17" },
            { key: "B", text: "21" },
            { key: "C", text: "23" },
            { key: "D", text: "18" }
        ],
        answer: "B",
        explanation: "Because PQ is parallel to BC, triangles APQ and ABC are similar. By the Triangle Proportionality Theorem, AP / PB = AQ / QC. 6 / 8 = AQ / 12 -> 3 / 4 = AQ / 12 -> 4*AQ = 36 -> AQ = 9. The total length of AC = AQ + QC = 9 + 12 = 21.",
        explanationLatex: "By the Triangle Proportionality Theorem, $\\frac{AP}{PB} = \\frac{AQ}{QC}$. \\\\ $\\frac{6}{8} = \\frac{AQ}{12} \\implies \\frac{3}{4} = \\frac{AQ}{12} \\implies AQ = 9$. \\\\ Thus $AC = AQ + QC = 9 + 12 = 21$."
    },
    {
        id: "math-practice1-048",
        question: "The numbers 27, 36, and 45 represents the length of the sides of a/an",
        questionLatex: "The numbers 27, 36, and 45 represents the length of the sides of a/an",
        choices: [
            { key: "A", text: "acute triangle" },
            { key: "B", text: "obtuse triangle" },
            { key: "C", text: "no triangle" },
            { key: "D", text: "right triangle" }
        ],
        answer: "D",
        explanation: "Check the Pythagorean theorem. 27^2 + 36^2 = 729 + 1296 = 2025. And 45^2 = 2025. Since a^2 + b^2 = c^2, it is a right triangle. (We can also notice these are multiples of the 3-4-5 right triangle: 9*3, 9*4, 9*5).",
        explanationLatex: "Notice that $27, 36, 45$ is a multiple of the Pythagorean triple $3, 4, 5$ (scaled by $9$: $9 \\times 3, 9 \\times 4, 9 \\times 5$). Thus, it forms a right triangle."
    },
    {
        id: "math-practice1-049",
        question: "In the figure shown, square WXYZ is inscribed in circle O. Also, OM is perpendicular to XY and OM = 7. Find the area of the shaded region.",
        questionLatex: "In the figure shown, square WXYZ is inscribed in circle O. Also, $\\overline{OM} \\perp \\overline{XY}$ and $OM = 7$. Find the area of the shaded region.",
        choices: [
            { key: "A", text: "49*pi - 49" },
            { key: "B", text: "49*sqrt(2)*pi - 49" },
            { key: "C", text: "98*pi - 196" },
            { key: "D", text: "147*pi - 196" }
        ],
        answer: "C",
        explanation: "Because OM is the perpendicular bisector from the center to side XY, it is half the side length of the square. Thus side = 14. Area of square = 14^2 = 196. The diagonal of the square is 14*sqrt(2), which is also the diameter of the circle. The radius is 7*sqrt(2). The area of the circle is pi * (7*sqrt(2))^2 = 98*pi. The shaded region is Area of circle - Area of square = 98*pi - 196.",
        explanationLatex: "Since $OM \\perp XY$ from the center, $OM$ is the apothem. The side of the square is $2 \\times OM = 14$. The area of the square is $14^2 = 196$. The diagonal is $14\\sqrt{2}$, making the circle's radius $r = 7\\sqrt{2}$. The circle's area is $\\pi r^2 = \\pi (7\\sqrt{2})^2 = 98\\pi$. The shaded area is $98\\pi - 196$."
    },
    {
        id: "math-practice1-050",
        question: "Simplify: (5/6 + 1/3) / (2 - (7/8 - 1/3))",
        questionLatex: "Simplify: $\\frac{\\frac{5}{6} + \\frac{1}{3}}{2 - \\left(\\frac{7}{8} - \\frac{1}{3}\\right)}$",
        choices: [
            { key: "A", text: "3/8" },
            { key: "B", text: "4/5" },
            { key: "C", text: "2/3" },
            { key: "D", text: "1/6" }
        ],
        answer: "B",
        explanation: "Numerator: 5/6 + 2/6 = 7/6. Denominator inner part: 7/8 - 1/3 = 21/24 - 8/24 = 13/24. Denominator: 2 - 13/24 = 48/24 - 13/24 = 35/24. Fraction: (7/6) / (35/24) = (7/6) * (24/35) = 1 * 4/5 = 4/5.",
        explanationLatex: "Numerator: $\\frac{5}{6} + \\frac{1}{3} = \\frac{5}{6} + \\frac{2}{6} = \\frac{7}{6}$. \\\\ Denominator inner: $\\frac{7}{8} - \\frac{1}{3} = \\frac{21}{24} - \\frac{8}{24} = \\frac{13}{24}$. \\\\ Denominator: $2 - \\frac{13}{24} = \\frac{48}{24} - \\frac{13}{24} = \\frac{35}{24}$. \\\\ Final fraction: $\\frac{\\frac{7}{6}}{\\frac{35}{24}} = \\frac{7}{6} \\cdot \\frac{24}{35} = \\frac{1 \\cdot 4}{1 \\cdot 5} = \\frac{4}{5}$."
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
