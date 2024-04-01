import EmailIcon from "@/public/svg/email"
import GithubIcon from "@/public/svg/github"
import LinkedInIcon from "@/public/svg/linkedin"
import Link from "next/link"
import { FC } from "react"

const Links: FC<{className?: string}> = ({className}) => {
  return (
    <div className={className}>
      <Link href="mailto:seharlan@gmail.com?subject=Job Opportunity" target="_blank">
        <EmailIcon colorClass="fill-none stroke-black" className="stroke-2" />
      </Link>
      <Link href="https://www.linkedin.com/in/scottharlan-pnw" target="_blank">
        <LinkedInIcon colorClass="fill-black stroke-none"/>
      </Link>
      <Link href="https://github.com/SeHarlan" target="_blank">
        <GithubIcon colorClass="fill-none stroke-black" className="stroke-2" />
      </Link>
    </div>
  )
}

export default Links