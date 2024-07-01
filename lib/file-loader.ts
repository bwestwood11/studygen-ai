import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

type ReturnTypeFileToChunks = {
    chunks:string[],
    pages:number;
}

export const SUPPORTED_FILES = [
    'application/pdf',
]

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

export const imageToChunks =  async (file:File) => {
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);

  const base64Data = fileBuffer.toString('base64');

  return base64Data;
}



export const fileToChunks = async (file: File): Promise<ReturnTypeFileToChunks> => {
    const fileType = file.type;
    
  
    switch (fileType) {
      case 'application/pdf':
        return pdfToChunks(file);
      default:
        return { chunks: [],pages: 0}
    }
  };
