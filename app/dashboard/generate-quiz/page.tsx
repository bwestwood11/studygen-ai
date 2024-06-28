
import { getUserFiles } from "@/actions/rag.action";
import UploadForm from "./_components/uploadForm";

export default async function Component() {
  const [data, error] = await getUserFiles();

  return (
    <div className="flex flex-col items-center justify-center h-fullscreen bg-background">
      <div className="max-w-2xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              PDF Quiz Generator
            </h1>
            <p className="mt-3 text-muted-foreground">
              Upload a PDF document and generate a multiple-choice quiz based on
              its content.
            </p>
          </div>
          
            <UploadForm initialFiles={data?.files || []} />
          
        </div>
      </div>
    </div>
  );
}
