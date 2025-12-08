'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "./providers/auth-provider"
import { getToken } from "@/app/lib/auth"

type JwtPayload = {
  id: string,
  username: string,
  role: string
}


const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(10, "Username must be at most 10 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    ),
  password: z.string().min(1, "Password Can`t be Empty")
})

type loginFormType = z.infer<typeof formSchema>
const LOGIN_URL = 'api/login'


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error , serError] = useState("");
  const auth = useAuth();
  const router = useRouter();
  const form = useForm<loginFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  
  async function onSubmit(data: loginFormType) {
   let result = {}
 
   try{
     const res = await axios.post(LOGIN_URL, data)
     result = res
    if(res.data){
      router.push('/test')
    }
   }
   catch(error){
    serError('Invaild username or password')
   
   }
    
      
}


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} method="post">
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="input-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Your Username"
                      autoComplete="username"
                      className="h-10"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="input-password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="password"
                      className="h-10"
                      type="password"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          {error&& <p className=" bg-red-200 p-2 mt-3 text-center text-red-700 "> {error}</p>}
        </CardContent>
        <CardFooter>
        <Field orientation="vertical">
          <Button type="submit" form="login-form" className="h-10">
            Login
          </Button>
           <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
        </Field>
      </CardFooter>
      </Card>
    </div>
  )
}
