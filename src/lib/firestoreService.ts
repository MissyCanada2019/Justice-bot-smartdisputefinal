import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { AssessDisputeMeritOutput } from '@/ai/flows/assess-dispute-merit';

export interface CaseDocument extends AssessDisputeMeritOutput {
    userId: string;
    createdAt: Timestamp;
    caseName?: string;
    province?: string;
    userLocation?: string;
    userEmail?: string;
}

export const saveCaseAssessment = async (
    assessment: AssessDisputeMeritOutput,
    additionalData?: {
        caseName?: string;
        province?: string;
        userLocation?: string;
        userEmail?: string;
    }
): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated. Cannot save case assessment.");
    }
    
    try {
        await addDoc(collection(db, 'cases'), {
            ...assessment,
            ...additionalData,
            userId: user.uid,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error saving case assessment to Firestore: ", error);
        throw new Error("Could not save your case assessment. Please try again.");
    }
};

export const getLatestCaseAssessment = async (): Promise<CaseDocument | null> => {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is currently authenticated.");
        return null;
    }

    try {
        const q = query(
            collection(db, 'cases'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const latestCaseDoc = querySnapshot.docs[0].data() as CaseDocument;
        
        return latestCaseDoc;

    } catch (error) {
        console.error("Error fetching latest case assessment from Firestore: ", error);
        throw new Error("Could not load your latest case data. Please try again.");
    }
};