import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { AssessDisputeMeritOutput } from '@/ai/flows/assess-dispute-merit';

export interface CaseDocument extends AssessDisputeMeritOutput {
    userId: string;
    createdAt: Timestamp;
}

export const saveCaseAssessment = async (userId: string, assessment: AssessDisputeMeritOutput): Promise<void> => {
    try {
        await addDoc(collection(db, 'cases'), {
            ...assessment,
            userId,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error saving case assessment to Firestore: ", error);
        throw new Error("Could not save your case assessment. Please try again.");
    }
};

export const getLatestCaseAssessment = async (userId: string): Promise<CaseDocument | null> => {
    try {
        const q = query(
            collection(db, 'cases'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const latestCaseDoc = querySnapshot.docs[0].data() as CaseDocument;
        
        // Return the full document, as the AI flow may need all context.
        return latestCaseDoc;

    } catch (error) {
        console.error("Error fetching latest case assessment from Firestore: ", error);
        throw new Error("Could not load your latest case data. Please try again.");
    }
};
