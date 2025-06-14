import connectToDB from '@/lib/dbConnect';
import UserModel from '@/Model/User';
import { z } from 'zod';
import { usernameValidation } from '@/Schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await connectToDB();

  try {
    // query bhejega wrt to the url ?then query se bhejega woo 
    // url aisa hoga : localhost:3000/api/cuu?(username=hitesh?phone=android) // ()these are paramters 
    const { searchParams } = new URL(request.url);
    // hume apnna queryparameter chaiye 
    const queryParams = {
      username: searchParams.get('username'),
    };

    // validate with zod now , if parsed then value aa jayegi warna nahi ayegi 
    const result = UsernameQuerySchema.safeParse(queryParams);

    console.log(result) ; 

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data; //  waise hi result ke andar result.data 

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}