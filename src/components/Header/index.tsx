import { PropsWithChildren, useContext } from "react";
import { AntDesignDownloadOutlined, AntDesignGithubOutlined, AntDesignMoonOutlined, AntDesignReloadOutlined, AntDesignShareAltOutlined, AntDesignSunOutlined } from "../Icons";
import copy from "copy-to-clipboard";
import { downloadFiles } from "@/utils";
import { PlaygroundContext } from "@/PlaygroundContext";

function IconBtn(props: PropsWithChildren<{ onClick: () => void, title?: string }>) {
  const { title, onClick, children } = props
  return <button className="ml-4 hover:text-black dark:hover:text-white" onClick={onClick} title={title}>{children}</button>
}

interface Props {
  isDark: boolean
  onToggleColorMode: () => void
}

export default function Header(props: Props) {
  const { isDark, onToggleColorMode } = props
  const { files } = useContext(PlaygroundContext)

  return (
    <div className="py-3 px-5 border-b dark:border-b-gray-700 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/react.svg" alt="react logo" />
        <span className="ml-3 font-bold">React Playground</span>
      </div>

      <div className="text-xl text-gray-500 flex items-center">
        <IconBtn title={`Switch to ${isDark ? 'light' : 'dark'} theme`} onClick={onToggleColorMode}>
          {isDark ? <AntDesignMoonOutlined /> : <AntDesignSunOutlined />}
        </IconBtn>
        <IconBtn title="Copy sharable URL" onClick={() => {
          copy(window.location.href)
          alert('Sharable URL has been copied to clipboard.')
        }}>
          <AntDesignShareAltOutlined />
        </IconBtn>
        <IconBtn title="Reload page" onClick={() => { }}>
          <AntDesignReloadOutlined />
        </IconBtn>
        <IconBtn title="Download project files" onClick={async () => {
          if (confirm('Download project files?')) {
            await downloadFiles(files)
          }
        }}>
          <AntDesignDownloadOutlined />
        </IconBtn>
        <IconBtn title="View on GitHub" onClick={() => { }}>
          <AntDesignGithubOutlined />
        </IconBtn>
      </div>
    </div>
  )
}
