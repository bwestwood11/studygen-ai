import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import vision from "@google-cloud/vision";

type ReturnTypeFileToChunks = {
  chunks: string[];
  pages: number;
};
const supportedImageTypes = ["image/jpeg", "image/webp", "image/png"];
export const SUPPORTED_FILES = ["application/pdf", ...supportedImageTypes];

const pdfToChunks = async (file: File): Promise<ReturnTypeFileToChunks> => {
  const pdfLoader = new PDFLoader(file);
  const doc = await pdfLoader.load(); // Converts PDF to text
  console.log(doc, "doc");
  const chunks = doc.map(
    (page, index) =>
      `Page Number ${index}\n${page.pageContent.replace(/\s+/g, " ")}`
  );

  return { chunks, pages: doc.length };
};

export const imageToChunks = async (file: File) => {
  try{
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
  
    const base64Data = fileBuffer.toString("base64");
  
    const res = await fetch("https://vision.googleapis.com/v1/images:annotate", {
      method: "POST",
      headers: {
        "X-goog-api-key":` ${process.env.token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body:JSON.stringify({
        requests: [
          {
            image: {
              content: base64Data,
            },
            features: [
              {
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      },)
    })
    
    const jsonData = await res.json()
    console.log(res, jsonData)
    const textArray = jsonData?.responses[0].textAnnotations
    const text = textArray.map((t:any)=>t.description).join(" ")
  
    return {chunks:[text], pages:1}
  }
  catch(error){
    console.error(error)
    return {chunks:[], pages:0} 
  }
};

export const fileToChunks = async (
  file: File
): Promise<ReturnTypeFileToChunks> => {
  const fileType = file.type;
  console.log(fileType)

  switch (true) {
    case fileType === "application/pdf":
      return pdfToChunks(file);
    case supportedImageTypes.includes(fileType):
      return imageToChunks(file);
    default:
      return { chunks: [], pages: 0 };
  }
};
