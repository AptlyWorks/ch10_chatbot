import { Pinecone } from '@pinecone-database/pinecone';
import { Embeddings } from "@langchain/core/embeddings";

if (!process.env.PINECONE_API_KEY) {
  console.warn("Missing PINECONE_API_KEY in .env");
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const getPineconeIndex = () => {
  return pinecone.Index("review-chatbot");
};

export class CustomPineconeEmbeddings extends Embeddings {
  private pc: Pinecone;
  private model: string;

  constructor(apiKey: string, model: string = "llama-text-embed-v2") {
    super({});
    this.pc = new Pinecone({ apiKey });
    this.model = model;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const BATCH_SIZE = 96;
    const allEmbeddings: number[][] = [];
    
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const response = await this.pc.inference.embed({
        model: this.model,
        inputs: batch,
        parameters: { inputType: "passage", truncate: "END" }
      });
      const embeddings = response.data.map((r: any) => r.values || []);
      allEmbeddings.push(...embeddings);
    }
    
    return allEmbeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const response = await this.pc.inference.embed({
      model: this.model,
      inputs: [text],
      parameters: { inputType: "query", truncate: "END" }
    });
    return response.data[0].values || [];
  }
}
