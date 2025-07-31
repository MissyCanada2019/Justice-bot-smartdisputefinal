'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, CheckCircle, HelpCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TroubleshootingPage() {
  const commonIssues = [
    {
        
      id: "login-issues",
      title: "Login and Authentication Problems",
      content: (
        <div className="space-y-3">
          <h4 className="font-semibold">Troubleshooting Steps:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure you're using the correct email and password</li>
            <li>Check that Caps Lock is off when entering your password</li>
            <li>Try clearing your browser cache and cookies</li>
            <li>Use the "Forgot Password" feature to reset your password</li>
            <li>Try logging in with a different browser or device</li>
          </ul>
          <p className="mt-3">
            If issues persist, contact support at support@justice-bot.com with details about the problem.
          </p>
        </div>
      )
    },
    {
      id: "form-generation",
      title: "Legal Form Generation Issues",
      content: (
        <div className="space-y-3">
          <h4 className="font-semibold">Troubleshooting Steps:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure all required fields in your dispute submission are filled out</li>
            <li>Check that your case details are clear and comprehensive</li>
            <li>Try using a different web browser</li>
            <li>Refresh the page and try again</li>
            <li>Check your internet connection stability</li>
          </ul>
          <p className="mt-3">
            If forms aren't generating properly, try submitting a simpler version of your case first.
          </p>
        </div>
      )
    },
    {
      id: "payment-issues",
      title: "Payment and Subscription Problems",
      content: (
        <div className="space-y-3">
          <h4 className="font-semibold">Troubleshooting Steps:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Verify your payment method details are correct</li>
            <li>Check that your bank or card issuer isn't blocking the transaction</li>
            <li>Try a different payment method</li>
            <li>Ensure you have sufficient funds or credit available</li>
            <li>Check for any pending transactions that might be holding funds</li>
          </ul>
          <p className="mt-3">
            For billing questions, contact billing@justice-bot.com or call +1 (555) 123-4569.
          </p>
        </div>
      )
    },
    {
      id: "document-upload",
      title: "Document Upload and Evidence Locker Issues",
      content: (
        <div className="space-y-3">
          <h4 className="font-semibold">Troubleshooting Steps:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure your document is in a supported format (PDF, DOC, DOCX, TXT, JPG, PNG)</li>
            <li>Check that your file size is under 10MB</li>
            <li>Try uploading one document at a time</li>
            <li>Refresh the page before attempting to upload again</li>
            <li>Try using a different web browser</li>
          </ul>
          <p className="mt-3">
            If uploads consistently fail, contact support with details about your file and browser.
          </p>
        </div>
      )
    },
    {
      id: "ai-analysis",
      title: "AI Analysis and Merit Score Issues",
      content: (
        <div className="space-y-3">
          <h4 className="font-semibold">Troubleshooting Steps:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure your case details are comprehensive and specific</li>
            <li>Include relevant dates, names, and key events</li>
            <li>Provide supporting evidence when possible</li>
            <li>Try rephrasing your case description for clarity</li>
            <li>Check that your case falls within our supported legal areas</li>
          </ul>
          <p className="mt-3">
            If analysis seems inaccurate, you can provide feedback through the app to help us improve.
          </p>
        </div>
      )
    }
  ];

  const faqItems = [
    {
      question: "How long does it take to generate a legal form?",
      answer: "Most forms are generated within 30 seconds of submission. Complex cases may take up to 2 minutes."
    },
    {
      question: "Can I edit my generated forms?",
      answer: "Yes, all generated forms are provided in editable PDF format that you can modify as needed."
    },
    {
      question: "What browsers are supported?",
      answer: "JusticeBot.AI works best on the latest versions of Chrome, Firefox, Safari, and Edge."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data. See our Privacy Policy for details."
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight font-headline mb-4">Troubleshooting Guide</h1>
          <p className="text-muted-foreground text-lg">
            Common issues and solutions to help you get the most from JusticeBot.AI
          </p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {commonIssues.map((issue) => (
                  <AccordionItem key={issue.id} value={issue.id}>
                    <AccordionTrigger>{issue.title}</AccordionTrigger>
                    <AccordionContent>
                      {issue.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quick Fixes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Refresh Page</h3>
                  <p className="text-sm text-muted-foreground">
                    Sometimes a simple page refresh resolves loading issues.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Clear Cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear your browser cache to resolve display problems.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Check Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure you have a stable internet connection.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Try Different Browser</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch browsers if you're experiencing persistent issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Still Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Contact Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Email us at support@justice-bot.com for personalized assistance.
                  </p>
                  <Button asChild size="sm">
                    <Link href="mailto:support@justice-bot.com">Email Support</Link>
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect with our support team through the in-app chat feature.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}