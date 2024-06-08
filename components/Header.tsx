import HeaderLogo from "@/components/HeaderLogo"
import Navigation from "@/components/Navigation"
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import WelcomeMessage from "./WelcomeMessage"

const Header = () =>  {
  return (
    <header className="bg-gradient-to-b from-blue-800 to-blue-500 px-4 lg:px-14 py-8 pb-36" >
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/"/>
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <WelcomeMessage />
      </div>
    </header>
  )
}

export default Header
