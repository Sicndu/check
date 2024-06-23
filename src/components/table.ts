import { TableColumnType } from 'ant-design-vue'
import { DataType } from './type'

export const columns: TableColumnType<DataType>[] = [
  {
    title: 'ID',
    dataIndex: 'key',
    key: 'key',
    width: 100,
    ellipsis: true
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 250
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    ellipsis: true
  },
  {
    title: '说明',
    dataIndex: 'describe',
    key: 'describe',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 200
  }
]

export const testData = [
  {
    text: '在线',
    value: 'online'
  },
  {
    text: '离线',
    value: 'offline'
  },
  {
    text: '禁用',
    value: 'notActive'
  }
] as Array<{ text: string; value: 'online' | 'offline' | 'notActive' }>

export const searchSelect = [
  {
    text: 'ID',
    value: 'id'
  },
  {
    text: '设备名称',
    value: 'name'
  },
  {
    text: '状态',
    value: 'status'
  },
  {
    text: '说明',
    value: 'describe'
  }
]
