import { z } from 'genkit';
import { AssessDisputeMeritOutputSchema } from './assess-dispute-merit'; // Re-use existing schema

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

export const ConversationalChatInputSchema = z.object({
  question: z.string().describe("The user's latest message or question."),
  caseContext: AssessDisputeMeritOutputSchema.optional().describe(
    'The full context of the user's assessed case, if available.'
  ),
  chatHistory: z
    .array(ChatMessageSchema)
    .optional()
    .describe('The history of the conversation so far.'),
});
export type ConversationalChatInput = z.infer<typeof ConversationalChatInputSchema>; // <-- Add this export here

export const ConversationalChatOutputSchema = z.object({
  answer: z.string().describe('The AI's response to the user's question.'),
});
export type ConversationalChatOutput = z.infer<typeof ConversationalChatOutputSchema>; // <-- Add this export here