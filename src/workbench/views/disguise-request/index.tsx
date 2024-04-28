import { Button, Divider, Form, Input, Typography } from 'antd'
import { EVENT_DISGUISE_REQUEST } from '@/constants.ts'

const App = () => {
  return <>
    <Typography.Title mark>
      'webRequestBlocking' requires manifest version of 2 or lower
    </Typography.Title>

    <Typography.Text>
      manifest v3 不支持 webRequestBlocking 了，所以不能直接拦截请求，要用
      <Typography.Text strong> declarativeNetRequestWithHostAccess </Typography.Text>
      实现
    </Typography.Text>

    <Divider />

    <div>
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
        查看当前规则
      </Button>
    </div>

    <Divider />

    <Form
      name="testMatchRules"
      layout={'inline'}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={
        async ({ url, initiator }) => {
          console.log({
            url,
            initiator
          })
          // @ts-ignore
          const data = await chrome.declarativeNetRequest.testMatchOutcome({
            url,
            initiator,
            type: 'xmlhttprequest' as const
          })
          console.log(data)
        }
      }
      autoComplete="off"
    >
      <Form.Item
        label="url"
        name="url"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="initiator"
        name="initiator"
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          test
        </Button>
      </Form.Item>
    </Form>
  </>
}

export default App
