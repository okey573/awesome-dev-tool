import { Button, Space } from 'antd'
import { RUN_TIME_EVENT } from '@/enums.ts'
import { emitEvent } from '@/service-worker/runtime-message-center.ts'

const App = () => <Space>
  <Button
    onClick={
      () => {
        emitEvent(RUN_TIME_EVENT.GROUP_TABS)
      }
    }
  >
    group
  </Button>

  <Button
    onClick={
      () => {
        emitEvent(RUN_TIME_EVENT.UNGROUP_TABS)
      }
    }
  >
    ungroup
  </Button>
</Space>

export default App
