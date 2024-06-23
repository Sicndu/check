<template>
  <div class="search-main">
    <a-space>
      <span>搜索方式：</span>
      <a-select
        v-model:value="searchData.searchSelect"
        style="width: 100px"
        @change="handleSelectChange"
      >
        <a-select-option :value="item.value" v-for="item in searchSelect" :key="item.value">
          {{ item.text }}
        </a-select-option>
      </a-select>

      <div v-if="searchData.searchSelect === 'status'">
        <a-select v-model:value="searchData.searchType" style="width: 100px" @change="onSearch">
          <a-select-option :value="item.value" v-for="item in testData" :key="item.value">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </div>
      <div v-else>
        <a-select v-model:value="searchData.searchType" style="width: 100px">
          <a-select-option value="include">包含</a-select-option>
          <a-select-option value="exclude">不包含</a-select-option>
        </a-select>
      </div>
      <a-input
        v-model:value="searchData.searchValue"
        placeholder="请输入搜索内容"
        style="width: 200px"
        v-if="searchData.searchSelect !== 'status'"
        @change="onSearch"
      />
    </a-space>
    <a-space>
      <a-button
        @click="handleClear"
        :disabled="!searchData.searchValue && searchData.searchSelect !== 'status'"
      >
        重置
      </a-button>
      <a-button @click="handleSave">保存</a-button>
      <a-dropdown>
        <template #overlay>
          <a-menu v-if="searchRecord.length > 0">
            <a-menu-item v-for="(item, index) in searchRecord" :key="index">
              <template #icon>
                <div class="search-record-item">
                  <span
                    class="ellipsis-text"
                    @click="handleMenuClick(item)"
                    :title="searchText(item)"
                  >
                    {{ searchText(item) }}
                  </span>
                  <CloseOutlined @click="handleDelete(index)" />
                </div>
              </template>
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary" @click="onSearch">
          <a-space>
            <span>搜索</span>
            <DownOutlined />
          </a-space>
        </a-button>
      </a-dropdown>
    </a-space>
  </div>
</template>
<script setup lang="ts">
import { PropType, reactive, toRefs, watch } from 'vue'
import { DataType, SearchComponentData } from './type'
import { DownOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { searchSelect, testData } from './table.ts'
import { message } from 'ant-design-vue'

const props = defineProps({
  data: {
    type: Array as PropType<DataType[]>,
    required: true
  },
  searchRecord: {
    type: Array as PropType<SearchComponentData[]>,
    default: () => []
  }
})
const emit = defineEmits(['search', 'sort', 'searchRecord', 'delete'])
const searchData = reactive<SearchComponentData>({
  searchValue: '',
  searchSelect: 'id',
  searchType: 'include'
})
const { searchRecord } = toRefs(props)

const searchText = (item: SearchComponentData) => {
  if (item.searchSelect === 'status') {
    return testData.find((obj: any) => obj.value === item.searchValue)!.text
  }
  return item.searchValue
}

const handleClear = () => {
  searchData.searchValue = ''
  searchData.searchSelect = 'id'
  searchData.searchType = 'include'
  emit('search', searchData)
}
const handleMenuClick = (item: SearchComponentData) => {
  Object.assign(searchData, item)
  emit('search', searchData)
}
const handleSave = () => {
  if (searchData.searchValue.length > 0 || searchData.searchSelect === 'status') {
    emit('searchRecord', JSON.parse(JSON.stringify(searchData)))
  }
  message.success('保存成功')
}

const handleDelete = (index: number) => {
  emit('delete', index)
}

const handleSelectChange = () => {
  if (searchData.searchSelect === 'status') {
    searchData.searchType = 'online'
  } else {
    searchData.searchType = 'include'
    searchData.searchValue = ''
  }
  onSearch()
}
const onSearch = () => {
  if (searchData.searchSelect === 'status') {
    searchData.searchValue = searchData.searchType
  }
  emit('search', searchData)
}

watch(
  props.data,
  () => {
    emit('search', searchData)
  },
  { deep: true }
)
</script>

<style scoped>
.search-main {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}
.search-record-item {
  width: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 40px;
  display: inline-block;
  vertical-align: top;
}
</style>
