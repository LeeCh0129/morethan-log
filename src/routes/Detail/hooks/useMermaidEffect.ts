// import { useEffect } from "react"
// import mermaid from "mermaid"

// const useMermaidEffect = () => {
//   useEffect(() => {
//     mermaid.initialize({
//       startOnLoad: true,
//     })
//     if (!document) return
//     const elements: HTMLCollectionOf<Element> =
//       document.getElementsByClassName("language-mermaid")
//     if (!elements) return

//     for (let i = 0; i < elements.length; i++) {
//       mermaid.render(
//         "mermaid" + i,
//         elements[i].textContent || "",
//         (svgCode: string) => {
//           elements[i].innerHTML = svgCode
//         }
//       )
//     }
//   }, [])

//   return
// }

// export default useMermaidEffect
import { useEffect } from "react"

const useMermaidEffect = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mermaid = require("mermaid")
      mermaid.initialize({
        startOnLoad: true,
      })

      const elements = document.getElementsByClassName("language-mermaid")
      if (elements.length === 0) return

      Array.from(elements).forEach((element, index) => {
        mermaid.render(
          "mermaid" + index,
          element.textContent || "",
          (svgCode: string) => {
            element.innerHTML = svgCode
          }
        )
      })
    }
  }, [])

  return null
}

export default useMermaidEffect
