import { z } from 'genkit';
import { AssessDisputeMeritOutputSchema } from './flows/assess-dispute-merit'; // Re-use existing schema

const MessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

export const ConversationStateSchema = z.object({
 messages: z.array(MessageSchema).describe("A history of the conversation so far."),
  question: z.string().describe("The user's latest message or question."),
  caseContext: AssessDisputeMeritOutputSchema.optional().describe(
    'The full context of the user's assessed case, if available.'
  ), // Added a comma here
});

export const ConversationalChatInputSchema = z.object({
  question: z.string().describe("The user's latest message or question."),
  chatHistory: z
    .array(MessageSchema)
    .optional()
 .describe('The history of the conversation so far.'),
});export type ConversationalChatInput = z.infer<typeof ConversationalChatInputSchema>; // <-- Add this export here

export const ConversationalChatOutputSchema = z.object({
  answer: z.string().describe('The AI's response to the user's question.'),
});export type ConversationalChatOutput = z.infer<typeof ConversationalChatOutputSchema>; // <-- Add this export here