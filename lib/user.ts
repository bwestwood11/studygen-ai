import { prisma } from "@/prisma/prisma"

export const getUserById = async (id:string) => {
    try {
        if(!id){
        return null
    }
    const user = await prisma.user.findFirst({
        where:{
            id
        }
    })
    
    return user
    } catch (error) {
        console.log(error)
        return null
    }
    
}