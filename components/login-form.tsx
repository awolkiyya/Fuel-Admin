"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useLogin } from "@/hooks/auth/useLogin"
import { Eye, EyeOff } from "lucide-react"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { mutate, isPending } = useLogin()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [showPassword,setShowPassword] = useState(false)


  const onSubmit = (e:React.FormEvent)=>{
    e.preventDefault()

    mutate({
      email,
      password
    })
  }


  return (

    <div
      className={cn(
        "flex flex-col gap-6",
        className
      )}
      {...props}
    >

      <Card
        className="
          overflow-hidden
          p-0
          bg-card
          text-card-foreground
        "
      >

        <CardContent
          className="
            grid
            md:p-10
            md:grid-cols-2
          "
        >

          {/* FORM */}
          <form
            className="
              p-6
              md:p-8
            "
            onSubmit={onSubmit}
          >

            <FieldGroup>


              {/* HEADER */}
              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                  text-center
                "
              >

                <h1
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Welcome back
                </h1>


                <p
                  className="
                    text-muted-foreground
                  "
                >
                  Login to your account
                </p>

              </div>



              {/* EMAIL */}
              <Field>

                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>


                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e)=>
                    setEmail(e.target.value)
                  }
                  required
                />

              </Field>




              {/* PASSWORD */}
              <Field>

                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>


                <div
                  className="
                    relative
                  "
                >

                  <Input
                    id="password"
                    type={
                      showPassword
                      ? "text"
                      : "password"
                    }
                    value={password}
                    onChange={(e)=>
                      setPassword(e.target.value)
                    }
                    required
                  />


                  <button
                    type="button"
                    onClick={()=>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      hover:text-foreground
                      transition-colors
                    "
                  >

                    {
                      showPassword
                      ?
                      <EyeOff size={18}/>
                      :
                      <Eye size={18}/>
                    }

                  </button>


                </div>


              </Field>



              {/* BUTTON */}
              <Field>

                <Button
                  type="submit"
                  disabled={isPending}
                >

                  {
                    isPending
                    ?
                    "Logging in..."
                    :
                    "Login"
                  }

                </Button>

              </Field>


            </FieldGroup>


          </form>




          {/* IMAGE */}
          <div
            className="
              relative
              hidden
              rounded-2xl
              bg-muted
              md:block
              overflow-hidden
            "
          >

            <Image
              src="/images/mark.png"
              alt="Image"
              fill
              className="
                object-contain
                transition-all
                dark:brightness-[0.35]
                dark:grayscale
              "
            />

          </div>


        </CardContent>

      </Card>



      {/* FOOTER */}
      <FieldDescription
        className="
          px-6
          text-center
          space-y-2
        "
      >

        By clicking continue, you agree to our{" "}

        <a
          href="#"
          className="
            underline
            underline-offset-4
            hover:text-foreground
          "
        >
          Terms of Service
        </a>

        {" "}and{" "}

        <a
          href="#"
          className="
            underline
            underline-offset-4
            hover:text-foreground
          "
        >
          Privacy Policy
        </a>

        .


        <span
          className="
            block
            mt-2
            text-xs
            text-muted-foreground
          "
        >
          Developed by Software Engineer Awol Abdulbaasit
        </span>


      </FieldDescription>


    </div>

  )
}