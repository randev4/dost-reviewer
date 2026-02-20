/**
 * Subject definitions and metadata
 */

export const SUBJECTS = [
    {
        id: 'mathematics',
        name: 'Mathematics',
        icon: '📐',
        color: '#3b82f6',
        description: 'Algebra, Geometry, Trigonometry, Statistics',
        dataFile: 'mathematics'
    },
    {
        id: 'science',
        name: 'Science',
        icon: '🔬',
        color: '#8b5cf6',
        description: 'Biology, Chemistry, Physics, Earth Science',
        dataFile: 'science'
    },
    {
        id: 'verbal-reasoning',
        name: 'Verbal Reasoning',
        icon: '🧠',
        color: '#ec4899',
        description: 'Analogies, Series, Patterns',
        dataFile: 'verbal-reasoning'
    },
    {
        id: 'nonverbal-reasoning',
        name: 'Non-Verbal Reasoning',
        icon: '🔷',
        color: '#14b8a6',
        description: 'Spatial, Patterns, Visual Logic',
        dataFile: 'nonverbal-reasoning'
    },
    {
        id: 'english',
        name: 'English',
        icon: '📝',
        color: '#f59e0b',
        description: 'Grammar, Vocabulary, Reading',
        dataFile: 'english'
    },
    {
        id: 'mechanical-technical',
        name: 'Mechanical-Technical',
        icon: '⚙️',
        color: '#ef4444',
        description: 'Gears, Levers, Circuits, Forces',
        dataFile: 'mechanical-technical'
    }
];

export function getSubjectById(id) {
    return SUBJECTS.find(s => s.id === id) || null;
}
