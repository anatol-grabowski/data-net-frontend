// https://medium.com/@MatDrinksTea/rendering-markdown-and-latex-in-react-dec355e74119
import React from 'react'
import ReactMarkdown from 'react-markdown'
import MathJax from 'react-mathjax'
import RemarkMathPlugin from 'remark-math'
import styles from './ReactMarkdownMathjax.module.scss'

function ReactMarkdownMathjax(props) {
    const newProps = {
        ...props,
        plugins: [
          RemarkMathPlugin,
        ],
        renderers: {
          ...props.renderers,
          math: (props) =>
            <MathJax.Node
              formula={props.value}
              className={styles.Math}
            />,
          inlineMath: (props) =>
            <MathJax.Node
              inline
              formula={props.value}
            />,
        }
      }
      return (
        <MathJax.Provider input="tex">
            <ReactMarkdown {...newProps} />
        </MathJax.Provider>
      )
}

export default ReactMarkdownMathjax
