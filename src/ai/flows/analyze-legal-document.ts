import { z } from 'zod';

import { ai } from '../ai';
import { Flow } from '../flow';

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

export const analyzeLegalDocument = new Flow(
  'analyze-legal-document',
  ai
    .completion({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4000,
    })
    .withDescription(analyzeLegalDocumentDescription)
    .withInputSchema(z.string())
    .withOutputSchema(analyzeLegalDocumentSchema)
);
'11': '11. Any person charged with an offence has the right (a) to be informed without unreasonable delay of the specific offence; (b) to be tried within a reasonable time; (c) not to be compelled to be a witness in proceedings against that person in respect of that offence; (d) to be presumed innocent until proven guilty according to law in a fair and public hearing by an independent and impartial tribunal; (e) not to be denied reasonable bail without just cause;
(f) except in the case of an offence under military law tried before a military tribunal, to the benefit of trial by jury where the maximum punishment for the offence is imprisonment for five years or a more severe punishment; (g) not to be found guilty on account of any act or omission unless, at the time of the act or omission, it constituted an offence under Canadian or international law or was criminal according to the general principles of law recognized by civilized nations; (h) if finally acquitted of the offence, not to be tried for it again and, if finally found guilty and punished for the offence, not to be tried or punished for it again; and (i) if found guilty of the offence and if the punishment for the offence has been varied between the time of commission and the time of sentence, to the benefit of the lesser punishment.',
  };