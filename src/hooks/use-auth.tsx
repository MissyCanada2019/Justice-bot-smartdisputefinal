
'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFreeTier: boolean;
  signInWithGoogle: (recaptchaToken?: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFreeTier, setIsFreeTier] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
<<<<<<< HEAD
      if (user) {
        console.log("User logged in:", user.uid);
        // Check for free tier status (simple example)
        const creationTime = new Date(user.metadata.creationTime || 0);
        // Let's say the cut-off is Jan 1, 2026.
        const cutoffDate = new Date('2026-01-01');
        setIsFreeTier(creationTime < cutoffDate);
=======
      setLoading(false);
      
      if (!loading && user) {
        const path = window.location.pathname;
        if (path === '/login' || path === '/signup' || path === '/') {
            router.push('/dashboard');
        }
      }

    });
    return () => unsubscribe();
  }, [loading, router]);

  const signInWithGoogle = async (recaptchaToken: string) => {
    try {
      // Temporarily bypass reCAPTCHA verification
      // const verification = await verifyRecaptchaToken({ 
      //   token: recaptchaToken,
      //   expectedAction: 'LOGIN'
      // });

      // if (!verification.isValid) {
      //   toast({
      //       title: 'Security Check Failed',
      //       description: `Could not verify you are human. Score: ${verification.score}. Reason: ${verification.reason}`,
      //       variant: 'destructive',
      //     });
      //   return;
      // }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);
      
      toast({
        title: 'Login Successful!',
        description: 'Welcome to your dashboard.',
      });

      if (additionalUserInfo?.isNewUser) {
        router.push('/dashboard/welcome');
>>>>>>> 5cd2254c (api key is expired so i cant login)
      } else {
        console.log("No user signed in.");
        setIsFreeTier(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (recaptchaToken = '') => {
    const performSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Check if this is a new user
            if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
                // New user signed up with Google
                toast({
                    title: 'Account Created!',
                    description: 'Welcome! Redirecting you to the dashboard.',
                });
                router.push('/dashboard/welcome');
            } else {
                // Existing user logged in
                toast({
                    title: 'Login Successful!',
                    description: 'Welcome back to your dashboard.',
                });
                router.push('/dashboard');
            }
        } catch (error: any) {
            handleAuthError(error);
        }
    };
    
    // reCAPTCHA is disabled for now, just perform sign-in
    await performSignIn();
  };
  
  const handleAuthError = (error: any) => {
      console.error("Authentication error:", error);
      if (error.code === 'auth/cancelled-popup-request') {
          console.log('Sign-in popup closed by user.');
          return; // Don't show a toast for this
      }
      if (error.code === 'auth/unauthorized-domain') {
        toast({
            title: 'Configuration Error',
            description: 'This domain is not authorized for authentication. Please contact the site owner.',
            variant: 'destructive',
        });
        router.push('/troubleshooting');
      } else {
         toast({
            title: 'Sign-in Failed',
            description: `An unexpected error occurred: ${error.message || 'Please try again.'}`,
            variant: 'destructive',
        });
      }
    }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = email.split('@')[0];
        await updateProfile(userCredential.user, { displayName });
        
        // Send welcome email via API route
        try {
          await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name: displayName }),
          });
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }

        toast({
            title: 'Account Created!',
            description: 'Welcome! Redirecting you to the dashboard.',
        });
        router.push('/dashboard/welcome');
    } catch (error: any) {
        console.error("Error signing up with email", error);
        if (error.code === 'auth/email-already-in-use') {
             throw new Error('This email is already in use. Please log in or use a different email.');
        }
        throw new Error(error.message || 'An unexpected error occurred during sign up.');
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: 'Login Successful!',
            description: 'Welcome back to your dashboard.',
        });
        router.push('/dashboard');
    } catch (error: any) {
         console.error("Error signing in with email", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
             throw new Error('Invalid email or password. Please try again.');
        }
        throw new Error(error.message || 'An unexpected error occurred during login.');
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out", error);
      toast({
          title: 'Sign-out Failed',
          description: 'An error occurred while signing out. Please try again.',
          variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFreeTier, signInWithGoogle, signUpWithEmail, signInWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
