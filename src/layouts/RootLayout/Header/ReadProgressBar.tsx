import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"

const ProgressBar = styled.div<{ width: number }>`
  position: fixed;
  top: 60px;
  left: 0;
  height: 4px;
  width: ${({ width }) => width}%;
  // #885a1c #ff6347 #fec021
  background-color: #fec021;
  z-index: ${zIndexes.header};
  transition: width 0.2s ease-out; /* 트랜지션 추가 */
`

const ReadProgressBar: React.FC = () => {
  const [scrollWidth, setScrollWidth] = useState(0)

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const scrollWidth = (scrollTop / scrollHeight) * 100
    setScrollWidth(scrollWidth)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return <ProgressBar width={scrollWidth} />
}

export default ReadProgressBar
