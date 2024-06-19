export interface DataType {
  key: string
  name: string
  createTime: number
  status: {
    text: string
    value: 'online' | 'offline' | 'notActive'
  }
  describe: string
}
