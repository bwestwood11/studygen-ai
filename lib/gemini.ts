import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export const embedContent = async (content:string) => {
    const embeddingModel = genAI.getGenerativeModel({
        model: "text-embedding-004",
      });
    const embeddings = await embeddingModel.embedContent(content);
    return embeddings
}
