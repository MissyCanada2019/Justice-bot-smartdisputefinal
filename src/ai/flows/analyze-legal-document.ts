import { z } from 'zod';

import { ai } from '@/ai/genkit';
import { defineFlow } from 'genkit';

const analyzeLegalDocumentSchema = z.object({
  sections: z.record(z.string(), z.string()),
});

const analyzeLegalDocumentDescription = `
You are a legal assistant tasked with analyzing a legal document.
Your role is to break down the document into its core sections based on the section numbering and content.
You will receive the full text of the legal document.
Your output should be a JSON object where keys are the section numbers (as strings) and values are the content of each section (as strings).
Ensure that the entire document is captured in the output.
`;

export const analyzeLegalDocumentFlow = defineFlow(
  {
    name: 'analyzeLegalDocument',
    inputSchema: z.string(),
    outputSchema: analyzeLegalDocumentSchema,
  },
  async (documentText) => {
    const prompt = ai.definePrompt({
      name: 'analyzeLegalDocumentPrompt',
      input: { schema: z.string() },
      output: { schema: analyzeLegalDocumentSchema },
      system: analyzeLegalDocumentDescription,
      prompt: `Please analyze the following legal document:
      
{{documentText}}

Return a JSON object with section numbers as keys and section content as values.`,
    });

    const { output } = await prompt(documentText);
    return output!;
  }
);