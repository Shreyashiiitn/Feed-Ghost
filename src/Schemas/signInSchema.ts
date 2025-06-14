import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string(), // email or username bol sakte hai , identifier bas standard word hai isiliye bolte hai aise 
  password: z.string(),
});