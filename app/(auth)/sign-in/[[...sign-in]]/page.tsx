import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 ">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-10">
          <h1 className="font-bold text-3xl text-[#2E2A47]">
            Welcome Back
          </h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create account to get back to your dashboard!
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="text-muted-foreground animate-spin"/>
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full hidden bg-blue-500 lg:flex items-center justify-center">
        <Image src="/logo.svg" width={100} height={100} alt="logo" />
      </div>
    </div>
  )
}