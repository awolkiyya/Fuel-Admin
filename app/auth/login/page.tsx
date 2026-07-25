"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useTheme } from "next-themes"

import { Globe, Moon, Sun } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"


const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "om", label: "Afaan Oromoo" },
  { code: "am", label: "አማርኛ" },
]


export default function LoginPage() {

  const router = useRouter()

  const {
    theme,
    setTheme,
    resolvedTheme,
  } = useTheme()


  const [mounted,setMounted] = useState(false)


  const user = useSelector(
    (state:any)=>state.auth.user
  )


  useEffect(()=>{
    setMounted(true)
  },[])


  useEffect(()=>{
    if(user){
      router.replace("/dashboard")
    }
  },[user,router])


  if(!mounted){
    return null
  }


  return (

    <div
      className="
        flex
        min-h-svh
        flex-col
        bg-background
        text-foreground
        transition-colors
      "
    >

      {/* Top Bar */}
      <header
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          p-4
          md:px-10
          md:py-6
        "
      >

{/* Logo */}
<Link
  href="/"
  className="
    flex
    items-center
    gap-2
    cursor-pointer
  "
>
  <img
    src="/images/mark.png"
    alt="Logo"
    className="
      h-7
      w-7
      md:h-8
      md:w-8
    "
  />

  <span
    className="
      text-base
      font-semibold
      tracking-tight
      md:text-sm
    "
  >
    FuelConnect
  </span>
</Link>


        {/* Controls */}
        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* Language */}
          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button
                variant="ghost"
                size="icon"
              >
                <Globe className="h-4 w-4"/>
              </Button>

            </DropdownMenuTrigger>


            <DropdownMenuContent align="end">

              {
                LANGUAGES.map((lang)=>(
                  <DropdownMenuItem
                    key={lang.code}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))
              }

            </DropdownMenuContent>


          </DropdownMenu>



          {/* Theme */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(
                resolvedTheme === "dark"
                ? "light"
                : "dark"
              )
            }
          >

            {
              resolvedTheme === "dark"
              ?
              <Sun className="h-4 w-4"/>
              :
              <Moon className="h-4 w-4"/>
            }

          </Button>


        </div>

      </header>



      {/* Login Content */}
      <main
        className="
          flex
          flex-1
          items-center
          justify-center
          p-6
          md:p-10
        "
      >

        <div
          className="
            w-full
            max-w-sm
            md:max-w-4xl
          "
        >

          <LoginForm />

        </div>

      </main>


    </div>

  )
}