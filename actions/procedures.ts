import { ZSAError, createServerActionProcedure } from "zsa";
import { getCurrentUser } from "./auth.action";

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    const session = await getCurrentUser();
    if (!session || !session.id || !session.email)
      throw new ZSAError(
        "NOT_AUTHORIZED",
        "You are not authorized to perform this action"
      );

    return {
      user: { id: session.id, email: session.email, credits:session.credits },
    };
  }
);


export const paidProcedure = createServerActionProcedure(authenticatedProcedure).handler(
  async ({ctx}) => {
    const credits = ctx.user.credits
    if(credits < 1){
      throw new ZSAError(
        "INSUFFICIENT_CREDITS",
        "You do not have enough balance"
      );
    }
    
    return ctx
  }
)