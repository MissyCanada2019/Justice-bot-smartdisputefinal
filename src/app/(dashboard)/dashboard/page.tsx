<<<<<<< HEAD
<<<<<<< HEAD

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Gavel,
  Landmark,
  Scale,
  ShieldCheck,
  FileText,
  ArrowRight,
  CalendarClock,
  FilePlus2,
  FileSearch,
  MapPin,
  Library,
  MessageCircle,
  FolderOpen,
  Navigation,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Ask JusticeBot',
    description: 'Chat with an AI assistant about your case or legal questions.',
    icon: MessageCircle,
    href: '/dashboard/ask-justicebot',
    isPrimary: true,
  },
  {
    title: 'Submit a Dispute',
    description: 'Get an AI assessment of your case and suggested next steps.',
    icon: FileText,
    href: '/dashboard/submit-dispute',
    isPrimary: true,
  },
  {
    title: 'Evidence Locker',
    description: 'Upload and manage all your case-related evidence files.',
    icon: FolderOpen,
    href: '/dashboard/evidence-locker',
    isPrimary: true,
  },
  {
    title: 'Your Legal Journey',
    description: 'Get guided step-by-step assistance through your entire legal process.',
    icon: Navigation,
    href: '/dashboard/legal-journey',
    isPrimary: true,
  },
  {
    title: 'Legal Timeline',
    description: 'Get a step-by-step timeline for your legal process.',
    icon: CalendarClock,
    href: '/dashboard/timeline',
  },
  {
    title: 'Generate Legal Form',
    description: 'Auto-fill legal forms based on your case details.',
    icon: FilePlus2,
    href: '/dashboard/generate-form',
  },
  {
    title: 'Court & Aid Locator',
    description: 'Find the right courthouse and legal aid clinics near you.',
    icon: MapPin,
    href: '/dashboard/court-locator',
  },
  {
    title: 'Precedent Finder',
    description: 'See how similar cases have been decided in the past.',
    icon: Library,
    href: '/dashboard/precedent-finder',
  },
  {
    title: 'Charter Analysis',
    description: 'Analyze documents against the Charter of Rights and Freedoms.',
    icon: Gavel,
    href: '/dashboard/charter-analysis',
  },
  {
    title: 'Document Explainer',
    description: 'Get plain-language explanations for any legal document or form.',
    icon: FileSearch,
    href: '/dashboard/document-explainer',
  },
  {
    title: 'Family Law',
    description: 'Get summaries of family law for any province or territory.',
    icon: ShieldCheck,
    href: '/dashboard/family-law',
  },
  {
    title: 'Criminal Law',
    description: 'Access summaries of criminal law across Canada.',
    icon: Scale,
    href: '/dashboard/criminal-law',
  },
  {
    title: 'LTB Law',
    description: 'Understand Landlord and Tenant Board laws and regulations.',
    icon: Landmark,
    href: '/dashboard/ltb-law',
  },
  {
    title: 'Litigation Law',
    description: 'Explore litigation procedures and generate arguments.',
    icon: BookOpen,
    href: '/dashboard/litigation-law',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground">
          Here are the tools to help you navigate your legal journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className={`flex flex-col ${feature.isPrimary ? 'border-primary' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium font-headline">
                {feature.title}
              </CardTitle>
              <feature.icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full" variant={feature.isPrimary ? 'default' : 'outline'}>
                <Link href={feature.href}>
                  Go to Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
=======
=======

>>>>>>> 83bc7f63 (1. Landing & Onboarding)
'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserCases } from '@/lib/firestoreService';
import AIInsights from '@/components/AIInsights';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const fetchCases = async () => {
        try {
          const casesData = await getUserCases(user.uid);
          setCases(casesData as SetStateAction<never[]>);
        } catch (error) {
          console.error('Error fetching cases:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCases();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  if (!user) {
    return (
       <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p>Please sign in to view your dashboard.</p>
       </div>
    );
  }

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
        </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-headline">My Cases</h1>
        <Button asChild>
            <Link href="/dashboard/submit-dispute">
                <PlusCircle className="mr-2 h-4 w-4" /> New Case
            </Link>
        </Button>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No cases yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by submitting a new dispute.</p>
            <div className="mt-6">
                 <Button asChild>
                    <Link href="/dashboard/submit-dispute">
                        <PlusCircle className="mr-2 h-4 w-4" /> Submit First Case
                    </Link>
                </Button>
            </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c: any) => (
             <Card key={c.id}>
                <CardHeader>
                    <CardTitle className="font-headline">{c.caseName || 'Unnamed Case'}</CardTitle>
                    <CardDescription>{c.caseClassification}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">{c.disputeDetails}</p>
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm">Merit Score: <span className="font-bold">{c.meritScore ?? 'Not assessed'}</span></p>
                        <p className="text-xs text-muted-foreground">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                     <Button asChild className="w-full mt-4">
                         <Link href={`/dashboard/case/${c.id}`}>View Case</Link>
                    </Button>
                </CardContent>
             </Card>
          ))}
        </div>
      )}

      <div className="mt-12">
        <AIInsights userId={user.uid} />
      </div>
    </>
>>>>>>> 6c11440d (ok)
  );
}
