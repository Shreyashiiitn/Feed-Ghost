import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDB from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";

export async function POST(req : Request) {
    await connectToDB()
    const session = await getServerSession(authOptions)
    const user: User = session?.user;

    if(!session || !session.user){
        return Response.json({
                success : false , 
                message : "Not Authenticated"
            }, 
            { status : 401}
        )
    }

    const userId = user._id ; 
    const {acceptMessages} = await req.json()

    try {
        const updateduser = await UserModel.findByIdAndUpdate(
            userId , {isAcceptingMessages : acceptMessages} , {new : true}
        )

        if(!updateduser){
            return Response.json({
                success : false , 
                message : "failed to update user status to accept messages"
            }, 
            { status : 401}
        )
        }

        return Response.json({
            success : true , 
            message : "Message acceptance status updated succesfully" , 
            updateduser
        }, 
        { status : 200}
    )
        
    } catch (error) {
        console.log("failed to update user status to accept messages");
        return Response.json({
            success : false , 
            message : "failed to update user status to accept messages"
        }, 
        { status : 500}
    )
    }

}

export async function GET(req : Request) {
    await connectToDB()
    const session = await getServerSession(authOptions)
    const user: User = session?.user;

    if(!session || !session.user){
        return Response.json({
                success : false , 
                message : "Not Authenticated"
            }, 
            { status : 401}
        )
    }

    const userId = user._id ; 
   try {
     const founduser = await UserModel.findById(userId)
 
     if(!founduser){
         return Response.json({
             success : false , 
             message : "User not found"
         }, 
         { status : 404}
     )
     }
 
     return Response.json({
         success : true , 
         isAcceptingMessages : founduser.isAcceptingMessages
     }, 
     { status : 200}
 )
   } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json({
        success : false , 
        message : "Error in gettting message acceptance status  "
    }, 
    { status : 500}
)
   }
    
}