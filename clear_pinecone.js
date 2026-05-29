const fs = require('fs');
const dotenv = fs.readFileSync('.env', 'utf-8').split('\n');
for (const line of dotenv) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    process.env[k.trim()] = v.trim().replace(/^"|"$/g, '');
  }
}

async function main() {
  const { Pinecone } = require('@pinecone-database/pinecone');
  
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
  }

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const indexName = "review-chatbot";
  const index = pc.index(indexName);

  console.log("Deleting all records in Pinecone...");
  await index.deleteAll();
  console.log("Successfully deleted all records from Pinecone index!");
}

main().catch(console.error);
