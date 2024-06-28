"use client";

import {
    UploadPDF,
    deleteFile,
    generateQuizAction,
    getUserFiles,
  } from "@/actions/rag.action";
  import { usePurchaseModal } from "@/components/modal/purchase-credits";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  import { useServerAction } from "zsa-react";

const QuizGenerator = () => {
    const [fileIncluded, setFileIncluded] = useState("");
      const { openModal } = usePurchaseModal();
    
      const handleUpload = async (formData: FormData) => {
        const [data, error] = await UploadPDF(formData);
        console.log(data, error);
        setFileIncluded(data || "");
      };
    
      const generateQuiz = async () => {
        const response = await generateQuizAction({ fileIncluded });
        console.log(response, "response");
      };
    
      return (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
          <Button onClick={() => openModal()}>Purchase Credits</Button>
          <form action={handleUpload}>
            <input name="file" type="file" />
            <Button>Upload PDF</Button>
          </form>
          <Button onClick={() => generateQuiz()}>Generate Quiz {fileIncluded}</Button>
          <Button onClick={() => deleteFile({ fileName: "667431c4027c5521c04ec1fb:brett%20westwood%20-%20software%20engineer%20resume.docx.pdf" })}>
            Delete
          </Button>
        
        </div>
      );
}

export default QuizGenerator