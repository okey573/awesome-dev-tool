import { Button, Typography } from 'antd'
import { EVENT_DISGUISE_REQUEST } from '@/constants.ts'

const App = () => <>
  <Typography.Title mark>
    'webRequestBlocking' requires manifest version of 2 or lower
  </Typography.Title>

  <Typography.Text>
    manifest v3 不支持 webRequestBlocking 了，所以不能直接拦截请求，要用
    <Typography.Text strong> declarativeNetRequestWithHostAccess </Typography.Text>
    实现
  </Typography.Text>

  <Button onClick={
    async () => {
      chrome.runtime.sendMessage({
        event: EVENT_DISGUISE_REQUEST,
        data: []
      })

      const rules = await chrome.declarativeNetRequest.getDynamicRules()
      const rulesString = JSON.stringify(rules, null, 2)
      const newWindow = window.open()
      const preElement = newWindow!.document.createElement('pre')
      preElement.style.fontSize = '1rem'
      preElement.textContent = rulesString
      newWindow!.document.body.appendChild(preElement)
    }
  }>
    send
  </Button>
</>

export default App
