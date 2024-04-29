import React from 'react'
import { Button, Form, Input, Space } from 'antd'


const RulesTester: React.FC = () => {

  const onFinish = async ({ url, initiator }: {url: string, initiator: string}) => {
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

  const showCurrent = async () => {
    const rules = await chrome.declarativeNetRequest.getDynamicRules()
    const rulesString = JSON.stringify(rules, null, 2)
    const newWindow = window.open()
    const preElement = newWindow!.document.createElement('pre')
    preElement.style.fontSize = '1rem'
    preElement.textContent = rulesString
    newWindow!.document.body.appendChild(preElement)
  }

  return <Form
    name="rulesTester"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ width: '100%', justifyContent: 'center', margin: '20px 0' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
    layout={'inline'}
  >
    <Form.Item
      label="url"
      name="url"
      style={{ width: '30%' }}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="initiator"
      name="initiator"
      style={{ width: '30%' }}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Space>
        <Button type="primary" htmlType="submit">校验</Button>
        <Button onClick={showCurrent}>查看当前规则</Button>
      </Space>
    </Form.Item>
  </Form>
}

export default RulesTester
