import { Bold, Eraser, Italic, Underline } from 'lucide-react'
import styles from './EmailEditor.module.scss'
import { useState, useRef } from 'react'
import { TStyle, applyStyle } from './apply-style'
import parse from 'html-react-parser'

export function EmailEditor() {
  const [text, setText] = useState(`
  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
  Veritatis iure esse velit quibusdam eius. 
  Recusandae quidem exercitationem aspernatur. 
  Obcaecati aperiam necessitatibus dolores dolore numquam facere 
  incidunt officiis neque temporibus a.</p>`)

  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  const textRef = useRef<HTMLTextAreaElement | null>(null)

  const updateSelection = () => {
    if( !textRef.current) return
    setSelectionStart(textRef.current.selectionStart)
    setSelectionEnd(textRef.current.selectionEnd)
  }

  const applyFormat = (type: TStyle) => {
    const selectedText = text.substring(selectionStart, selectionEnd)

    if (!selectedText) return

    const before = text.substring(0, selectionStart)

    const after = text.substring(selectionEnd)

    setText(before + applyStyle(type, selectedText) + after);

  }

  return (
    <div>
      <h1>Email editor</h1>
      <div className={styles.preview}>{parse(text)}</div>
      <div className={styles.card}>
        <textarea 
          ref={textRef}
          className={styles.editor} 
          spellCheck='false'
          onSelect={updateSelection}
          value={text}
          onChange={e => setText(e.target.value)}/>
        <div className={styles.actions}>
        <div className={styles.tools}>
          <button onClick={() => setText('')}>
            <Eraser fontSize={17}/>
          </button>
          <button onClick={() => applyFormat('bold')}>
            <Bold fontSize={17}/>
          </button>
          <button onClick={() => applyFormat('italic')}>
            <Italic fontSize={17}/>
          </button>
          <button onClick={() => applyFormat('underline')}>
            <Underline fontSize={17}/>
          </button>
        </div>
        <button onClick={() => console.log("zxc3")}>Send now</button>
      </div>
      </div>
    </div>
  )
}
