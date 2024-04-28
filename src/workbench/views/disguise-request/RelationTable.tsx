import React, { useState } from 'react'
import type { TableProps } from 'antd'
import { Form, Input, message, Space, Switch, Table, Typography } from 'antd'
import Relation = DisguiseRequest.Relation
import { getDomain } from '@/util.ts'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Relation;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                     editing,
                                                     dataIndex,
                                                     title,
                                                     record,
                                                     index,
                                                     children,
                                                     ...restProps
                                                   }) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const RelationTable: React.FC<{
  relations: Relation[],
  setRelations: (nr: Relation[]) => void
}> = ({
        relations,
        setRelations
      }) => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record: Relation) => record.key === editingKey

  const edit = (record: Partial<Relation> & {key: React.Key}) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record })
    setEditingKey(record.key)
  }
  const deleteRecord = (record: Partial<Relation> & {key: React.Key}) => {
    setRelations(relations.filter(i => i.key !== record.key))
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Relation
      const realHost = getDomain(row.real)
      const fakeHost = getDomain(row.fake)
      if (relations.some(item => getDomain(item.real) == realHost && getDomain(item.fake) == fakeHost)) {
        message.error(`当前列表中已存在[${realHost}]到[${fakeHost}]的同步关系`)
        return
      }
      // TODO 判断是否存在 A to B; B to C; C to A; 的情况，即允许不存在环，否则会导致监听 cookie 变化的函数陷入死循环
      const newData = [...relations]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setRelations(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setRelations(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: '真实域',
      dataIndex: 'real',
      editable: true,
      width: '35%',
      align: 'center' as const
    },
    {
      title: '伪装域',
      dataIndex: 'fake',
      editable: true,
      width: '35%',
      align: 'center' as const
    },
    {
      title: '开关',
      dataIndex: 'open',
      width: '15%',
      align: 'center' as const,
      render: (_: any, record: Relation) => {
        const onChange = (checked: boolean) => {
          setRelations(relations.map(r => {
            if (r.key === record.key) {
              return { ...r, open: checked }
            } else {
              return r
            }
          }))
        }
        return <Switch checked={record.open} onChange={onChange} />
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      align: 'center' as const,
      render: (_: any, record: Relation) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Typography.Link onClick={() => save(record.key)}>
              保存
            </Typography.Link>
            <Typography.Link onClick={cancel}>
              取消
            </Typography.Link>
          </Space>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} type="warning" onClick={() => edit(record)}>
              编辑
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ''} type={'danger'} onClick={() => deleteRecord(record)}>
              删除
            </Typography.Link>
          </Space>
        )
      },
    },
  ]

  const mergedColumns: TableProps<Relation>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: Relation) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        size="small"
        bordered
        dataSource={relations}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  )
}

export default RelationTable
