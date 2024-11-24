import classNames from "classnames"
import { useRef, useState } from "react"
import { AntDesignCloseOutlined } from "../Icons"

export interface FileNameItemProps {
  value: string
  active: boolean
  onClick: () => void
  onEditCompleted: (name: string) => void
  onRemove: () => void
  creating?: boolean
}

export default function FileNameItem(props: FileNameItemProps) {
  const {
    value,
    active = false,
    onClick,
    onEditCompleted,
    onRemove,
    creating,
  } = props

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const readonly = name === 'main.tsx' || name === 'import-map.json'

  const handleDoubleClick = () => {
    // 如果是 main.tsx 或者 import-map.json，不允许编辑名字
    if (readonly) return
    setEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    setEditing(false)
    onEditCompleted(name)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      setEditing(false)
      onEditCompleted(inputRef.current!.value)
    } else if (e.key === 'Escape') {
      setEditing(false)
      setName(value)
    }
  }

  const handleRemove: React.MouseEventHandler = (e) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      onRemove()
    }
  }

  const editingComputed = editing || (creating && active)

  return (
    <div
      className={classNames(
        'cursor-pointer inline-block text-sm font-mono relative px-1',
        active && 'text-primary border-b-primary border-b-[4px]',
        active && !readonly && 'cursor-text'
      )}
      onClick={onClick}
    >
      {editingComputed && <input
        className="px-[10px] z-10 bg-gray-200 pt-2 pb-[6px] inline-block bg-transparent outline-none min-w-1 absolute top-0 left-1 right-1 bottom-0"
        ref={inputRef}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={(e) => setName(e.currentTarget.value)}
        defaultValue={value}
      />
      }
      <span className="inline-block px-[10px] pt-2 pb-[6px] select-none relative" onDoubleClick={handleDoubleClick}>
        <span className={classNames({ 'mr-2': !readonly })}>{name}</span>
        {!editingComputed && !readonly && <span className="cursor-pointer absolute right-0 top-[13px] text-gray-500 hover:text-primary text-xs" onClick={handleRemove}><AntDesignCloseOutlined /></span>}
      </span>
    </div>
  )
}
