import { Pinecone } from '@pinecone-database/pinecone';

async function main() {
  const pc = new Pinecone({ apiKey: "pcsk_4GpLFS_8BRhg61qm9eXKQNhyR5EqZJoFbCJTMzqds9Lk7bvekq1YEnc3FKAJq18oRECDPu" });
  
  const texts = Array(100).fill("test text");
  const BATCH_SIZE = 96;
  const allEmbeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    console.log(`Processing batch ${i} to ${i + BATCH_SIZE}`);
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await pc.inference.embed({
      model: "llama-text-embed-v2",
      inputs: batch,
      parameters: { inputType: "passage", truncate: "END" }
    });
    console.log("Response data length:", response.data.length);
    const embeddings = response.data.map((r: any) => r.values || []);
    allEmbeddings.push(...embeddings);
  }
  
  console.log("Total embeddings length:", allEmbeddings.length);
}

main().catch(console.error);
