import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function WelcomePage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Icons.mapleLeaf className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Welcome to JusticeBot.AI!</CardTitle>
                    <CardDescription>
                        🎉 Your free account is ready! Start using AI-powered legal assistance immediately.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-left px-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            ✅ <strong>No credit card required</strong> • ✅ <strong>Instant access</strong> • ✅ <strong>Canadian law specialized</strong>
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Start with these popular tools:</h3>
                        <div className="grid gap-3">
                            <Link href="/dashboard/submit-dispute" className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="font-medium">Submit a Dispute</div>
                                        <div className="text-sm text-muted-foreground">Get instant AI case assessment</div>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                            
                            <Link href="/dashboard/ask-justicebot" className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="font-medium">Ask JusticeBot</div>
                                        <div className="text-sm text-muted-foreground">Chat with legal AI assistant</div>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                            
                            <Link href="/dashboard/timeline" className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="font-medium">Legal Timeline</div>
                                        <div className="text-sm text-muted-foreground">Step-by-step case guidance</div>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/dashboard">
                            View All Tools <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
