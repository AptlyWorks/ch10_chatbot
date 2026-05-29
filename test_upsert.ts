import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from '@pinecone-database/pinecone';
import { CustomPineconeEmbeddings } from "./lib/pineconeClient";
import path from 'path';

// Override to avoid dotenv issue
process.env.PINECONE_API_KEY = "pcsk_4GpLFS_8BRhg61qm9eXKQNhyR5EqZJoFbCJTMzqds9Lk7bvekq1YEnc3FKAJq18oRECDPu";

async function main() {
  const filePath = path.join(process.cwd(), 'samples', 'review.csv');
  console.log("Loading CSV from:", filePath);
  const loader = new CSVLoader(filePath);
  const docs = await loader.load();
  console.log("Loaded docs count:", docs.length);

  const embeddings = new CustomPineconeEmbeddings(process.env.PINECONE_API_KEY);
  
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const pineconeIndex = pinecone.Index("review-chatbot");

  console.log("Calling PineconeStore.fromDocuments...");
  try {
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
    });
    console.log("PineconeStore.fromDocuments finished.");
  } catch(e: any) {
    console.error("Error in fromDocuments:", e);
  }
}
main().catch(console.error);
