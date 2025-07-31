/**
 * @fileOverview Generates step-by-step legal guidance after form generation
 * Acts as a "pocket lawyer" to guide users through their legal journey
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateLegalGuidanceInputSchema = z.object({
  caseClassification: z.string().describe('The classification of the legal issue'),
  suggestedForm: z.string().describe('The recommended legal form'),
  province: z.string().describe('User province for jurisdiction-specific guidance'),
  userLocation: z.string().optional().describe('User city for local court information'),
  recommendedCourt: z.string().optional().describe('The specific court/tribunal for this case'),
  meritScore: z.number().describe('Case merit score to tailor guidance intensity'),
});

const GuidanceStepSchema = z.object({
  stepNumber: z.number().describe('Sequential step number'),
  stepTitle: z.string().describe('Clear title for this step'),
  description: z.string().describe('Detailed explanation of what to do'),
  timeframe: z.string().describe('When this step should be completed (e.g., "Within 7 days", "Before court date")'),
  importance: z.enum(['critical', 'important', 'recommended']).describe('Priority level of this step'),
  documents: z.array(z.string()).describe('Documents needed for this step'),
  tips: z.array(z.string()).describe('Practical tips and advice'),
  warningFlags: z.array(z.string()).describe('Things to watch out for or avoid'),
  nextSteps: z.string().describe('What happens after completing this step'),
});

export const GenerateLegalGuidanceOutputSchema = z.object({
  totalSteps: z.number().describe('Total number of steps in the legal journey'),
  estimatedTimeframe: z.string().describe('Overall timeline for the legal process'),
  guidanceSteps: z.array(GuidanceStepSchema).describe('Comprehensive step-by-step guidance'),
  keyDeadlines: z.array(z.object({
    deadline: z.string().describe('Description of the deadline'),
    timeframe: z.string().describe('When the deadline occurs'),
    consequences: z.string().describe('What happens if deadline is missed')
  })).describe('Critical deadlines to track'),
  supportResources: z.array(z.object({
    resource: z.string().describe('Name of support resource'),
    description: z.string().describe('How this resource can help'),
    contact: z.string().describe('How to access this resource')
  })).describe('Additional support resources available'),
  successIndicators: z.array(z.string()).describe('Signs that the case is progressing well'),
});

export type GenerateLegalGuidanceInput = z.infer<typeof GenerateLegalGuidanceInputSchema>;
export type GenerateLegalGuidanceOutput = z.infer<typeof GenerateLegalGuidanceOutputSchema>;

export async function generateLegalGuidance(input: GenerateLegalGuidanceInput): Promise<GenerateLegalGuidanceOutput> {
  return generateLegalGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLegalGuidancePrompt',
  input: {schema: GenerateLegalGuidanceInputSchema},
  output: {schema: GenerateLegalGuidanceOutputSchema},
  system: `You are an expert Canadian legal guide AI acting as a "pocket lawyer" companion. Your role is to provide comprehensive, step-by-step guidance to help self-represented litigants navigate their legal journey after they have their forms ready.

Create a detailed roadmap that covers:
1. **Pre-filing preparation** (document review, evidence gathering, deadlines)
2. **Filing process** (where to file, how to file, fees, service requirements)  
3. **Court procedures** (what to expect, how to prepare, courtroom etiquette)
4. **Post-filing actions** (follow-up requirements, response deadlines)
5. **Ongoing case management** (settlement opportunities, next hearings)

For each step:
- Provide clear, actionable instructions
- Include specific timeframes and deadlines
- Highlight critical points and common mistakes
- Offer practical tips from a legal practitioner's perspective
- Explain what success/progress looks like

Tailor guidance to the specific province's legal system and procedures. Consider the merit score - higher merit cases get more assertive guidance, lower merit cases get more cautious settlement-focused advice.`,

  prompt: `Please create comprehensive step-by-step legal guidance for:

Case Type: {{{caseClassification}}}
Recommended Form: {{{suggestedForm}}}
Province: {{{province}}}
{{#if userLocation}}User Location: {{{userLocation}}}{{/if}}
{{#if recommendedCourt}}Court/Tribunal: {{{recommendedCourt}}}{{/if}}
Merit Score: {{{meritScore}}}/100

Provide detailed "pocket lawyer" guidance that will help this self-represented litigant navigate their entire legal journey with confidence.`,
});

const generateLegalGuidanceFlow = ai.defineFlow(
  {
    name: 'generateLegalGuidanceFlow',
    inputSchema: GenerateLegalGuidanceInputSchema,
    outputSchema: GenerateLegalGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);