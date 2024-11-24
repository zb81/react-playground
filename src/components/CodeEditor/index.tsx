import { useContext } from "react";
import { debounce } from 'lodash-es'
import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "../../PlaygroundContext";

interface Props {
  isDark: boolean
}

export default function CodeEditor(props: Props) {
  const { isDark } = props

  const {
    files,
    setFiles,
    selectedFileIdx,
  } = useContext(PlaygroundContext)

  const file = files[selectedFileIdx]

  function onEditorChange(value?: string) {
    files[selectedFileIdx].value = value!
    setFiles([...files])
  }

  return (
    <div className="flex flex-col h-full">
      <FileNameList />
      <Editor isDark={isDark} file={file} onChange={debounce(onEditorChange)} />
    </div>
  )
}
