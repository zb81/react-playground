import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react'
import { createATA } from './ata'
import { ComponentProps } from 'react'
import { debounce } from 'lodash-es'

export interface EditorFile {
  name: string
  value: string
  language: string
}

interface Props {
  isDark: boolean
  file: EditorFile
  onChange?: EditorProps['onChange']
  options?: ComponentProps<typeof MonacoEditor>['options']
}

export default function Editor(props: Props) {
  const { isDark, file, onChange, options } = props

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    })

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
    })

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue())
    })

    ata(editor.getValue())
  }

  return (
    <div className='flex-grow'>
      <MonacoEditor
        height={'100%'}
        path={file.name}
        language={file.language}
        onMount={handleEditorMount}
        value={file.value}
        onChange={onChange && debounce(onChange, 500)}
        theme={isDark ? 'vs-dark' : 'vs'}
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          ...options,
        }}
      />
    </div>
  )
}
