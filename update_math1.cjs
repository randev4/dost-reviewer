const fs = require('fs');
const path = './src/data/mathematics.json';
const data = require(path);

const updates = [
  {
    id: "math-practice1-001",
    question: "Find the contrapositive of the following statement. “If a figure has three sides, it is a triangle.”",
    questionLatex: "Find the contrapositive of the following statement. “If a figure has three sides, it is a triangle.”",
    choices: [
      { key: "A", text: "If a figure does not have three sides, it is a triangle." },
      { key: "B", text: "If a figure is a triangle, then it does not have three sides." },
      { key: "C", text: "If a figure is not a triangle, then it does not have three sides." },
      { key: "D", text: "If a figure has three sides, it is not a triangle." }
    ],
    answer: "C",
    explanation: "The contrapositive of \"If P then Q\" is \"If not Q then not P\". Here, P is \"a figure has three sides\", and Q is \"it is a triangle\". Not Q is \"it is not a triangle\", and not P is \"it does not have three sides\".",
    explanationLatex: "The contrapositive of $P \\implies Q$ is $\\neg Q \\implies \\neg P$."
  },
  {
    id: "math-practice1-002",
    question: "Solve for x: sqrt(x + 6) + sqrt(x) = 4",
    questionLatex: "Solve for x: $\\sqrt{x+6} + \\sqrt{x} = 4$",
    choices: [
      { key: "A", text: "no solution" },
      { key: "B", text: "100" },
      { key: "C", text: "5" },
      { key: "D", text: "25/16" }
    ],
    answer: "D",
    explanation: "sqrt(x+6) = 4 - sqrt(x). Squaring both sides: x + 6 = 16 - 8*sqrt(x) + x. Simplifying: 6 = 16 - 8*sqrt(x) -> 8*sqrt(x) = 10 -> sqrt(x) = 10/8 = 5/4. Squaring both sides again: x = 25/16.",
    explanationLatex: "$\\sqrt{x+6} = 4 - \\sqrt{x}$. Squaring both sides: $x + 6 = 16 - 8\\sqrt{x} + x$. Simplifying: $6 = 16 - 8\\sqrt{x} \\implies 8\\sqrt{x} = 10 \\implies \\sqrt{x} = \\frac{5}{4}$. Squaring both sides again: $x = \\frac{25}{16}$."
  },
  {
    id: "math-practice1-003",
    question: "Find the length of diagonal AC in the rectangular solid shown. Dimensions are in feet.",
    questionLatex: "Find the length of diagonal $\\overline{AC}$ in the rectangular solid shown. Dimensions are in feet.",
    choices: [
      { key: "A", text: "29 + d^2 ft" },
      { key: "B", text: "7 + d ft" },
      { key: "C", text: "sqrt(29 + d^2) ft" },
      { key: "D", text: "sqrt(7 + d) ft" }
    ],
    answer: "C",
    explanation: "The diagonal of a rectangular prism with dimensions l, w, h is sqrt(l^2 + w^2 + h^2). Here, the dimensions are 2, 5, and d. So the diagonal is sqrt(2^2 + 5^2 + d^2) = sqrt(4 + 25 + d^2) = sqrt(29 + d^2).",
    explanationLatex: "The major diagonal of a rectangular solid with dimensions $l, w, h$ is $\\sqrt{l^2 + w^2 + h^2}$. Here, the dimensions are $2, 5,$ and $d$. So the diagonal is $\\sqrt{2^2 + 5^2 + d^2} = \\sqrt{4 + 25 + d^2} = \\sqrt{29 + d^2}$."
  },
  {
    id: "math-practice1-004",
    question: "The area of a regular octagon is 30 cm^2. What is the area of a regular octagon with sides four times as large?",
    questionLatex: "The area of a regular octagon is $30\\text{ cm}^2$. What is the area of a regular octagon with sides four times as large?",
    choices: [
      { key: "A", text: "545 cm^2" },
      { key: "B", text: "480 cm^2" },
      { key: "C", text: "3600 cm^2" },
      { key: "D", text: "120 cm^2" }
    ],
    answer: "B",
    explanation: "The ratio of the areas of two similar polygons is the square of the ratio of their corresponding sides. Since the side length increases by a factor of 4, the area increases by a factor of 4^2 = 16. So the new area is 30 * 16 = 480.",
    explanationLatex: "The ratio of the areas of two similar polygons is the square of the ratio of their corresponding sides. Since the side length increases by a factor of $4$, the area increases by a factor of $4^2 = 16$. So the new area is $30 \\times 16 = 480$."
  },
  {
    id: "math-practice1-005",
    question: "Simplify: (sqrt(3) - sqrt(7))(sqrt(3) + sqrt(7))",
    questionLatex: "Simplify: $(\\sqrt{3} - \\sqrt{7})(\\sqrt{3} + \\sqrt{7})$",
    choices: [
      { key: "A", text: "-4" },
      { key: "B", text: "58" },
      { key: "C", text: "10" },
      { key: "D", text: "-40" }
    ],
    answer: "A",
    explanation: "Using the difference of squares formula (a - b)(a + b) = a^2 - b^2, we get (sqrt(3))^2 - (sqrt(7))^2 = 3 - 7 = -4.",
    explanationLatex: "Using the difference of squares formula $(a - b)(a + b) = a^2 - b^2$, we get $(\\sqrt{3})^2 - (\\sqrt{7})^2 = 3 - 7 = -4$."
  },
  {
    id: "math-practice1-006",
    question: "If the sum of the roots of x^2 + 3x - 5 = 0 is added to the product of its roots, the result is",
    questionLatex: "If the sum of the roots of $x^2 + 3x - 5 = 0$ is added to the product of its roots, the result is",
    choices: [
      { key: "A", text: "-2" },
      { key: "B", text: "-8" },
      { key: "C", text: "-15" },
      { key: "D", text: "15" }
    ],
    answer: "B",
    explanation: "For the quadratic equation ax^2 + bx + c = 0, the sum of roots is -b/a and product is c/a. Here a=1, b=3, c=-5. Sum = -3, Product = -5. Sum + Product = -3 + (-5) = -8.",
    explanationLatex: "For $ax^2 + bx + c = 0$, the sum of roots is $-\\frac{b}{a}$ and the product is $\\frac{c}{a}$. Here, we have $x^2 + 3x - 5 = 0$, so the sum is $-\\frac{3}{1} = -3$ and the product is $-\\frac{5}{1} = -5$. Sum + Product = $-3 + (-5) = -8$."
  },
  {
    id: "math-practice1-007",
    question: "The roots of the equation 2x^2 - x = 4 are",
    questionLatex: "The roots of the equation $2x^2 - x = 4$ are",
    choices: [
      { key: "A", text: "real, rational, and unequal" },
      { key: "B", text: "real and irrational" },
      { key: "C", text: "real, rational, and equal" },
      { key: "D", text: "imaginary" }
    ],
    answer: "B",
    explanation: "Rearranging: 2x^2 - x - 4 = 0. The discriminant is b^2 - 4ac = (-1)^2 - 4(2)(-4) = 1 + 32 = 33. Since 33 is positive but not a perfect square, the roots are real, irrational, and unequal.",
    explanationLatex: "Rearranging to standard form gives $2x^2 - x - 4 = 0$. The discriminant is $\\Delta = b^2 - 4ac = (-1)^2 - 4(2)(-4) = 1 + 32 = 33$. Since $33 > 0$ and is not a perfect square, the roots are real and irrational."
  },
  {
    id: "math-practice1-008",
    question: "Which statement must be true if a parabola represented by the equation y = ax^2 + bx + c does not intersect the x-axis?",
    questionLatex: "Which statement must be true if a parabola represented by the equation $y = ax^2 + bx + c$ does not intersect the x-axis?",
    choices: [
      { key: "A", text: "b^2 - 4ac > 0, and b^2 - 4ac is not a perfect square" },
      { key: "B", text: "b^2 - 4ac > 0, and b^2 - 4ac is a perfect square" },
      { key: "C", text: "b^2 - 4ac < 0" },
      { key: "D", text: "b^2 - 4ac = 0" }
    ],
    answer: "C",
    explanation: "If a parabola does not intersect the x-axis, it has no real roots. For a quadratic equation ax^2 + bx + c = 0, this occurs when the discriminant b^2 - 4ac < 0.",
    explanationLatex: "If a parabola does not intersect the x-axis, the corresponding quadratic equation $ax^2 + bx + c = 0$ has no real roots. This happens if and only if the discriminant is negative, meaning $b^2 - 4ac < 0$."
  },
  {
    id: "math-practice1-009",
    question: "The value of (3^0 / 27^(2/3))^-1 is",
    questionLatex: "The value of $\\left( \\frac{3^0}{27^{\\frac{2}{3}}} \\right)^{-1}$ is",
    choices: [
      { key: "A", text: "-9" },
      { key: "B", text: "-1/9" },
      { key: "C", text: "9" },
      { key: "D", text: "1/9" }
    ],
    answer: "C",
    explanation: "3^0 = 1. 27^(2/3) = (27^(1/3))^2 = 3^2 = 9. So the expression inside the parentheses is 1/9. (1/9)^-1 = 9.",
    explanationLatex: "$3^0 = 1$. $27^{\\frac{2}{3}} = (\\sqrt[3]{27})^2 = 3^2 = 9$. So the expression is $\\left(\\frac{1}{9}\\right)^{-1} = 9$."
  },
  {
    id: "math-practice1-010",
    question: "What is the last term in the expansion of (x + 2y)^5 ?",
    questionLatex: "What is the last term in the expansion of $(x + 2y)^5$ ?",
    choices: [
      { key: "A", text: "2y^5" },
      { key: "B", text: "32y^5" },
      { key: "C", text: "y^5" },
      { key: "D", text: "10y^5" }
    ],
    answer: "B",
    explanation: "By the Binomial Theorem, the last term of (a + b)^n is b^n. Here b = 2y and n = 5, so the last term is (2y)^5 = 32y^5.",
    explanationLatex: "By the binomial theorem, the last term in the expansion of $(a + b)^n$ is $b^n$. Here, $b = 2y$ and $n = 5$, so the term is $(2y)^5 = 32y^5$."
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
