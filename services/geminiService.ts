
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Fix: Updated function to return a promise with an array of card objects for better type safety.
export const generateCardsFromTopic = async (topic: string, count: number): Promise<{ front: string; back: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate ${count} flashcards for the topic "${topic}". Each card should have a front (a question or term) and a back (the answer or definition).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        cards: {
                            type: Type.ARRAY,
                            description: 'An array of flashcards.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    front: {
                                        type: Type.STRING,
                                        description: 'The front of the flashcard (question or term).',
                                    },
                                    back: {
                                        type: Type.STRING,
                                        description: 'The back of the flashcard (answer or definition).',
                                    },
                                },
                                required: ['front', 'back'],
                            },
                        },
                    },
                    required: ['cards'],
                },
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result.cards && Array.isArray(result.cards)) {
            // Fix: Return the array of cards directly.
            return result.cards;
        }

        return [];
    } catch (error) {
        console.error("Error generating cards with Gemini:", error);
        throw new Error("Failed to generate flashcards. Please check the topic and try again.");
    }
};
