import NavBar from "./NavBar"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import ReadProgressBar from "./ReadProgressBar"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import useScheme from "src/hooks/useScheme"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const [scheme] = useScheme()

  return (
    <StyledWrapper scheme={scheme}>
      <div data-full-width={fullWidth} className="container">
        <Logo />
        <div className="nav">
          <ThemeToggle />
          <NavBar />
        </div>
      </div>
      <ReadProgressBar />
    </StyledWrapper>
  )
}

export default Header

const StyledWrapper = styled.div<{ scheme: string }>`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0;
  backdrop-filter: blur(3px); /* 블러 효과 px 낮을수록 투명하니 설정 ㄱ */
  background-color: ${({ scheme }) =>
    scheme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(24, 24, 24, 0.8)"};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  .container {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1120px;
    height: 4rem;
    margin: 0 auto;
    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  }
`
