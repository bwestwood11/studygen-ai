import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { genAI } from "./gemini";
import { pinecone } from "./pinecone";

export async function embedChunks(chunks: string[],namespace:string): Promise<any> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  try {
    let embeddingsPromises: Promise<any>[] = [];
    chunks.forEach(async (chunk) => {
      const embedding = model.embedContent(chunk);
      embeddingsPromises.push(embedding);
    });

    const rawEmbeddings = await Promise.all(embeddingsPromises);
    const embeddings = rawEmbeddings.map((embed, idx) => ({
      id: `${namespace}:${idx}`,
      values: embed.embedding.values,
      text: chunks[idx],
      page:idx + 1
    }));
    console.log(embeddings);

    return embeddings;
  } catch (error) {
    console.error("Error embedding text with OpenAI:", error);
    throw error;
  }
}

type TDocument = {
  id: string;
  values: number[];
  text: string;
  page:string;
};

export async function upsertDocument(chunks: TDocument[], namespaceId: string) {
  // Adjust to use namespaces if you're organizing data that way
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!).namespace(namespaceId);

  const vectors: PineconeRecord<RecordMetadata>[] = chunks.map((chunk) => ({
    id: chunk.id,
    values: chunk.values,
    metadata: {
      text: chunk.text,
      page: chunk.page
    },
  }));

  // Batch the upsert operation
  const batchSize = 200;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await pineconeIndex.upsert(batch);
  }
}


export function generatePrompt(context:string, query:string){
    const prompt1 = `
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        DO NOT SHARE REFERENCE URLS THAT ARE NOT INCLUDED IN THE CONTEXT BLOCK.
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        If user asks about or refers to the current "workspace" AI will refer to the the content after START CONTEXT BLOCK and before END OF CONTEXT BLOCK as the CONTEXT BLOCK. 
        If AI sees a REFERENCE URL in the provided CONTEXT BLOCK, please use reference that URL in your response as a link reference right next to the relevant information in a numbered link format e.g. ([reference number](link))
        If link is a pdf and you are CERTAIN of the page number, please include the page number in the pdf href (e.g. .pdf#page=x ).
        If AI is asked to give quotes, please bias towards providing reference links to the original source of the quote.
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation. It will say it does not know if the CONTEXT BLOCK is empty.
        AI assistant will not invent anything that is not drawn directly from the context.
        AI assistant will not answer questions that are not related to the context.
        
        Question of the user : ${query}
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
    
    `
    const prompt2 = `
    You are an Quiz Maker Ai You will generate 5 MCQ from the context block in a structure 
    {
        question:string,
        options:string[],
        answer:string
    }
    
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK

`
return prompt2
}