'use server';
/**
 * @fileOverview Assesses a legal dispute and provides a merit score.
 *
 * - assessDisputeMerit - A function that handles the dispute assessment.
 * - AssessDisputeMeritInput - The input type for the assessDisputeMerit function.
 * - AssessDisputeMeritOutput - The return type for the assessDisputeMerit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AssessDisputeMeritInputSchema = z.object({
  caseName: z.string().describe('A short, descriptive name for the case.'),
  disputeDetails: z
    .string()
    .describe('A detailed description of the legal issue, including key events, dates, and people involved.'),
  evidenceText: z
    .string()
    .optional()
    .describe('The extracted text content from an uploaded evidence document.'),
  province: z
    .string()
    .optional()
    .describe('The Canadian province where the dispute occurred (e.g., "Ontario", "British Columbia").'),
  userEmail: z
    .string()
    .optional()
    .describe('User email for personalization in generated forms.'),
  userLocation: z
    .string()
    .optional()
    .describe('User city/location for local court recommendations.'),
});
export type AssessDisputeMeritInput = z.infer<typeof AssessDisputeMeritInputSchema>;

export const AssessDisputeMeritOutputSchema = z.object({
  meritScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 indicating the merit of the case based on the provided information and similar cases in the region. A higher score means a stronger case.'
    ),
  caseClassification: z
    .string()
    .describe('The classification of the legal issue (e.g., "Landlord/Tenant Dispute", "Family Law - Custody", "Small Claims").'),
  suggestedAvenues: z
    .string()
    .describe(
      'A summary of recommended next steps and proper avenues for the user to take, such as which forms to file and at which type of courthouse.'
    ),
  analysis: z.string().describe('A brief analysis explaining the reasoning for the merit score and suggested avenues.'),
  similarCases: z
    .string()
    .describe('A summary of similar cases in the province/region and their typical outcomes to inform the merit score.'),
  provincialConsiderations: z
    .string()
    .describe('Specific legal considerations, laws, or procedures that apply in the user\'s province.'),
  recommendedCourt: z
    .string()
    .optional()
    .describe('The specific court or tribunal recommended for this case in the user\'s location.'),
});
export type AssessDisputeMeritOutput = z.infer<typeof AssessDisputeMeritOutputSchema>;

export async function assessDisputeMerit(input: AssessDisputeMeritInput): Promise<AssessDisputeMeritOutput> {
  return assessDisputeMeritFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessDisputeMeritPrompt',
  input: {schema: AssessDisputeMeritInputSchema},
  output: {schema: AssessDisputeMeritOutputSchema},
  system: `You are an expert Canadian legal assistant AI named JusticeBot. Your purpose is to provide an initial assessment of a user's legal dispute to help them understand its strength and potential next steps. You do not provide legal advice.

Analyze the user's case name, dispute details, province, and any provided evidence text. Based on this information:
1.  **Classify the Case**: Determine the area of law (e.g., LTB, Family, Criminal, Small Claims). Be specific for family law (e.g., "Family Law - Custody", "Family Law - Divorce").
2.  **Provincial Context**: Consider the specific province's laws, procedures, and typical case outcomes. Each province has different rules and success rates.
3.  **Similar Cases Analysis**: Draw upon knowledge of similar cases in the specified province to inform your merit assessment. Consider typical outcomes, settlement patterns, and success rates for similar disputes.
4.  **Assess Merit**: Evaluate the strength of the case based on the facts provided AND similar cases in the region. Assign a merit score from 0 (very low merit) to 100 (very high merit). Consider clarity, evidence, potential legal standing, and regional precedents.
5.  **Provide Analysis**: Explain your reasoning for the score, referencing similar cases and provincial considerations.
6.  **Suggest Avenues**: Recommend concrete next steps for a self-represented litigant in the specific Canadian province. Mention specific form types and the exact court/tribunal in their region.
`,
  prompt: `Please assess the following legal dispute:

Case Name: {{{caseName}}}

{{#if province}}
Province: {{{province}}}
{{/if}}

{{#if userLocation}}
User Location: {{{userLocation}}}
{{/if}}

Dispute Details:
{{{disputeDetails}}}

{{#if evidenceText}}
Evidence Document Text:
{{{evidenceText}}}
{{/if}}

Please provide a thorough assessment that considers similar cases in {{#if province}}{{{province}}}{{else}}the relevant Canadian jurisdiction{{/if}} and provincial-specific legal procedures.
`,
});

const assessDisputeMeritFlow = ai.defineFlow(
  {
    name: 'assessDisputeMeritFlow',
    inputSchema: AssessDisputeMeritInputSchema,
    outputSchema: AssessDisputeMeritOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
