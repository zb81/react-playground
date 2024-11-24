import { useContext, useEffect, useState } from 'react'
import { PlaygroundContext } from '../../PlaygroundContext'
import FileNameItem from './FileNameItem'
import { AntDesignPlusOutlined } from '../Icons'

export default function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileIdx,
    setSelectedFileIdx,
  } = useContext(PlaygroundContext)

  const [tabs, setTabs] = useState([''])

  const [creating, setCreating] = useState(false)

  useEffect(() => {
    setTabs(files.map((f) => f.name))
  }, [files])

  const handleEditCompleted = (name: string, prevName: string) => {
    updateFileName(prevName, name)
    setCreating(false)
  }

  const addTab = () => {
    const newFilename = `Comp${Math.random().toString().slice(2, 6)}.tsx`
    addFile(newFilename)
    setCreating(true)
  }

  return (
    <div className='flex-shrink-0 h-[38px] overflow-x-auto overflow-y-hidden border-b dark:border-b-gray-700 flex items-center'>
      {tabs.map((item, index) => (
        <FileNameItem
          key={item + index}
          active={selectedFileIdx === index}
          value={item}
          creating={creating}
          onClick={() => setSelectedFileIdx(index)}
          onEditCompleted={(name) => handleEditCompleted(name, item)}
          onRemove={() => removeFile(index)}
        />
      ))}
      <button className='hover:text-primary text-xs ml-2' onClick={addTab}>
        <AntDesignPlusOutlined />
      </button>
    </div>
  )
}
