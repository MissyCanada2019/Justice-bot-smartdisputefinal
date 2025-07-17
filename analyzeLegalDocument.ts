import { z } from "zod";
import { Tool } from "langchain/tools";

// Define a tool to analyze a Canadian Charter section
export const analyzeLegalDocument = new Tool({
  name: "analyze_legal_document",
  description: "Provides the full text of a section of the Canadian Charter of Rights and Freedoms.",
  schema: z.object({
    sectionNumber: z.string().describe("The number of the Charter section to retrieve"),
  }),
  outputSchema: z.string(),
  func: async (input) => {
    const charterSections: Record<string, string> = {
      "1": "Section 1: The Charter guarantees the rights and freedoms set out in it, subject only to such reasonable limits prescribed by law as can be demonstrably justified in a free and democratic society.",
      "2": "Section 2: Everyone has the following fundamental freedoms: (a) conscience and religion; (b) thought, belief, opinion, and expression; (c) peaceful assembly; (d) association.",
      "7": "Section 7: Everyone has the right to life, liberty and security of the person and the right not to be deprived thereof except in accordance with the principles of fundamental justice.",
    };

    return charterSections[input.sectionNumber] || "Section not found.";
  }
});
