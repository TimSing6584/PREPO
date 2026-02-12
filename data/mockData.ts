export type Question = {
    id: string
    text: string
    type: 'mcq' | 'written'
    options?: string[]
    correctAnswer?: string | number // Index for MCQ, string for written
    explanation?: string
    imageUrl?: string // Optional image associated with the question
}

export const mockQuestions: Question[] = [
    {
        id: '1',
        text: 'What does UI stand for in the context of design?',
        type: 'mcq',
        options: [
            'User Integration',
            'User Interface',
            'Universal Interaction',
            'User Involvement'
        ],
        correctAnswer: 1,
        explanation: 'UI stands for User Interface, which is the point of human-computer interaction and communication in a device.',
        imageUrl: '/logos/apple.svg',
    },
    {
        id: '2',
        text: 'Which principle of OOP allows a class to inherit properties and methods from another class?',
        type: 'mcq',
        options: [
            'Polymorphism',
            'Encapsulation',
            'Inheritance',
            'Abstraction'
        ],
        correctAnswer: 2,
        explanation: 'Inheritance enables new classes to receive or inherit the properties and methods of existing classes.'
    },
    {
        id: '3',
        text: 'Explain the concept of Polymorphism in your own words.',
        type: 'written',
        correctAnswer: 'Polymorphism allows objects of different classes to be treated as objects of a common superclass. It means "many forms", and typically occurs when we have many classes that are related to each other by inheritance.',
    },
    {
        id: '4',
        text: 'What is the main difference between an Abstract Class and an Interface?',
        type: 'mcq',
        options: [
            'Abstract classes can have method implementations, interfaces cannot (in traditional OOP)',
            'Interfaces can have state, abstract classes cannot',
            'A class can inherit from multiple abstract classes',
            'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'Abstract classes can provide some common behavior (method implementations), while interfaces traditionally only define contracts (method signatures).'
    },
    {
        id: '5',
        text: 'Why is Encapsulation important?',
        type: 'written',
        correctAnswer: 'Encapsulation restricts direct access to some of an object\'s components, which is a means of preventing accidental interference and misuse of the methods and data. It bundles the data (variables) and the methods (functions) that act on the data into a single unit (class).',
    }
]
