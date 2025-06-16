import connectToDB from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
    await connectToDB() ; 

    try {
        const reqBody = await request.json()
        const {username , email , password} = reqBody ; 
        const existingUserVerifiedbyUsername = await UserModel.findOne({
            username ,
            isVerified : true 
        })
        if(existingUserVerifiedbyUsername){
            return Response.json(
                {
                    success : false , 
                    message : "username is already taken "
                } , 
                {
                    status : 400 
                }
                )
        }

        // lets take out the user wrt to email 
        const existingUserbyEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() ; 
        if(existingUserbyEmail){
            if(existingUserbyEmail.isVerified){
                return Response.json(
                    {
                        success : false  ,
                        message : "User alredy exist with this email"
                    } , {
                        status : 400
                    }
                ) 
            }
            else{
                const hashedPassword = await bcrypt.hash(password , 10)
                existingUserbyEmail.password = hashedPassword ; 
                existingUserbyEmail.verifyCode = verifyCode ; 
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserbyEmail.save()
            }
        }
        else{
            // user came first time 
            const hashedPassword = await bcrypt.hash(password , 10)
            const expiryDate = new Date() ; 
            expiryDate.setHours(expiryDate.getHours() + 1) 

            const newuser = new UserModel({
                username: username , 
                email: email , 
                password: hashedPassword , 
                verifyCode: verifyCode , 
                verifyCodeExpiry: expiryDate ,  
                isVerified: false , 
                isAcceptingMessages: true , 
                messages: []
            })

            await newuser.save()
        }

        // send the verification email 
        const emailResponse = await sendVerificationEmail(
            email , 
            username , 
            verifyCode
        )
        console.log(emailResponse);
        

        if(! emailResponse.success){
            return Response.json(
                {
                    success : false  ,
                    message : emailResponse.message
                } , {
                    status : 500
                }
            )
        }
        
        // else direct message send 
        return Response.json(
            {
                success : false  ,
                message : "User registerd successfully , please verify you email"
            } , {
                status : 201
            }
        )


        
    } catch (error) {
        console.error("Error registering user" , error) ;
        return Response.json(
            {
                success : false , 
                message : "Error registering user "
            } ,
            {
                status : 500
            }   
        )
    }
}