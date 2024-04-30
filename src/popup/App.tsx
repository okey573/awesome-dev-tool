import { Button, ConfigProvider, Flex, } from 'antd'
import { UngroupOutlined, DesktopOutlined, AlertOutlined } from '@ant-design/icons'
import { emitEvent } from '@/service-worker/runtime-message-center.ts'
import { RUN_TIME_EVENT } from '@/enums.ts'
import React from 'react'
import { ButtonType } from 'antd/es/button'

const MenuButton: React.FC<{
  children: React.ReactNode,
  icon: React.ReactNode,
  onClick: () => void,
  type?: ButtonType
}> = ({ children, icon, onClick, type = 'text' }) => {
  return <Button
    block
    type={type}
    style={{ borderRadius: '0' }}
    icon={icon}
    onClick={onClick}
  >
    {children}
  </Button>
}

function App() {
  const changeGroupedTabs = () => emitEvent(RUN_TIME_EVENT.CHANGE_GROUP_TABS)
  const openWorkbench = () => emitEvent(RUN_TIME_EVENT.OPEN_WORKBENCH)

  return <ConfigProvider theme={{ token: { colorPrimary: 'rgb(94, 92, 230)' } }}>
    <Flex vertical gap="small" style={{ width: '200px' }}>
      <MenuButton icon={<AlertOutlined />} onClick={() => void 0}>还没想好做什么</MenuButton>
      <MenuButton icon={<UngroupOutlined />} onClick={changeGroupedTabs}>分组（取消）标签页</MenuButton>
      <MenuButton type="primary" icon={<DesktopOutlined />} onClick={openWorkbench}>打开工作台</MenuButton>
    </Flex>
  </ConfigProvider>
}

export default App
