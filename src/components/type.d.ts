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

export interface SearchComponentData {
  searchValue: string
  searchSelect: 'id' | 'name' | 'describe' | 'status'
  searchType: 'include' | 'exclude' | 'online' | 'offline' | 'notActive'
}
