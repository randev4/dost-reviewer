/**
 * Subject definitions and metadata with Subtopic support
 */

export const SUBJECTS = [
    {
        id: 'mathematics',
        name: 'Mathematics',
        icon: '📐',
        color: '#3b82f6',
        description: 'Algebra, Geometry, Trigonometry, Statistics & Calculus',
        dataFile: 'mathematics',
        subtopics: [
            {
                id: 'all',
                name: 'Combined (All Topics)',
                icon: '🌟',
                description: 'Full random mix of all mathematical disciplines',
                count: 492,
                matches: null
            },
            {
                id: 'algebra',
                name: 'Algebra',
                icon: '🔢',
                description: 'Expressions, equations, sequences, polynomials',
                count: 132,
                matches: ['algebra', 'sequences', 'simplification']
            },
            {
                id: 'geometry',
                name: 'Geometry',
                icon: '📐',
                description: 'Triangles, circles, solids, coordinate geometry',
                count: 92,
                matches: ['geometry', 'coordinate_geometry']
            },
            {
                id: 'trigonometry',
                name: 'Trigonometry',
                icon: '📐',
                description: 'Identities, right triangles, radians, graphs',
                count: 71,
                matches: ['trigonometry']
            },
            {
                id: 'statistics',
                name: 'Statistics & Probability',
                icon: '📊',
                description: 'Data analysis, distributions, probability',
                count: 77,
                matches: ['statistics']
            },
            {
                id: 'calculus',
                name: 'Calculus',
                icon: '📈',
                description: 'Limits, derivatives, integrals, rates of change',
                count: 80,
                matches: ['calculus']
            },
            {
                id: 'general',
                name: 'General Math Practice',
                icon: '🎯',
                description: 'Mixed problems from standard practice exams',
                count: 40,
                matches: ['general']
            }
        ]
    },
    {
        id: 'science',
        name: 'Science',
        icon: '🔬',
        color: '#8b5cf6',
        description: 'Biology, Chemistry, Physics, Earth & Space Science',
        dataFile: 'science',
        subtopics: [
            {
                id: 'all',
                name: 'Combined (All Topics)',
                icon: '🌟',
                description: 'Full random mix across all scientific disciplines',
                count: 433,
                matches: null
            },
            {
                id: 'biology',
                name: 'Biology',
                icon: '🧬',
                description: 'Cells, genetics, ecology, organ systems',
                count: 95,
                matches: ['biology']
            },
            {
                id: 'chemistry',
                name: 'Chemistry',
                icon: '🧪',
                description: 'Atomic structure, chemical reactions, stoichiometry',
                count: 109,
                matches: ['chemistry']
            },
            {
                id: 'physics',
                name: 'Physics',
                icon: '⚡',
                description: 'Forces, energy, motion, thermodynamics, circuits',
                count: 92,
                matches: ['physics']
            },
            {
                id: 'earth-science',
                name: 'Earth Science',
                icon: '🌍',
                description: 'Geology, rocks, atmosphere, weather, tectonics',
                count: 81,
                matches: ['earth-science', 'earth_science']
            },
            {
                id: 'space-science',
                name: 'Space Science',
                icon: '🪐',
                description: 'Astronomy, planetary systems, stars, cosmology',
                count: 51,
                matches: ['space-science']
            },
            {
                id: 'general',
                name: 'General Science',
                icon: '🔬',
                description: 'Scientific method and general concepts',
                count: 5,
                matches: ['general']
            }
        ]
    },
    {
        id: 'english',
        name: 'English',
        icon: '📝',
        color: '#f59e0b',
        description: 'Grammar, Reading Comprehension, Vocabulary',
        dataFile: 'english',
        subtopics: [
            {
                id: 'all',
                name: 'Combined (All Topics)',
                icon: '🌟',
                description: 'Comprehensive mix of grammar, reading & vocabulary',
                count: 157,
                matches: null
            },
            {
                id: 'grammar',
                name: 'Grammar & Usage',
                icon: '📝',
                description: 'Syntax, verb tenses, error identification',
                count: 102,
                matches: ['grammar', 'language']
            },
            {
                id: 'reading',
                name: 'Reading Comprehension',
                icon: '📖',
                description: 'Passages, inferences, main ideas, literature',
                count: 52,
                matches: ['reading']
            },
            {
                id: 'vocabulary',
                name: 'Vocabulary',
                icon: '📚',
                description: 'Word meanings, idioms, context clues',
                count: 3,
                matches: ['vocabulary']
            }
        ]
    },
    {
        id: 'mechanical-technical',
        name: 'Mechanical-Technical',
        icon: '⚙️',
        color: '#ef4444',
        description: 'Gears, Levers, Circuits, Forces & Motion',
        dataFile: 'mechanical-technical',
        subtopics: [
            {
                id: 'all',
                name: 'Combined (All Topics)',
                icon: '🌟',
                description: 'Mix of mechanical systems, gears, and forces',
                count: 90,
                matches: null
            },
            {
                id: 'mechanical',
                name: 'Machines & Mechanics',
                icon: '⚙️',
                description: 'Gears, pulleys, levers, mechanical advantage',
                count: 85,
                matches: ['mechanical', 'mechanics', 'gears', 'levers', 'pulleys']
            },
            {
                id: 'circuits',
                name: 'Circuits & Electrical',
                icon: '💡',
                description: 'Series/parallel circuits, switches, electrical load',
                count: 3,
                matches: ['electrical']
            },
            {
                id: 'forces',
                name: 'Forces & Hydraulics',
                icon: '🧲',
                description: 'Hydraulic systems, center of gravity, friction',
                count: 2,
                matches: ['forces']
            }
        ]
    },
    {
        id: 'nonverbal-reasoning',
        name: 'Non-Verbal Reasoning',
        icon: '🔷',
        color: '#14b8a6',
        description: 'Spatial Reasoning, Patterns, Visual Logic',
        dataFile: 'nonverbal-reasoning',
        subtopics: [
            {
                id: 'all',
                name: 'Combined (All Topics)',
                icon: '🌟',
                description: 'Mix of spatial reasoning and visual patterns',
                count: 80,
                matches: null
            },
            {
                id: 'spatial',
                name: 'Spatial Reasoning',
                icon: '🔷',
                description: 'Cube nets, rotations, reflections, folding & views',
                count: 54,
                matches: ['spatial']
            },
            {
                id: 'pattern',
                name: 'Patterns & Visual Logic',
                icon: '🧩',
                description: 'Figure sequences, matrices, odd-one-out',
                count: 26,
                matches: ['pattern', 'patterns']
            }
        ]
    },
    {
        id: 'verbal-reasoning',
        name: 'Verbal Reasoning',
        icon: '🧠',
        color: '#ec4899',
        description: 'Logic, Word Analogies, Series & Deduction',
        dataFile: 'verbal-reasoning',
        subtopics: [
            {
                id: 'all',
                name: 'Combined (All Topics)',
                icon: '🌟',
                description: 'Mix of verbal deductions, analogies & series',
                count: 70,
                matches: null
            },
            {
                id: 'verbal-logic',
                name: 'Verbal Logic & Deduction',
                icon: '🧠',
                description: 'Syllogisms, logical conclusions, deductive reasoning',
                count: 60,
                matches: ['verbal-logic', 'reasoning']
            },
            {
                id: 'analogy',
                name: 'Word Analogies',
                icon: '🔗',
                description: 'Word relationships and conceptual pairs',
                count: 6,
                matches: ['analogy']
            },
            {
                id: 'series',
                name: 'Series & Sequencing',
                icon: '🔢',
                description: 'Alphanumeric patterns and sequence logic',
                count: 4,
                matches: ['series']
            }
        ]
    }
];

export function getSubjectById(id) {
    return SUBJECTS.find(s => s.id === id) || null;
}

export function getSubtopics(subjectId) {
    const s = getSubjectById(subjectId);
    return s?.subtopics || [];
}

export function getSubtopic(subjectId, subtopicId) {
    const subtopics = getSubtopics(subjectId);
    return subtopics.find(st => st.id === subtopicId) || null;
}

export function getSubtopicName(subjectId, subtopicId) {
    if (!subtopicId || subtopicId === 'all') return 'All Topics';
    const st = getSubtopic(subjectId, subtopicId);
    return st?.name || subtopicId;
}

export function filterQuestionsBySubtopic(questions, subjectId, subtopicId) {
    if (!subtopicId || subtopicId === 'all') return questions;
    const st = getSubtopic(subjectId, subtopicId);
    if (!st || !st.matches) return questions;
    return questions.filter(q => st.matches.includes(q.topic));
}

export const TOTAL_QUESTIONS_COUNT = SUBJECTS.reduce((sum, s) => {
    const allTopic = s.subtopics?.find(st => st.id === 'all');
    return sum + (allTopic?.count || 0);
}, 0);

