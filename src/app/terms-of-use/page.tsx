import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Terms of Use</h1>
        <div className="prose prose-lg">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
          <p>
            By accessing or using JusticeBot.AI, you agree to be bound by these Terms of Use and 
            all applicable laws and regulations.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Use of Service</h2>
          <p>
            JusticeBot.AI provides AI-powered legal assistance tools. The information provided is 
            for general informational purposes only and does not constitute legal advice.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and for all 
            activities that occur under your account.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
          <p>
            JusticeBot.AI is not a law firm and does not provide legal advice. The service is 
            provided "as is" without warranties of any kind.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
          <p>
            In no event shall JusticeBot.AI be liable for any indirect, incidental, special, 
            consequential, or punitive damages.
          </p>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}