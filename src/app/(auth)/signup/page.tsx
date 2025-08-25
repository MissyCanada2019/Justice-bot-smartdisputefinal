
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
<<<<<<< HEAD
  password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
=======
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
>>>>>>> 83bc7f63 (1. Landing & Onboarding)
});

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await signUpWithEmail(values.email, values.password);
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      // Check if reCAPTCHA is available and properly configured
      if ((window as any).grecaptcha && (window as any).grecaptcha.enterprise && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          (window as any).grecaptcha.enterprise.ready(async () => {
            try {
              const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
              const token = await (window as any).grecaptcha.enterprise.execute(siteKey, {action: 'SIGNUP'});
              if (token) {
                await signInWithGoogle(token);
              }
            } catch (e) {
              // If reCAPTCHA fails, fallback to sign-in without it
              console.warn('reCAPTCHA failed, proceeding without verification:', e);
              await signInWithGoogle('');
            } finally {
              setLoading(false);
            }
          });
        } catch (e) {
          // If reCAPTCHA setup fails, fallback to sign-in without it
          console.warn('reCAPTCHA setup failed, proceeding without verification:', e);
          await signInWithGoogle('');
          setLoading(false);
        }
      } else {
        // No reCAPTCHA available, proceed without it
        await signInWithGoogle('');
        setLoading(false);
      }
    } catch (error) {
      console.error('Google sign-up failed:', error);
      setLoading(false);
    }
  };

  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                <Icons.justiceBotLogo className="h-10 w-auto text-primary" />
                <span className="font-headline text-2xl font-bold text-foreground">JusticeBot.AI</span>
            </Link>
          <CardTitle className="font-headline text-2xl">Join JusticeBot.AI</CardTitle>
          <CardDescription>Get instant access to AI-powered legal assistance - completely free!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full mb-4" onClick={handleGoogleSignUp} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <><Icons.mapleLeaf className="mr-2 h-5 w-5" /> Continue with Google</>}
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                         Accept <Link href="/terms-of-use" className="text-primary hover:underline">Terms of Use</Link> & <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Create Free Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>✓ No credit card required</p>
            <p>✓ Free access to legal AI tools</p>
            <p>✓ Canadian law specialized</p>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm">
            <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
