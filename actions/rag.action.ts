"use server";

import { z } from "zod";
import { authenticatedProcedure, paidProcedure } from "./procedures";
import { PineconeStore } from "@langchain/pinecone";
import { deleteNameSpace, pinecone } from "@/lib/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { embedContent, genAI } from "@/lib/gemini";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { embedChunks, generatePrompt, upsertDocument } from "@/lib/gemini-pdf";
import { prompts } from "@/lib/constant/prompts";
import { sanitizeFileName } from "@/lib/utils";
import { prisma } from "@/prisma/prisma";
import { CREDITS_REQUIREMENT } from "@/lib/config";
import { ZSAError } from "zsa";
import { quizArraySchema } from "@/lib/schemas/quiz-schema";
import { revalidatePath } from "next/cache";

export const UploadPDF = paidProcedure
  .createServerAction()
  .input(
    z.object({
      file: z.instanceof(File),
    }),
    {
      type: "formData",
    }
  )
  .handler(async ({ ctx, input }) => {
    const file = input.file;
    const pdfLoader = new PDFLoader(file);
    const doc = await pdfLoader.load(); // Converts PDF to text
    console.log(doc, "doc");
    const chunks = doc.map(
      (page, index) =>
        `Page Number ${index}\n${page.pageContent.replace(/\s+/g, " ")}`
    );
    
    const totalCreditsRequired = doc.length * CREDITS_REQUIREMENT.UPLOAD_PDF_PER_PAGE || 20
    if(ctx.user.credits < totalCreditsRequired){
      throw new ZSAError(
        "INSUFFICIENT_CREDITS",
        "You do not have enough balance"
      );
    }


    const namespace = `${ctx.user.id}:${sanitizeFileName(file.name)}`
    const embeddings = await embedChunks(chunks, namespace);
    await upsertDocument(embeddings, namespace);

    const user = await prisma.user.update({
      where:{
        id:ctx.user.id
      },
      data:{
        credits:{
          decrement:totalCreditsRequired
        },
        files:{
          create:{
            fileId: namespace,
            pages: doc.length,
            fileName:file.name
          }
        }
      },
      
    })
    return namespace
  });

export const searchGeneratedContent = authenticatedProcedure
  .createServerAction()
  .input(z.object({ query: z.string(), fileIncluded:z.string() }))
  .handler(async ({ ctx, input }) => {
    const query = input.query;
    const embeddings = await embedContent(query)
    
    // NameSpace -> userid:pdf_name
    const pineconeIndex = pinecone
      .Index("study-gen")
      .namespace(input.fileIncluded);
    const results = await pineconeIndex.query({
      topK: 4,
      vector: embeddings.embedding.values,
      includeValues: true,
      includeMetadata: true,
    });

    const relatedText = results?.matches
      .map((i) => i.metadata?.text)
      .filter(Boolean) // This removes any undefined or null values
      .join(" ------ NEXT_PAGE ------- ");

    console.log({ relatedText });
    const prompt = prompts.askPdf(relatedText, query);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

   
    return {text: text, pages: results.matches.map((i) => i.metadata?.page)};
  });

export const generateQuizAction = paidProcedure
  .createServerAction()
  .input(z.object({ fileIncluded:z.string(), numberOfQuestions:z.number().min(5).max(10) }))
  .handler(async ({ ctx, input }) => {
   try {
    const totalCreditsRequired = CREDITS_REQUIREMENT.GENERATE_MCQ
    if(ctx.user.credits < totalCreditsRequired){
      throw new ZSAError(
        "INSUFFICIENT_CREDITS",
        "You do not have enough balance"
      );
    }
    const embeddings = await embedContent("Questions and Topics That are unique and related to pdf")
    
    // NameSpace -> userid:pdf_name
    const pineconeIndex = pinecone
      .Index("study-gen")
      .namespace(input.fileIncluded);
    const results = await pineconeIndex.query({
      topK: 7,
      vector: embeddings.embedding.values,
      includeValues: true,
      includeMetadata: true,
    });

    const relatedText = results?.matches
      .map((i) => i.metadata?.text)
      .filter(Boolean) // This removes any undefined or null values
      .join(" ------ NEXT_PAGE ------- ");

    console.log({ relatedText });
    const prompt = prompts.mcqGenerator(relatedText, input.numberOfQuestions);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const user = await prisma.user.update({
      where:{
        id:ctx.user.id
      },
      data:{
        credits:{
          decrement:totalCreditsRequired
        },
      },   
    })

    const jsonResponse = JSON.parse(text)
    console.log(jsonResponse)
   const isValidated = quizArraySchema.safeParse(jsonResponse)
   if(!isValidated.success){
      throw new ZSAError("OUTPUT_PARSE_ERROR", "Response is not in correct format")
    }
    revalidatePath('/', 'layout')
    return {quiz: isValidated.data, pages: results.matches.map((i) => i.metadata?.page)};
   } catch (error) {
      console.log(error)
   } 
  });


export const deleteFile = authenticatedProcedure.createServerAction().input(z.object({
  fileName:z.string()
})).handler(async ({ctx,input}) => {
  await deleteNameSpace(input.fileName)
  return {success:true}
})


export const getUserFiles = authenticatedProcedure.createServerAction().handler(async ({ctx,input}) => {
  const user = await prisma.user.findFirst({
    where:{
      id:ctx.user.id
    },
    include:{
      files:true
    }
  })

  if(!user){
    throw new ZSAError("NOT_AUTHORIZED", "User is Not Found")
  }
  

  return {success:true, files:user?.files}
})