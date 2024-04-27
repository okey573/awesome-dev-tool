import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, message, Space } from 'antd'
import Relation = SyncCookie.Relation
import { getHost } from '@/util.ts'


const App: React.FC<{
  relations: Relation[],
  setRelations: (nr: Relation[]) => void
}> = ({
        relations,
        setRelations
      }) => {
  const onFinish: FormProps<Relation>['onFinish'] = (values) => {
    const fromHost = getHost(values.from)
    const toHost = getHost(values.to)
    if (relations.some(item => getHost(item.to) == toHost && getHost(item.from) == fromHost)) {
      message.error(`当前列表中已存在[${fromHost}]到[${toHost}]的同步关系`)
      return
    }
    setRelations([
      ...relations,
      {
        ...values,
        open: true,
        key: Date.now().toString()
      } as Relation
    ])
  }
  return <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ width: '100%', justifyContent: 'center', margin: '20px 0' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
    layout={'inline'}
  >
    <Form.Item<Relation>
      label="来源域"
      name="from"
      style={{ width: '30%' }}
      rules={[{ required: true, message: '请输入来源域名' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<Relation>
      label="目标域"
      name="to"
      style={{ width: '30%' }}
      rules={[{ required: true, message: '请输入目标域名' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Space>
        <Button type="primary" htmlType="submit">
          添加
        </Button>
      </Space>
    </Form.Item>
  </Form>
}

export default App
