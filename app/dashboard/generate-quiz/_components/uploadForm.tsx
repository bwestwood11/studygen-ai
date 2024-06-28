"use client";

import { UploadPDF, getUserFiles } from "@/actions/rag.action";
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

const UploadForm = ({
  initialFiles,
}: {
  initialFiles: Files[]
}) => {
    const [selectedFile,setSelectedFile] = useState<string | undefined>()
    const { isLoading, data:files, refetch } = useServerActionQuery(getUserFiles, {
      queryKey: ["user-files"],
      initialData:{success:true, files:initialFiles},
      input:undefined,
      enabled:false,
    });

  const { isPending, execute, error, isError, executeFormAction } =
    useServerAction(UploadPDF, {
        onSuccess:(data)=>{
            refetch()
            setSelectedFile(data.data)
        },
        onError(args) {
            console.log(args)
            alert("Error")
        },
    });


  return (
    <div className="bg-card rounded-lg shadow-sm border border-input p-6">
      <form onSubmit={async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);
        const [data, err] = await execute(formData);

        if (err) return;

        form.reset();
      }}
       className="space-y-4">
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
              {isPending ? "Uploading" : "Upload"}
            </Button>
          </div>
        </div>
      </form>

      <p className="text-center text-muted-foreground">or</p>
      <Select value={selectedFile} onValueChange={setSelectedFile}>
        <SelectTrigger>
          <SelectValue placeholder="Select An Existing File" />
        </SelectTrigger>
        <SelectContent>
          {files.files?.map((file) => {
            return <SelectItem key={file.fileId} value={file.fileId}>{file.fileName}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      <Button disabled={isPending || !selectedFile} type="submit" className="w-full mt-4">
        Generate Quiz
      </Button>
    </div>
  );
};

export default UploadForm;
