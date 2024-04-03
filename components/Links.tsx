import EmailIcon from "@/public/svg/email"
import GithubIcon from "@/public/svg/github"
import LinkedInIcon from "@/public/svg/linkedin"
import TwitterIcon from "@/public/svg/twitter"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

const Links: FC<{className?: string}> = ({className}) => {
  return (
    <div className={className}>
      <Link href="https://twitter.com/EV3_art" target="_blank">
        <TwitterIcon colorClass="fill-black" />
      </Link>
      <Link href="https://collector.sh/EV3" target="_blank">
        <Image src="/images/collector-logo.png" width={18} height={18} alt="collector" className="flex-shrink-0"/>
        
      </Link>
    </div>
  )
}

export default Links