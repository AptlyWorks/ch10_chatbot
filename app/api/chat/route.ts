import { NextResponse } from 'next/server';
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex, CustomPineconeEmbeddings } from "@/lib/pineconeClient";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const pineconeIndex = getPineconeIndex();
    const embeddings = new CustomPineconeEmbeddings(process.env.PINECONE_API_KEY!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    const retriever = vectorStore.asRetriever({ k: 3 });
    const docs = await retriever.invoke(message);

    // If OPENAI_API_KEY is provided, generate a response using LLM
    if (process.env.OPENAI_API_KEY) {
      const llm = new ChatOpenAI({
        model: "gpt-5-nano",
      });

      const prompt = PromptTemplate.fromTemplate(`
다음 제공된 리뷰 정보를 바탕으로 사용자의 질문에 답하세요.

리뷰 정보:
{context}

사용자 질문: {question}

답변 (한국어로, 리뷰에 언급된 내용을 위주로 설명하세요):`);

      const chain = RunnableSequence.from([
        {
          context: () => docs.map((d: any) => d.pageContent).join("\n\n"),
          question: () => message,
        },
        prompt,
        llm,
        new StringOutputParser(),
      ]);

      const answer = await chain.invoke({});
      
      return NextResponse.json({
        success: true,
        answer,
        docs: docs.map(d => ({
          pageContent: d.pageContent,
          metadata: d.metadata,
        })),
      });
    }

    // Fallback if no LLM key
    return NextResponse.json({
      success: true,
      answer: "OPENAI_API_KEY가 설정되지 않아 문서 검색 결과만 반환합니다.",
      docs: docs.map(d => ({
        pageContent: d.pageContent,
        metadata: d.metadata,
      })),
    });

  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
