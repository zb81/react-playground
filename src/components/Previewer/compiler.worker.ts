import { transform } from '@babel/standalone'
import { PluginObj } from '@babel/core'
import { Files, File } from '@/PlaygroundContext'

export const beforeTransform = (filename: string, code: string) => {
  let _code = code
  const regexReact = /import\s+React/g
  if ((filename.endsWith('.jsx') || filename.endsWith('.tsx')) && !regexReact.test(code)) {
    _code = `import React from 'react';\n${code}`
  }
  return _code
}

export function babelTransform(filename: string, code: string, files: Files) {
  const _code = beforeTransform(filename, code)
  let result = ''
  try {
    result = transform(_code, {
      presets: ['react', 'typescript'],
      filename,
      plugins: [customResolver(files)],
      retainLines: true
    }).code!
  } catch (e) {
    console.error('编译出错', e);
  }
  return result
}

export function compile(files: Files) {
  const main = files[1]
  return babelTransform('main.tsx', main.value, files)
}

const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split('./').pop() || ''
  if (!moduleName.includes('.')) {
    const realModuleName = files.map(f => f.name).filter(k => {
      return k.endsWith('.ts')
        || k.endsWith('.tsx')
        || k.endsWith('.js')
        || k.endsWith('.jsx')
    }).find(k => k.split('.').includes(moduleName))
    if (realModuleName) {
      moduleName = realModuleName
    }
  }
  return files.find(f => f.name === moduleName)
}

const json2Js = (file: File) => {
  const js = `export default ${file.value}`
  return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

const css2Js = (file: File) => {
  const randomId = Math.random().toString(36).slice(2)
  const js = `
(() => {
  const stylesheet = document.createElement('style')
  stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
  document.head.appendChild(stylesheet)
  const styles = document.createTextNode(\`${file.value}\`)
  stylesheet.appendChild(styles)
})()
  `
  return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

function customResolver(files: Files): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value
        if (modulePath.startsWith('.')) {
          const file = getModuleFile(files, modulePath)
          if (!file) return
          if (file.name.endsWith('.css')) {
            path.node.source.value = css2Js(file)
          } else if (file.name.endsWith('.json')) {
            path.node.source.value = json2Js(file)
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob(
                [babelTransform(file.name, file.value, files)],
                { type: 'application/javascript' }
              )
            )
          }
        }
      }
    }
  }
}

self.addEventListener('message', async ({ data }) => {
  try {
    self.postMessage({
      type: 'COMPILED_CODE',
      data: compile(data),
    })
  } catch (e) {
    self.postMessage({ type: 'ERROR', error: e })
  }
})
