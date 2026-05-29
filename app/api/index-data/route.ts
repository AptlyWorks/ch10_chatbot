import { NextResponse } from 'next/server';
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex, CustomPineconeEmbeddings } from "@/lib/pineconeClient";
import { supabase } from "@/lib/supabaseClient";
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

export async function POST(req: Request) {
  try {
    const filePath = path.join(process.cwd(), 'samples', 'review.csv');
    console.log("Loading CSV from:", filePath);
    const loader = new CSVLoader(filePath);
    const docs = await loader.load();
    console.log("Loaded docs count:", docs.length);

    const embeddings = new CustomPineconeEmbeddings(process.env.PINECONE_API_KEY!);
    const pineconeIndex = getPineconeIndex();

    console.log("Embedding documents...");
    const vectors = await embeddings.embedDocuments(docs.map(d => d.pageContent));
    
    console.log("Parsing CSV for correct IDs and metadata...");
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedCsv = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    const records = docs.map((doc, idx) => {
      const row: any = parsedCsv.data[idx] || {};
      const actualId = row.id?.toString() || `review-${Date.now()}-${idx}`;
      return {
        id: actualId,
        values: vectors[idx],
        metadata: { ...doc.metadata, text: doc.pageContent, ...row }
      };
    });

    console.log("Upserting records manually to bypass Langchain PineconeStore bug...");
    for (let i = 0; i < records.length; i += 100) {
      const chunk = records.slice(i, i + 100);
      await pineconeIndex.upsert({ records: chunk });
    }
    console.log("Manual upsert to Pinecone finished.");

    console.log("Upserting records to Supabase reviews table...");

    const supabaseRecords = parsedCsv.data.map((row: any, idx) => ({
      id: row.id || `review-${Date.now()}-${idx}`,
      rating: row.rating ? parseInt(row.rating, 10) : null,
      title: row.title || '',
      content: row.content || '',
      author: row.author || '',
      date: row.date || '',
      helpful_votes: row.helpful_votes ? parseInt(row.helpful_votes, 10) : 0,
      verified_perchase: row.verified_perchase || ''
    }));

    const { error: supabaseError } = await supabase.from('reviews').upsert(supabaseRecords);
    if (supabaseError) {
      console.error("Supabase upsert error:", supabaseError);
      throw new Error(`Supabase Error: ${supabaseError.message}`);
    }
    console.log("Supabase upsert finished.");

    return NextResponse.json({ success: true, message: `Successfully indexed ${docs.length} documents.` });
  } catch (error: any) {
    console.error("Indexing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
