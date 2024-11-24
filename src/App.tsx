import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import Header from './components/Header/index.tsx'
import CodeEditor from './components/CodeEditor/index.tsx'
import Previewer from './components/Previewer/index.tsx'
import { PlaygroundProvider } from './PlaygroundContext.tsx'
import { useLocalStorageState } from 'ahooks'
import { ColorMode, useDark, useSystemDark } from './hooks/useDark.ts'
import { useCallback, useEffect } from 'react'

export default function App() {
  const [mode, setMode] = useLocalStorageState<ColorMode>('app_color_mode', {
    defaultValue: 'auto',
    serializer: v => v,
    deserializer: v => v as ColorMode
  })

  const isSystemDark = useSystemDark()
  const isDark = useDark(mode!)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleToggleColorMode = useCallback(() => {
    setMode(isSystemDark !== isDark ? 'auto' : isDark ? 'light' : 'dark')
  }, [isDark, isSystemDark, setMode])

  return (
    <PlaygroundProvider>
      <div className='h-screen flex flex-col'>
        <Header isDark={isDark} onToggleColorMode={handleToggleColorMode} />

        <Allotment defaultSizes={[100, 100]}>
          <Allotment.Pane minSize={500}>
            <CodeEditor isDark={isDark} />
          </Allotment.Pane>
          <Allotment.Pane minSize={0}>
            <Previewer />
          </Allotment.Pane>
        </Allotment>
      </div>
    </PlaygroundProvider>
  )
}
