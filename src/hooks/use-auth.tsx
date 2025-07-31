
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, getAdditionalUserInfo, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFreeTier: boolean;
  signInWithGoogle: (recaptchaToken: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

declare global {
    interface Window {
        grecaptcha: any;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const isFreeTier = process.env.NEXT_PUBLIC_FREE_TIER_ENABLED === 'true';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
      // Only verify recaptcha if token is provided and recaptcha is configured
      if (recaptchaToken && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          const verificationResponse = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: recaptchaToken,
              expectedAction: 'LOGIN'
            }),
          });
          
          const verification = await verificationResponse.json();

          if (!verification.isValid) {
            toast({
                title: 'Security Check Failed',
                description: `Could not verify you are human. Score: ${verification.score}. Reason: ${verification.reason}`,
                variant: 'destructive',
              });
            return;
          }
        } catch (recaptchaError) {
          console.warn('reCAPTCHA verification failed, proceeding without it:', recaptchaError);
        }
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);
      
      toast({
        title: 'Login Successful!',
        description: 'Welcome to your dashboard.',
      });

      if (additionalUserInfo?.isNewUser) {
        // Send welcome email via API route
        try {
          await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: result.user.email!,
              name: result.user.displayName
            }),
          });
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
        router.push('/dashboard/welcome');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log('Sign-in popup closed by user.');
        return;
      }
      
      console.error("Error signing in with Google", error);

      if (error.code === 'auth/unauthorized-domain') {
        router.push('/troubleshooting');
      } else {
         toast({
            title: 'Sign-in Failed',
            description: `An unexpected error occurred: ${error.message || 'Please try again.'}`,
            variant: 'destructive',
        });
      }
    }
  };

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
