<template>
  <div class="pagination">
    <a-pagination
      v-model:current="pageData.current"
      v-model:page-size="pageData.pageSize"
      :total="total"
      show-less-items
      hideOnSinglePage
      :pageSizeOptions="pageData.pageSizeOptions"
      :show-total="(total:number, range:any) => `第 ${range[0]} - ${range[1]} 条/总共 ${total} 条`"
      @change="handleChange"
    >
      <template #itemRender="{ type, originalElement }">
        <a v-if="type === 'prev'"><left-outlined /></a>
        <a v-else-if="type === 'next'"><right-outlined /></a>
        <component :is="originalElement" v-else></component>
      </template>
    </a-pagination>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, toRefs, watch } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['change'])
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const { data } = toRefs(props)
const pageData = reactive({
  current: 1,
  pageSize: 9,
  tableData: [] as any[],
  pageSizeOptions: ['9', '18', '27', '36']
})
const total = computed(() => {
  return data.value.length
})

const handleChange = (page: number, pageSize: number) => {
  pageData.current = page
  pageData.pageSize = pageSize
  emit('change', pageData)
}

watch(
  data,
  () => {
    handleChange(pageData.current, pageData.pageSize)
  },
  { deep: true }
)
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>
