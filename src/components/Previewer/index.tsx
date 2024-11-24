import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { PlaygroundContext } from "@/PlaygroundContext"
import CompilerWorker from "./compiler.worker?worker"
import iframeRaw from './iframe.html?raw'
import { Message } from "../Message"

interface MessageData {
  data: {
    type: string
    message: string
  }
}

export default function Previewer() {
  const { files } = useContext(PlaygroundContext)
  const [compiledCode, setCompiledCode] = useState('')
  const cw = useRef<Worker>()

  useEffect(() => {
    if (!cw.current) {
      cw.current = new CompilerWorker()
      cw.current.addEventListener('message', ({ data }) => {
        if (data.type === 'COMPILED_CODE') {
          setCompiledCode(data.data)
        } else if (data.type === 'ERROR') {
          console.error(data.data)
        }
      })
    }
  }, [])

  useEffect(() => {
    cw.current?.postMessage(files)
  }, [files])

  const getIframeUrl = useCallback(() => {
    const res = iframeRaw.replace(
      '<script type="importmap"></script>',
      `<script type="importmap">${files[0].value}</script>`
    ).replace(
      '<script type="module" id="appSrc"></script>',
      `<script type="module" id="appSrc">${compiledCode}</script>`
    )
    return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
  }, [files, compiledCode])

  const [iframeUrl, setIframeUrl] = useState(getIframeUrl())

  useEffect(() => {
    setIframeUrl(getIframeUrl())
    setError('')
  }, [getIframeUrl])

  const [error, setError] = useState('')
  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data
    if (type === 'ERROR') {
      setError(message)
    }
  }
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className="h-full">
      <iframe
        className="w-full h-full"
        src={iframeUrl}
      />
      {error && <Message type="error" content={error} />}
    </div>
  )
}
