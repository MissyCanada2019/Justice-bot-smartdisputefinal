import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">About JusticeBot.AI</h1>
        <div className="prose prose-lg">
          <p>
            JusticeBot.AI is an AI-powered legal assistance platform designed to help everyday Canadians 
            navigate the complexities of the legal system.
          </p>
          <p>
            Our mission is to democratize access to legal information and tools, making it easier for 
            self-represented litigants to understand their rights and obligations.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p>
            Founded by legal professionals and technologists, JusticeBot.AI was created to address the 
            growing gap between the complexity of legal processes and the accessibility of legal assistance.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Technology</h2>
          <p>
            We leverage cutting-edge AI technologies to analyze legal documents, generate forms, and provide 
            guidance based on Canadian law and precedents.
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