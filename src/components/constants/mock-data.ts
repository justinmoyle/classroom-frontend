import { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description: "An overview of computer science, including algorithms, data structures, and programming basics.",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus II",
        department: "Math",
        description: "Integration techniques, sequences, series, and power series.",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        code: "ENG102",
        name: "English Composition",
        department: "English",
        description: "Advanced writing skills, focusing on persuasive essays and research-based arguments.",
        createdAt: new Date().toISOString()
    }
];
