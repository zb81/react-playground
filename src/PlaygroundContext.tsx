import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { compress, fileName2Language, uncompress } from "./utils"
import { initFiles } from "./files"

export interface File {
  name: string
  value: string
  language: string
}

export type Files = File[]

export interface PlaygroundContext {
  files: Files
  selectedFileIdx: number
  setSelectedFileIdx: (idx: number) => void
  setFiles: (files: Files) => void
  addFile: (fileName: string) => void
  removeFile: (idx: number) => void
  updateFileName: (oldFieldName: string, newFieldName: string) => void
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileIdx: 0,
} as PlaygroundContext)

function getFilesUrl() {
  let files: Files | undefined
  try {
    const hash = uncompress(window.location.hash.slice(1))
    files = JSON.parse(hash)
  } catch (error) {
    console.error(error)
  }
  return files
}

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props
  const [files, setFiles] = useState<Files>(getFilesUrl() || initFiles)
  const [selectedFileIdx, setSelectedFileIdx] = useState(2)

  const addFile = (name: string) => {
    setFiles([
      ...files,
      {
        name,
        language: fileName2Language(name),
        value: '',
      }
    ])
    setSelectedFileIdx(files.length)
  }

  const removeFile = (idx: number) => {
    if (idx === selectedFileIdx) {
      setSelectedFileIdx(idx - 1)
    }
    setFiles(files.filter((_, i) => i !== idx))
  }

  const updateFileName = (oldName: string, newName: string) => {
    const idx = files.findIndex((f) => f.name === oldName)
    if (idx === -1 || newName === undefined || newName === null) return
    const prevFile = files[idx]
    files[idx] = {
      ...prevFile,
      name: newName,
      language: fileName2Language(newName),
    }
    setFiles([...files])
  }

  useEffect(() => {
    const hash = compress(JSON.stringify(files))
    window.location.hash = hash
  }, [files])

  return (
    <PlaygroundContext.Provider
      value={{
        files,
        setFiles,
        selectedFileIdx,
        setSelectedFileIdx,
        addFile,
        updateFileName,
        removeFile,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}
