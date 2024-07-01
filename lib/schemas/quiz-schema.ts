import z from "zod";

export const quizSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).min(4).max(4),
    answer: z.string(),
})

export const quizArraySchema = z.array(quizSchema)

export type Quiz = z.infer<typeof quizSchema>