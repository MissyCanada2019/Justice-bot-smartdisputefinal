import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Privacy Policy</h1>
        <div className="prose prose-lg">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            submit a legal dispute, or contact us for support.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, 
            including generating legal forms and providing case guidance.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information from unauthorized 
            access, alteration, disclosure, or destruction.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time. 
            Contact us if you wish to exercise these rights.
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