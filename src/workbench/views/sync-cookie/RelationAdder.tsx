import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, message, Space } from 'antd'
import Relation = SyncCookie.Relation
import { getDomain } from '@/util.ts'


const RelationAdder: React.FC<{
  relations: Relation[],
  setRelations: (nr: Relation[]) => void
}> = ({
        relations,
        setRelations
      }) => {
  const onFinish: FormProps<Relation>['onFinish'] = (values) => {
    const fromDomain = getDomain(values.from)
    const toDomain = getDomain(values.to)
    if (relations.some(item => getDomain(item.to) == toDomain && getDomain(item.from) == fromDomain)) {
      message.error(`当前列表中已存在[${fromDomain}]到[${toDomain}]的同步关系`)
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

export default RelationAdder
