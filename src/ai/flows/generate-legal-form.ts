
'use server';
/**
 * @fileOverview Generates auto-filled content for a legal form based on a user's dispute details.
 *
 * - generateLegalForm - A function that generates legal form content.
 * - GenerateLegalFormInput - The input type for the generateLegalForm function.
 * - GenerateLegalFormOutput - The return type for the generateLegalForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateLegalFormInputSchema = z.object({
  caseClassification: z
    .string()
    .describe('The classification of the legal issue (e.g., "Landlord/Tenant Dispute", "Family Law - Custody").'),
  disputeDetails: z
    .string()
    .describe('A detailed description of the legal issue, including key events, dates, and people involved.'),
  suggestedAvenues: z
    .string()
    .describe('The suggested next steps from the initial case assessment.'),
  userEmail: z
    .string()
    .optional()
    .describe('User email for form pre-filling.'),
  userName: z
    .string()
    .optional()
    .describe('User full name for form pre-filling.'),
  userLocation: z
    .string()
    .optional()
    .describe('User city/location for address fields.'),
  province: z
    .string()
    .optional()
    .describe('User province for jurisdiction-specific forms.'),
  caseName: z
    .string()
    .optional()
    .describe('The case name/title for reference in forms.'),
});
export type GenerateLegalFormInput = z.infer<typeof GenerateLegalFormInputSchema>;

const FormFieldSchema = z.object({
    fieldLabel: z.string().describe("The label for this form field (e.g., 'Full Name:', 'Address:', 'Description of Issue:')"),
    fieldValue: z.string().describe("The pre-filled value for this field based on user data or dispute details. Leave empty if no relevant information is available."),
    fieldType: z.enum(['text', 'textarea', 'date', 'checkbox']).describe("The type of form field")
});

const FormSectionSchema = z.object({
    sectionTitle: z.string().describe("The title of this section of the legal form (e.g., 'Part 1: General Information', 'Reasons for Your Application')."),
    fields: z.array(FormFieldSchema).describe("Array of form fields in this section with pre-filled values"),
    instructions: z.string().optional().describe("Any special instructions for completing this section")
});

export const GenerateLegalFormOutputSchema = z.object({
    suggestedForm: z.string().describe('The name of the most appropriate legal form based on the case classification and details (e.g., "T2: Application about Tenant Rights", "Form 8A: Application (Divorce)").'),
    formSections: z.array(FormSectionSchema).describe('An array of auto-filled sections for the legal form.'),
});
export type GenerateLegalFormOutput = z.infer<typeof GenerateLegalFormOutputSchema>;

export async function generateLegalForm(input: GenerateLegalFormInput): Promise<GenerateLegalFormOutput> {
  return generateLegalFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLegalFormPrompt',
  input: {schema: GenerateLegalFormInputSchema},
  output: {schema: GenerateLegalFormOutputSchema},
  system: `You are an expert Canadian legal assistant AI. Your task is to act as a form-filler that creates realistic, pre-filled legal forms.

Based on the user's case details and personal information, you must:
1.  Identify the single most appropriate legal form for their province and case type.
2.  Create form sections with individual fields that would appear on the actual legal document.
3.  Pre-fill fields with actual user data where available (name, email, location).
4.  Extract relevant information from the dispute details to populate case-specific fields.
5.  Use formal legal language appropriate for court documents.
6.  Include typical form fields like applicant information, case details, remedies sought, etc.

Each section should contain realistic form fields with pre-filled values, making the document ready for review and submission.
`,
  prompt: `Please generate a pre-filled legal form based on the following information:

Case Classification: {{{caseClassification}}}
{{#if caseName}}Case Name: {{{caseName}}}{{/if}}

User Information:
{{#if userName}}Name: {{{userName}}}{{/if}}
{{#if userEmail}}Email: {{{userEmail}}}{{/if}}
{{#if userLocation}}Location: {{{userLocation}}}{{/if}}
{{#if province}}Province: {{{province}}}{{/if}}

Suggested Legal Avenues: {{{suggestedAvenues}}}

Dispute Details (to extract case-specific information):
{{{disputeDetails}}}

Please create a realistic legal form with pre-filled fields using the user's actual information where appropriate.
`,
});

const generateLegalFormFlow = ai.defineFlow(
  {
    name: 'generateLegalFormFlow',
    inputSchema: GenerateLegalFormInputSchema,
    outputSchema: GenerateLegalFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
