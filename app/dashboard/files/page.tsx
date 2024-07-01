"use client"
import { deleteFile, getUserFiles } from "@/actions/rag.action";
import { Button } from "@/components/ui/button";
import { useServerActionQuery } from "@/lib/hooks/tanstack-query-hook";
import React from "react";
import { useServerAction } from "zsa-react";

const Page =  () => {
  const {data} = useServerActionQuery(getUserFiles, {
    queryKey:["getUserFiles"],
    input:undefined
  })
  const {data:deleteData, execute:deleteMutate, isPending} = useServerAction(deleteFile,{
    onError:(err)=>{
        console.log(err)
    }
  } )

  return (
    <div>
      {data?.files.map((file) => {
        return (
          <div key={file.fileId}>
            
              {file.fileName}
              <Button onClick={() => deleteMutate({fileId:file.fileId})}>{isPending ? "Deleting..." : "Delete"}</Button>
          </div>
        );
      })}
    </div>
  );
};

export default Page;
