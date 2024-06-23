<template>
  <div class="main">
    <SearchComponent
      :data="data"
      :searchRecord="searchRecord"
      @searchRecord="handleSearchRecord"
      @search="handleSearch"
      @delete="handleSearchDelete"
    />
    <ButtonGroup
      :num="num"
      :allowSelect="allowSelect"
      :buttonType="buttonType"
      :showMode="showMode"
      :sortType="sortType"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
      @handleClose="handleClose"
      @toggleButtonType="toggleButtonType"
      @updateAllowSelect="allowSelect = true"
      @handleSortChange="handleSortChange"
    />

    <TableComponent
      v-if="showMode === 'table'"
      :rowSelection="allowSelect ? rowSelection : null"
      :columns="columns"
      :data="pageData"
      @handleView="handleView"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleNotActive="handleNotActive"
    />

    <Card
      v-else
      :data="pageData"
      @handleView="handleView"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleNotActive="handleNotActive"
    />

    <PageComponent :data="isSearch ? searchData : data" @change="handlePageChange"></PageComponent>
  </div>
  <DataAdd ref="addRef" :data="data" @success="handleAddSuccess"></DataAdd>
</template>

<script setup lang="ts">
import { DataType, SearchComponentData } from './type'
import { computed, onMounted, ref, watch } from 'vue'
import DataAdd from './DataAdd.vue'
import Card from './CardComponent.vue'
import ButtonGroup from './ButtonGroup.vue'
import TableComponent from './TableComponent.vue'
import { columns, testData } from './table.ts'
import { message } from 'ant-design-vue'
import SearchComponent from './SearchComponent.vue'
import PageComponent from './PageComponent.vue'

const data = ref<DataType[]>([
  // {
  //   key: `ID_0`,
  //   name: `Edward King skjkajslajsalsjaljsasasasa`,
  //   createTime: Date.now() + 1,
  //   status: testData[Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1))],
  //   describe:
  //     '新建啊不能新建啊不能新建啊不能新建啊不能ksjklajslkajslkajslkaksjaklsjalksjlk新建啊不能'
  // }
])
const searchData = ref<DataType[]>([])
const isSearch = ref(false)
const pageData = ref<DataType[]>([])

const num = computed(() => selectedRowKeys.value.length)
const addRef = ref()
const buttonType = ref<string>('primary')
const allowSelect = ref(false)
const sortType = ref<'ascend' | 'descend'>('descend')
const searchRecord = ref<SearchComponentData[]>([
  {
    searchValue: '1',
    searchSelect: 'id',
    searchType: 'include'
  }
])
const showMode = computed(() => {
  if (buttonType.value === 'primary') {
    return 'table'
  } else {
    selectedRowKeys.value = []
    return 'card'
  }
})
const selectedRowKeys = ref<DataType['key'][]>([])
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange
}))

const handleSearchRecord = (data: SearchComponentData) => {
  searchRecord.value.push(data)
}

const handleSearchDelete = (index: number) => {
  searchRecord.value.splice(index, 1)
}

const handleSearch = (dataItem: SearchComponentData) => {
  if (dataItem.searchValue.length === 0 && dataItem.searchSelect !== 'status') {
    isSearch.value = false
    searchData.value = []
    return
  }
  isSearch.value = true
  let newData: DataType[] = []
  switch (dataItem.searchSelect) {
    case 'id':
      newData = data.value.filter((item) => item.key.includes(dataItem.searchValue))
      break
    case 'name':
      newData = data.value.filter((item) => item.name.includes(dataItem.searchValue))
      break
    case 'describe':
      newData = data.value.filter((item) => item.describe.includes(dataItem.searchValue))
      break
    case 'status':
      newData = data.value.filter((item) => item.status.value === dataItem.searchValue)
      break
    default:
      newData = []
      break
  }

  if (dataItem.searchType === 'exclude') {
    searchData.value = data.value.filter((item) => !newData.includes(item))
  } else {
    searchData.value = newData
  }
}

const onSelectChange = (changAbleRowKeys: string[]) => {
  selectedRowKeys.value = changAbleRowKeys
}

const handleClose = (tag: boolean) => {
  selectedRowKeys.value = []
  allowSelect.value = tag
}

const handleAdd = () => {
  addRef.value.openModal('add')
}

const handleAddSuccess = (newData: DataType) => {
  data.value.push(newData)
  handleSort()
}

const handleView = (key: string) => {
  addRef.value.openModal('view', key)
}

const handleEdit = (key: string) => {
  addRef.value.openModal('edit', key)
}

const handleNotActive = (key: string) => {
  data.value = data.value.map((item) => {
    if (item.key === key) {
      const newStatus = item.status.value === 'notActive' ? 'online' : 'notActive'
      message.success('操作成功')
      return {
        ...item,
        status: {
          text: newStatus === 'online' ? '在线' : '禁用',
          value: newStatus
        }
      }
    }
    return item
  })
}

const handleDelete = (key: string) => {
  data.value = data.value.filter((item) => item.key !== key)
  selectedRowKeys.value = selectedRowKeys.value.filter((item) => item !== key)
  message.success('删除成功')
}

const handleBatchDelete = () => {
  data.value = data.value.filter((item) => !selectedRowKeys.value.includes(item.key))
  selectedRowKeys.value = []
  allowSelect.value = false
  message.success('删除成功')
}

const toggleButtonType = () => {
  buttonType.value = buttonType.value === 'primary' ? 'default' : 'primary'
  if (buttonType.value === 'default') {
    allowSelect.value = false
  }
}

const handleSort = () => {
  if (sortType.value === 'ascend') {
    data.value = data.value.sort((a, b) => b.createTime - a.createTime)
  } else {
    data.value = data.value.sort((a, b) => a.createTime - b.createTime)
  }
}

const handleSortChange = (value?: 'ascend' | 'descend') => {
  if (value) {
    sortType.value = value
  } else {
    sortType.value = sortType.value === 'ascend' ? 'descend' : 'ascend'
  }
  handleSort()
}

const handlePageChange = (pageItem: any) => {
  if (isSearch.value) {
    pageData.value = searchData.value.slice(
      (pageItem.current - 1) * pageItem.pageSize,
      pageItem.current * pageItem.pageSize
    )
  } else {
    pageData.value = data.value.slice(
      (pageItem.current - 1) * pageItem.pageSize,
      pageItem.current * pageItem.pageSize
    )
  }
}

const createData = () => {
  const newData: DataType[] = []
  for (let i = 1; i < 20; i++) {
    newData.push({
      key: `ID_${i}`,
      name: `Edward King ${i}`,
      createTime: Date.now() / 2 + i * 1000,
      status: testData[Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1))],
      describe: '新建啊不能新建啊不能新建啊不能新建啊不能新建啊不能'
    })
  }
  return newData
}

watch(
  data,
  () => {
    localStorage.setItem('data', JSON.stringify(data.value))
    localStorage.setItem('sortType', sortType.value)
  },
  { deep: true }
)

watch(
  searchRecord,
  () => {
    localStorage.setItem('searchRecord', JSON.stringify(searchRecord.value))
  },
  { deep: true }
)

// 在组件挂载时从 localStorage 读取数据
onMounted(() => {
  const localData = localStorage.getItem('data')
  const localSortType = localStorage.getItem('sortType') as 'ascend' | 'descend'
  const localSearchRecord = localStorage.getItem('searchRecord')
  if (localData) {
    data.value = JSON.parse(localData)
  } else {
    data.value = createData() // 如果没有数据，则创建初始数据
  }

  if (localSortType) {
    sortType.value = localSortType
  }

  if (localSearchRecord) {
    searchRecord.value = JSON.parse(localSearchRecord)
  }
})
</script>

<style scoped>
.main {
  width: 80%;
  margin: 0 auto;
}
</style>
