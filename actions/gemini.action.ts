"use server"
import { z } from "zod";
import { authenticatedProcedure } from "./procedures";
import { prisma } from "@/prisma/prisma";
import { ZSAError } from "zsa";
import { CREDITS_REQUIREMENT } from "@/lib/config";
import { genAI } from "@/lib/gemini";
import { HistoryParser } from "@/lib/utils";

export const GenerateContentAction = authenticatedProcedure.createServerAction().input(z.object({
    question:z.string(),
    history:z.array(z.object({
        message:z.string(),
        by:z.enum(["user" , "model"])
    }))
    
})).handler(async ({input, ctx}) => {
    const parsedHistory = HistoryParser(input.history)

    const user = await prisma.user.findFirst({
        where:{
            id:ctx.user.id
        }
    })

    if (!user) {
        throw new ZSAError("NOT_AUTHORIZED", "Your are not logged in.")
    }

    if(user.credits < CREDITS_REQUIREMENT.ANSWER_GENERAL_QUESTION){
        throw new ZSAError("INSUFFICIENT_CREDITS", "Purchase the credits to continue.")
    }

    const prompt = `
    You are a Teaching Ai. You Will Help Students in Explaining, Solving and Helping Student in their problems. You will act as an friendly teacher while explaining concept

    Instructions: 
        1. You Will Stick to the topic and will give answer that is most relevant and what student has asked
        2. You will not give answer out of context
    Question: ${input.question}`

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: prompt,
    });
      
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const chat = model.startChat({generationConfig, history:parsedHistory});

    const result = await chat.sendMessage(input.question);
    const text = result.response.text();
    

    await prisma.user.update({
        where:{
            id:ctx.user.id
        },
        data:{
            credits:{
                decrement:CREDITS_REQUIREMENT.ANSWER_GENERAL_QUESTION
            }
        }
    })
    

    return text
})