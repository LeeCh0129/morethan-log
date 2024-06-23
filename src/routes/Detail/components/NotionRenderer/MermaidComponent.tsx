import React from "react"
import useMermaidEffect from "../../hooks/useMermaidEffect"

const MermaidComponent = () => {
  useMermaidEffect()

  return (
    <div>
      <pre className="language-mermaid">
        {`
        graph TD;
          A-->B;
          A-->C;
          B-->D;
          C-->D;
        `}
      </pre>
    </div>
  )
}

export default MermaidComponent
