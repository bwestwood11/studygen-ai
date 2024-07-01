import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });


export const deleteNameSpace = async (namespace:string) => {
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME!)

    await index.namespace(namespace).deleteAll();
}