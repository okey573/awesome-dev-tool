import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, message, Space } from 'antd'
import Relation = DisguiseRequest.Relation
import { getDomain } from '@/utils/index.ts'


const RelationAdder: React.FC<{
  relations: Relation[],
  setRelations: (nr: Relation[]) => void
}> = ({
        relations,
        setRelations
      }) => {
  const onFinish: FormProps<Relation>['onFinish'] = (values) => {
    const realHost = getDomain(values.real)
    const fakeHost = getDomain(values.fake)
    if (relations.some(item => getDomain(item.real) == realHost && getDomain(item.fake) == fakeHost)) {
      message.error(`当前列表中已存在[${realHost}]到[${fakeHost}]的同步关系`)
      return
    }
    // TODO 判断是否存在 A to B; B to C; C to A; 的情况，即允许不存在环，否则会导致监听 cookie 变化的函数陷入死循环
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
    name="disguiseRequestRelationAdder"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ width: '100%', justifyContent: 'center', margin: '20px 0' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
    layout={'inline'}
  >
    <Form.Item<Relation>
      label="真实的请求发起域"
      name="real"
      style={{ width: '30%' }}
      rules={[{ required: true, message: '请输入真实请求域名' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<Relation>
      label="伪装的请求发起域"
      name="fake"
      style={{ width: '30%' }}
      rules={[{ required: true, message: '请输入伪装域名' }]}
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

export default RelationAdder
