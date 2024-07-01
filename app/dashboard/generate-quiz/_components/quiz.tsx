"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { Quiz } from "@/lib/schemas/quiz-schema"
import { cn } from "@/lib/utils"

export default function GeneratedQuiz({ quizzes, resetQuiz }: { quizzes: Quiz[], resetQuiz:()=>void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answerStatus, setAnswerStatus] = useState<"CORRECT" | "EMPTY" | "WRONG">("EMPTY")
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")

  const handleAnswerSubmit = (selectedAnswer: string) => {
    setSelectedAnswer(selectedAnswer)
    if (selectedAnswer.toLowerCase() === quizzes[currentQuestion].answer.toLowerCase()) {
      setScore(score + 1)
      setAnswerStatus("CORRECT")
      
    } else {
      setAnswerStatus("WRONG")
    }
  }

  const handleNextQuestion = () => {
    setAnswerStatus("EMPTY")
    if (currentQuestion === quizzes.length - 1) {
      setShowResult(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }



  return (
    <div className="flex flex-col items-center justify-center  bg-background">
      <Card className="w-full max-w-xl p-6">
        {showResult ? (
            // TODO: Generate a PDF report from questions and answers
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Quiz Results</h2>
            <p className="text-lg">
              You scored {score} out of {quizzes.length}
            </p>
            <Button onClick={resetQuiz}>Play Again</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">
                Question {currentQuestion + 1} of {quizzes.length}
              </div>
              <div className="text-muted-foreground">Score: {score}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{quizzes[currentQuestion].question}</h2>
              <div className="grid gap-2">
                {quizzes[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    disabled={answerStatus !== "EMPTY"}
                    onClick={() => handleAnswerSubmit(option)}
                    className={cn(
                      "justify-start text-wrap text-left py-2",
                      answerStatus === "CORRECT" && option.toLowerCase() === quizzes[currentQuestion].answer.toLowerCase() ? "bg-green-500 text-white" :
                      answerStatus === "WRONG" && option.toLowerCase() === quizzes[currentQuestion].answer.toLowerCase() ? "bg-green-500 text-white" :
                      answerStatus === "WRONG" && selectedAnswer?.toLowerCase() === option.toLowerCase() ? "bg-red-500 text-white" : ""
                    )}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <Progress className="h-2" value={((currentQuestion + 1) / quizzes.length) * 100} />
            {answerStatus !== "EMPTY" && (
              <Button onClick={handleNextQuestion} className="mt-4">
                Next Question
              </Button>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
