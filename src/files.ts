import { Files } from './PlaygroundContext'
import importMap from './templates/import-map.json?raw'
import AppCss from './templates/App.css?raw'
import App from './templates/App.tsx?raw'
import main from './templates/main.tsx?raw'
import { fileName2Language } from './utils'

export const initFiles: Files = [
  {
    name: 'import-map.json',
    language: fileName2Language('import-map.json'),
    value: importMap,
  },
  {
    name: 'main.tsx',
    language: fileName2Language('main.tsx'),
    value: main,
  },
  {
    name: 'App.tsx',
    language: fileName2Language('App.tsx'),
    value: App,
  },
  {
    name: 'App.css',
    language: 'css',
    value: AppCss,
  },
]

