
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Gavel, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CharterAnalysisPage() {
  const [documentText, setDocumentText] = useState('');
  const [result, setResult] = useState<{ sections: Record<string, string> } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!documentText.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please paste your legal document text to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Call the API route instead of importing the AI flow directly
      const response = await fetch('/api/analyze-legal-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }
      
      const output = await response.json();
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Gavel className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Charter-Informed Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze legal documents for potential violations or relevance to the Canadian Charter of Rights and Freedoms.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Legal Document Input</CardTitle>
          <CardDescription>
            Paste the text of your legal document below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your legal document here..."
            className="min-h-[200px] text-base"
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            disabled={loading}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Document'
            )}
          </Button>
        </CardFooter>
      </Card>

      {loading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg font-headline mb-2">Document Sections</h3>
              {Object.entries(result.sections).map(([sectionNumber, content]) => (
                <div key={sectionNumber} className="mb-4">
                  <h4 className="font-semibold">Section {sectionNumber}</h4>
                  <p className="text-foreground/90">{content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
