"use client";

import {
  UploadPDF,
  generateQuizAction,
  getUserFiles,
} from "@/actions/rag.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerActionQuery } from "@/lib/hooks/tanstack-query-hook";
import { Files } from "@prisma/client";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import GeneratedQuiz from "./quiz";

const UploadForm = ({ initialFiles }: { initialFiles: Files[] }) => {
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [numberOfQuestions, setNumberOfQuestions] = useState<string | undefined>();
  const [error, setError] = useState("");
  const {
    isLoading,
    data: files,
    refetch,
  } = useServerActionQuery(getUserFiles, {
    queryKey: ["user-files"],
    initialData: { success: true, files: initialFiles },
    input: undefined,
    enabled: false,
  });

  const { isPending: isUploading, execute } = useServerAction(UploadPDF, {
    onSuccess: (data) => {
      refetch();
      setSelectedFile(data.data);
    },
    onError(args) {
      console.log(args);
      alert("Error");
    },
  });

  const {
    isPending: isGeneratingQuiz,
    execute: generateQuiz,
    data: Questions,
    reset,
  } = useServerAction(generateQuizAction, {
    onSuccess: (data) => {
      refetch();
    },
    onError(args) {
      console.log(args);
      alert("Error");
    },
  });

  const onGenerateQuiz = () => {
    if (!selectedFile) {
      return setError("Please select a file");
    }
    generateQuiz({ fileIncluded: selectedFile, numberOfQuestions: parseInt(numberOfQuestions || "5")});
  };

  const resetChat = () => {
    reset();
  };

  if (Questions && Questions.quiz.length >= 1) {
    return <GeneratedQuiz resetQuiz={resetChat} quizzes={Questions.quiz} />;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-input p-6">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.target as HTMLFormElement;

          const formData = new FormData(form);
          const [_, err] = await execute(formData);

          if (err) return;

          form.reset();
        }}
        className="space-y-4"
      >
        <div>
          <Label
            htmlFor="pdf-upload"
            className="block text-sm font-medium text-foreground"
          >
            Upload PDF
          </Label>
          <div className="mt-1 flex gap-3">
            <Input
              id="pdf-upload"
              name="file"
              type="file"
              accept=".pdf"
              className="block flex-1 w-full border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            />
            <Button type="submit" className="" variant={"outline"}>
              {isUploading ? "Uploading" : "Upload"}
            </Button>
          </div>
        </div>
      </form>

      <p className="text-center text-muted-foreground py-2">or</p>
      <div className="flex flex-col gap-4">
      
        <Select value={selectedFile} onValueChange={setSelectedFile}>
          <SelectTrigger>
            <SelectValue placeholder="Select An Existing File" />
          </SelectTrigger>
          <SelectContent>
            {files.files?.map((file) => {
              return (
                <SelectItem key={file.fileId} value={file.fileId}>
                  {file.fileName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
          <SelectTrigger>
            <SelectValue placeholder="Number of Questions" />
          </SelectTrigger>
          <SelectContent>
            {["5", "6", "7", "8", "9", "10"].map((val) => (
              <SelectItem key={`${val} Number`} value={val}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onGenerateQuiz}
        disabled={isUploading || !selectedFile}
        className="w-full mt-4"
      >
        {!isGeneratingQuiz ? "Generate Quiz" : "Loading..."}
      </Button>
    </div>
  );
};

export default UploadForm;
