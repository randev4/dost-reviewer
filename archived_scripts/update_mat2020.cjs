const fs = require('fs');
const path = './src/data/mathematics.json';
const data = require(path);

const updates = [
    {
        id: "mat-2020-002",
        questionLatex: "Which of the following statements are true? \\nI. A rectangle is a parallelogram. \\nII. A square is a rhombus. \\nIII. A square is a rectangle. \\nIV. A parallelogram is a rhombus."
    },
    {
        id: "mat-2020-015",
        questionLatex: "Which of the following is true about right triangle ABC? \\nI. The hypotenuse is the longest side. \\nII. The sum of the degree measures of its internal angles is $180^\\circ$. \\nIII. The sum of the squares of the lengths of its legs is equal to the square of the length of its hypotenuse."
    },
    {
        id: "mat-2020-016",
        questionLatex: "Given the following investment opportunities with simple annual interest rates and duration:",
        explanation: "This question relies on a missing table. Based on the provided choices, the best choice cannot be fully deduced without the original data.",
        explanationLatex: "This question relies on a missing table. Based on the provided choices, the best choice cannot be fully deduced without the original data."
    },
    {
        id: "mat-2020-017",
        questionLatex: "Which of the following expressions is equal to $\\sin A$? \\nI. $\\cos B$ \\nII. $\\cos D$ \\nIII. $\\cos E$",
        explanation: "Complementary angles in a right triangle have equal sine and cosine.",
        explanationLatex: "If $A$ and $B$ are complementary angles in a right triangle, then $\\sin A = \\cos B$."
    },
    {
        id: "mat-2020-019",
        questionLatex: "A survey was conducted on 30 people on their TV viewing preference and is presented in a Venn diagram shown above. Which of the following narrative best describes the Venn diagram?",
        explanation: "This is based on analyzing the intersections in the provided Venn Diagram. Total people is 30.",
        explanationLatex: "This is based on analyzing the intersections in the provided Venn Diagram. Total people is 30."
    },
    {
        id: "mat-2020-020",
        questionLatex: "Given the sequence of first nine prime numbers: $2, 3, 5, 7, 11, 13, 17, 19, 23$. Can four numbers be chosen to form an arithmetic sequence?",
        explanation: "Looking at the primes, the numbers 5, 11, 17, 23 form an arithmetic progression with a common difference of 6.",
        explanationLatex: "Looking at the primes, the numbers $5, 11, 17, 23$ form an arithmetic progression with a common difference of $6$."
    },
    {
        id: "mat-2020-021",
        questionLatex: "Twenty chocolate candies were placed in a jar and mixed thoroughly: 8 Curly Tops and 12 Flat Tops. Two students were asked to get a candy from the jar, one at a time, without looking into the jar. The first student got a Flat Top while the second student did not show his/her chocolate candy. If you were asked to pick a chocolate candy from the remaining candies in the jar, what would be the more likely outcome?",
        explanation: "After the first student picked a Flat Top, there are 11 Flat Tops and 8 Curly Tops remaining. Regardless of what the second student picked, the expected number of Flat Tops is still higher than Curly Tops. Thus, it is more likely to pick a Flat Top.",
        explanationLatex: "After the first student, there are $11$ Flat Tops and $8$ Curly Tops remaining. The expected proportion remains in favor of Flat Tops. Thus, picking a Flat Top remains the more likely outcome."
    },
    {
        id: "mat-2020-022",
        questionLatex: "If you rolled two six-sided dice simultaneously, which of the following would be the most likely outcome?",
        explanation: "The product is even if at least one die is even. The probability of both odd is 1/4 (1/2 * 1/2), so probability of an even product is 3/4. The probability of an even sum is 1/2. Thus an even product is the most likely.",
        explanationLatex: "The product is even if at least one die is even. $P(\\text{Both Odd}) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$, so $P(\\text{Even Product}) = 1 - \\frac{1}{4} = \\frac{3}{4}$. The probability of an even sum is $\\frac{1}{2}$. Thus, an even product is most likely."
    },
    {
        id: "mat-2020-023",
        questionLatex: "If $x= 13, y= 17$ and $z$ are sides of a triangle, which of the following numbers is a possible value of $z$?",
        choices: [
            { key: "A", text: "2" },
            { key: "B", text: "4" },
            { key: "C", text: "30" },
            { key: "D", text: "15" }
        ],
        explanation: "By the Triangle Inequality Theorem, the length of the third side must be greater than the difference and less than the sum of the other two sides. 17 - 13 < z < 17 + 13, so 4 < z < 30. The only option in this range is 15.",
        explanationLatex: "By the Triangle Inequality Theorem, the length of the third side must be greater than the difference and less than the sum of the other two sides. $17 - 13 < z < 17 + 13$, so $4 < z < 30$. The only option in this range is $15$."
    },
    {
        id: "mat-2020-024",
        questionLatex: "The elements of the sequence 1, 3, 6, 10, 15, 21, … are called triangular numbers. Which of the following statements are true about the sequence? \\nI. 55 is a triangular number. \\nII. The nth triangular number $t_n$ is given by $t_n = \\frac{n(n+1)}{2}$. \\nIII. The sum of two consecutive triangular numbers is a perfect square.",
        explanation: "Statement I is true because 55 is the 10th triangular number. Statement II is the definition of a triangular number. Statement III is true because n(n+1)/2 + n(n-1)/2 = n^2, which is a perfect square.",
        explanationLatex: "All statements are true. I: $t_{10} = 55$. II: Standard formula $t_n = \\frac{n(n+1)}{2}$. III: $t_n + t_{n-1} = \\frac{n(n+1)}{2} + \\frac{n(n-1)}{2} = \\frac{n^2+n+n^2-n}{2} = n^2$, a perfect square."
    },
    {
        id: "mat-2020-025",
        questionLatex: "Let $X, Y$ and $Z$ be sets. Which of the following equalities is not true?",
        explanation: "Using De Morgan's laws and set distributivity, we can determine the valid identities. Option C incorrectly applies distributivity.",
        explanationLatex: "Using Set Theory properties, De Morgan's laws and distributive laws, Option C is not universally true."
    },
    {
        id: "mat-2020-026",
        questionLatex: "What should be multiplied to the binomial $a^2 - ab + b^2$ so that the product is a binomial?",
        explanation: "Multiplying (a+b) by (a^2 - ab + b^2) gives a^3 + b^3, which is a binomial (the sum of two cubes).",
        explanationLatex: "Multiplying $(a+b)$ by $(a^2 - ab + b^2)$ yields $a^3 + b^3$, which is a binomial."
    },
    {
        id: "mat-2020-028",
        questionLatex: "Given the following investment opportunities with simple annual interest rates and duration: \\nI. 10\\% per annum for 5 years \\nII. 13\\% per annum for 4 years \\nIII. 15\\% per annum for 3 years \\nArrange the investment opportunity from best opportunity to good opportunity.",
        explanation: "Total simple interest is rate * duration. I: 10% * 5 = 50%. II: 13% * 4 = 52%. III: 15% * 3 = 45%. The best is II (52%), then I (50%), then III (45%). Therefore the order is II, I, III.",
        explanationLatex: "Total simple interest return $= r \\times t$. \\nI: $10\\% \\times 5 = 50\\%$. \\nII: $13\\% \\times 4 = 52\\%$. \\nIII: $15\\% \\times 3 = 45\\%$. \\nOrganized from highest to lowest: II, I, III."
    },
    {
        id: "mat-2020-029",
        questionLatex: "A farmer borrowed Php $100,000$ from a cooperative with an annual simple interest rate of 10\\%. Which of the following computation shows the amount the farmer owes the cooperative after 2 years?"
    },
    {
        id: "mat-2020-030",
        questionLatex: "Which of the following expressions is correct? \\nI. $\\cos A = \\cos D$ \\nII. $\\cos A = \\sin B$ \\nIII. $\\cos D = \\sin E$",
        explanation: "In a right triangle, the cosine of an acute angle is equal to the sine of its complement.",
        explanationLatex: "In a right triangle $ABC$ with right angle $C$, $A$ and $B$ are complementary. Thus $\\cos A = \\sin B$."
    },
    {
        id: "mat-2020-031",
        questionLatex: "From the top end of 200-m long zip line, the angle of depression to the bottom end is $20$ degrees. Assuming the zip line is a straight line, which of the following expressions show how to compute the height of the top end of the zip line?",
        explanation: "Using the right triangle formed, the wire is the hypotenuse (200m). The height is the opposite side to the angle of elevation (which equals the angle of depression of 20 degrees). Thus, sin(20) = height / 200, so height = 200 sin 20.",
        explanationLatex: "Let $h$ be the height. The length of the zip line is the hypotenuse ($200$ m). $\\sin(20^\\circ) = \\frac{h}{200} \\implies h = 200 \\sin(20^\\circ)$."
    },
    {
        id: "mat-2020-032",
        questionLatex: "Given: \\nA = \\{Diego, Jepoy, Jasmine, Ivy, Emilia\\} \\nB = \\{Arnaldo, Emilia, Raul, Diego, Maja\\} \\nIf sets A and B represent the friends of Arlene and Bayani, respectively, what does $A \\cup B$ represent?",
        explanation: "The union of two sets A and B (A U B) represents all elements that are in A, or in B, or in both. Thus it represents the combined friends of Arlene and Bayani.",
        explanationLatex: "The union operator $\\cup$ combines elements from both sets without duplication, representing the combined friends."
    },
    {
        id: "mat-2020-033",
        questionLatex: "Given the arithmetic sequence of six numbers: $6, 12, 18, 24, 30, 36$. Which three numbers can be chosen to form a geometric sequence?",
        explanation: "A geometric sequence has a constant ratio. Choosing 6, 12, 24 provides a constant ratio of 2 (12/6 = 2, 24/12 = 2).",
        explanationLatex: "Choosing $6, 12, 24$, we see the common ratio is $r = \\frac{12}{6} = \\frac{24}{12} = 2$. Thus it forms a geometric sequence."
    },
    {
        id: "mat-2020-034",
        questionLatex: "If you rolled two six-sided dice simultaneously, which of the following would be the most likely outcome?",
        explanation: "As analyzed previously, 'At least one die is even' has a probability of 1 - P(Both Odd) = 1 - 1/4 = 3/4. This is highly likely.",
        explanationLatex: "$P(\\text{At least one even}) = 1 - P(\\text{Both odd})$. Since $P(\\text{odd}) = \\frac{1}{2}$ for one die, $P(\\text{Both odd}) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$. Thus $P(\\text{At least one even}) = \\frac{3}{4}$, making it the most likely."
    },
    {
        id: "mat-2020-035",
        question: "What is the domain of the function defined by f(x) = sqrt(x^2 - 1)?",
        questionLatex: "What is the domain of the function defined by $f(x) = \\sqrt{x^2 - 1}$?",
        choices: [
            { key: "A", text: "[-1, 1]" },
            { key: "B", text: "(-infinity, 1]" },
            { key: "C", text: "[1, infinity)" },
            { key: "D", text: "(-infinity, -1] U [1, infinity)" }
        ],
        answer: "D",
        explanation: "The expression inside the square root must be non-negative: x^2 - 1 >= 0 -> x^2 >= 1 -> x <= -1 or x >= 1.",
        explanationLatex: "The radicand must be non-negative: $x^2 - 1 \\ge 0 \\implies x^2 \\ge 1 \\implies x \\le -1 \\text{ or } x \\ge 1$. Thus, the domain is $(-\\infty, -1] \\cup [1, \\infty)$."
    },
    {
        id: "mat-2020-036",
        question: "Which of the following propositional forms may represent the proposition below? “If the diagonals of a quadrilateral bisect each other and they are perpendicular, then the quadrilateral is a rhombus.”",
        questionLatex: "Which of the following propositional forms may represent the proposition below? “If the diagonals of a quadrilateral bisect each other and they are perpendicular, then the quadrilateral is a rhombus.”",
        choices: [
            { key: "A", text: "(P /\\ Q) -> R" },
            { key: "B", text: "P -> (Q /\\ R)" },
            { key: "C", text: "(P \\/ Q) -> R" },
            { key: "D", text: "P -> (Q \\/ R)" }
        ],
        answer: "A",
        explanation: "Let P be 'diagonals bisect each other', Q be 'they are perpendicular', and R be 'quadrilateral is a rhombus'. The statement is 'If (P and Q), then R', which translates to (P /\\ Q) -> R.",
        explanationLatex: "Let P: 'diagonals bisect each other', Q: 'perpendicular', R: 'rhombus'. The statement is 'If P and Q, then R', written as $(P \\land Q) \\implies R$."
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
