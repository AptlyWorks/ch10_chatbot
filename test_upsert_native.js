const fs = require('fs');
const dotenv = fs.readFileSync('.env.local', 'utf-8').split('\n');
for (const line of dotenv) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    process.env[k.trim()] = v.trim();
  }
}

async function main() {
  const { CSVLoader } = require("@langchain/community/document_loaders/fs/csv");
  const { PineconeStore } = require("@langchain/pinecone");
  const { getPineconeIndex, CustomPineconeEmbeddings } = require("./lib/pineconeClient");
  const path = require('path');

  const filePath = path.join(process.cwd(), 'samples', 'review.csv');
  console.log("Loading CSV from:", filePath);
  const loader = new CSVLoader(filePath);
  const docs = await loader.load();
  console.log("Loaded docs count:", docs.length);

  const embeddings = new CustomPineconeEmbeddings(process.env.PINECONE_API_KEY);
  const pineconeIndex = getPineconeIndex();

  console.log("Calling PineconeStore.fromDocuments...");
  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5, 
  });
  console.log("PineconeStore.fromDocuments finished.");
}
main().catch(console.error);
