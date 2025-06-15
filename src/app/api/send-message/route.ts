import UserModel from "@/Model/User";
import connectToDB from "@/lib/dbConnect";
import { Message } from "@/Model/User";

export async function POST(request: Request){
    await connectToDB() ; 
    const reqBody = await request.json()
    const{username , content} = reqBody 

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // check if user is accepting the message or not 
        if (!user.isAcceptingMessages) {
            return Response.json(
              { message: 'User is not accepting messages', success: false },
              { status: 403 } // 403 Forbidden status
            );
        }

        const newMessage = {content , createdAt : new Date()} 
         // Push the new message to the user's messages array
        user.messages.push(newMessage as Message); // assert as Message type , then only take , Typescript used 
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );


    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
