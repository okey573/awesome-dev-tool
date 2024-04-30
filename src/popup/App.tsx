import { Button, ConfigProvider, Flex, } from 'antd'
import { UngroupOutlined, DesktopOutlined } from '@ant-design/icons'
import { emitEvent } from '@/service-worker/runtime-message-center.ts'
import { RUN_TIME_EVENT } from '@/enums.ts'

function App() {
  const changeGroupedTabs = () => emitEvent(RUN_TIME_EVENT.CHANGE_GROUP_TABS)
  const openWorkbench = () => emitEvent(RUN_TIME_EVENT.OPEN_WORKBENCH)

  return <ConfigProvider theme={{ token: { colorPrimary: 'rgb(94, 92, 230)' } }}>
    <Flex vertical gap="small" style={{ width: '200px' }}>

      <Button block
              type="text"
              style={{ borderRadius: '0' }}
              icon={<UngroupOutlined />}
              onClick={changeGroupedTabs}>
        分组（取消）标签页
      </Button>

      <Button block
              type="primary"
              style={{ borderRadius: '0' }}
              icon={<DesktopOutlined />}
              onClick={openWorkbench}>
        打开工作台
      </Button>
    </Flex>
  </ConfigProvider>
}

export default App
