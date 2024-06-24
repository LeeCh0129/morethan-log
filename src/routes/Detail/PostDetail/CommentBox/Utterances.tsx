import { useEffect } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import useScheme from "src/hooks/useScheme"

type Props = {
  issueTerm: string
}

const Utterances: React.FC<Props> = ({ issueTerm }) => {
  const [scheme] = useScheme()
  const router = useRouter()

  useEffect(() => {
    const theme = `github-${scheme}`
    const script = document.createElement("script")
    const anchor = document.getElementById("comments")

    if (!anchor) {
      return
    }

    script.src = "https://utteranc.es/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("repo", "LeeCh0129/morethan-log-comments")
    script.setAttribute("issue-term", issueTerm)
    script.setAttribute("label", "comments")
    script.setAttribute("theme", theme)

    anchor.appendChild(script)

    return () => {
      if (anchor) {
        anchor.innerHTML = ""
      }
    }
  }, [scheme, router.pathname, issueTerm])

  return (
    <StyledWrapper>
      <div id="comments" className="utterances-frame"></div>
    </StyledWrapper>
  )
}

export default Utterances

const StyledWrapper = styled.div`
  @media (min-width: 768px) {
    margin-left: -4rem;
  }
`
