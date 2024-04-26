import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, Space } from 'antd'
import Relation = SyncCookie.Relation


const App: React.FC<{
  relations: Relation[],
  setRelations: (nr: Relation[]) => void
}> = ({
        relations,
        setRelations
      }) => {
  const onFinish: FormProps<Relation>['onFinish'] = (values) => {
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
      label="本地"
      name="local"
      style={{ width: '30%' }}
      rules={[{ required: true, message: '请输入本地域名' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<Relation>
      label="远端"
      name="remote"
      style={{ width: '30%' }}
      rules={[{ required: true, message: '请输入远端域名' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Space>
        <Button type="primary" htmlType="submit">
          添加
        </Button>
        <Button type="primary" onClick={
          () => console.log(relations)
        }>
          log
        </Button>
      </Space>
    </Form.Item>
  </Form>
}

export default App
