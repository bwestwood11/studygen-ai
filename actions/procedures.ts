import { ZSAError, createServerActionProcedure } from "zsa";
import { getCurrentUser } from "./auth.action";

export const authenticatedProcedure = createServerActionProcedure() 
  .handler(async () => {
    try {
      const session = await getCurrentUser();
      if(!session || !session.id || !session.email) throw new ZSAError(
        "NOT_AUTHORIZED",
        "You are not authorized to perform this action" 
      )
      
      return {
        user: { id: session.id, email: session.email }
      }

    } catch {
        throw new ZSAError(
            "NOT_AUTHORIZED",
            "You are not authorized to perform this action"
        )
    }
})