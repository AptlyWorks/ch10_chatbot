import { CustomPineconeEmbeddings } from './lib/pineconeClient';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const embeddings = new CustomPineconeEmbeddings(process.env.PINECONE_API_KEY!);
  const result = await embeddings.embedDocuments(["test1", "test2"]);
  console.log("Length:", result.length);
  if (result.length > 0) {
    console.log("First embedding length:", result[0].length);
  }
}
main().catch(console.error);
