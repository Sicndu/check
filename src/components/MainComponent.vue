<template>
  <div class="main">
    <ButtonGroup
      :num="num"
      :allowSelect="allowSelect"
      :buttonType="buttonType"
      :showMode="showMode"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
      @handleClose="handleClose"
      @toggleButtonType="toggleButtonType"
      @updateAllowSelect="allowSelect = true"
    />

    <TableComponent
      v-if="showMode === 'table'"
      :rowSelection="allowSelect ? rowSelection : null"
      :columns="columns"
      :data="data"
      @handleView="handleView"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleNotActive="handleNotActive"
    />

    <Card
      v-else
      :data="data"
      @handleView="handleView"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleNotActive="handleNotActive"
    />
  </div>
  <DataAdd ref="addRef" :data="data"></DataAdd>
</template>

<script setup lang="ts">
import { DataType } from './type'
import { computed, ref } from 'vue'
import DataAdd from './DataAdd.vue'
import Card from './CardComponent.vue'
import ButtonGroup from './ButtonGroup.vue'
import TableComponent from './TableComponent.vue'
import { columns, testData } from './table.ts'
import { message } from 'ant-design-vue'

const data = ref<DataType[]>([
  {
    key: '1',
    name: 'John Brown',
    createTime: 32,
    status: {
      text: '在线',
      value: 'online'
    },
    describe: '你好'
  },
  {
    key: '2',
    name: 'John Brown',
    createTime: 32,
    status: {
      text: '禁用',
      value: 'notActive'
    },
    describe: '你好'
  },
  {
    key: '3',
    name: 'Jim Green新建啊不能新建啊不能新建啊不能',
    createTime: 42,
    status: {
      text: '离线',
      value: 'offline'
    },
    describe: '你好新建啊不能新建啊不能新建啊不能新建啊不能新建啊不能'
  }
])

for (let i = 4; i < 20; i++) {
  data.value.push({
    key: `ID_${i}`,
    name: `Edward King ${i}`,
    createTime: Date.now() + 1,
    status: testData[Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1))],
    describe: '新建啊不能新建啊不能新建啊不能新建啊不能新建啊不能'
  })
}

const num = computed(() => selectedRowKeys.value.length)
const addRef = ref()
const buttonType = ref<string>('primary')
const allowSelect = ref(false)
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
</script>

<style scoped>
.main {
  width: 80%;
  height: 100%;
  margin: 0 auto;
}
</style>
