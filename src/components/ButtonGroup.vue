<template>
  <div class="header">
    <a-space>
      <a-button style="margin-bottom: 8px" type="primary" @click="handleAdd">
        <a-space :style="{ color: '#fff' }">
          <plus-outlined />
          新增
        </a-space>
      </a-button>
      <div v-if="isSort">
        <a-space>
          <a-button style="margin-bottom: 8px; padding: 0 8px" @click="handleSortChange()">
            <ordered-list-outlined />
            <arrow-up-outlined v-if="sortType === 'descend'" />
            <arrow-down-outlined v-if="sortType === 'ascend'" />
          </a-button>
          <a-button style="margin-bottom: 8px; padding: 0 6px" type="text" @click="isSort = false">
            <a-space :style="{ color: '#315efd' }">
              <redo-outlined />
              完成
            </a-space>
          </a-button>
        </a-space>
      </div>
      <div v-else>
        <a-dropdown>
          <template #overlay>
            <a-menu v-if="!allowSelect">
              <a-menu-item key="deleteDevice" @click="handleShowModal" v-if="showMode === 'table'">
                删除设备
              </a-menu-item>
              <a-menu-item key="deviceSort" @click="handleShowSort">设备排序</a-menu-item>
            </a-menu>
          </template>

          <a-button style="margin-bottom: 8px" :danger="allowSelect" @click="handleClick">
            <a-space>
              <delete-two-tone two-tone-color="#eb2f96" v-if="allowSelect" />
              {{ allowSelect ? '批量删除设备' : '批量操作' }}
              <DownOutlined v-if="!allowSelect" />
            </a-space>
            <a-modal v-model:visible="visible" title="删除">
              <p>该操作不可撤销</p>
              <template #footer>
                <a-button key="back" @click="visible = false">取消</a-button>
                <a-button key="submit" type="primary" @click="handleBatchDelete">确定</a-button>
              </template>
            </a-modal>
          </a-button>
        </a-dropdown>
        <a-button style="margin-bottom: 8px" type="text" @click="handleClose(true)" v-if="num > 0">
          <a-space :style="{ color: '#315efd' }">
            <redo-outlined />
            重选
          </a-space>
        </a-button>
      </div>
    </a-space>
    <a-space :size="0">
      <a-button
        :type="buttonType === 'default' ? 'default' : 'primary'"
        style="padding: 0 9px"
        @click="toggleButtonType"
      >
        <bars-outlined />
      </a-button>
      <a-button
        :type="buttonType === 'default' ? 'primary' : 'default'"
        style="padding: 0 9px"
        @click="toggleButtonType"
      >
        <appstore-outlined />
      </a-button>
    </a-space>
  </div>
  <div v-if="allowSelect">
    <a-alert :message="`已选择${num}个`" type="info" @close="handleClose(false)">
      <template #closeText>
        <a>取消选择</a>
      </template>
    </a-alert>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs, ref, PropType } from 'vue'
import {
  PlusOutlined,
  DeleteTwoTone,
  RedoOutlined,
  BarsOutlined,
  AppstoreOutlined,
  DownOutlined,
  OrderedListOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  num: {
    type: Number,
    default: 0
  },
  buttonType: String,
  allowSelect: Boolean,
  showMode: String,
  sortType: {
    type: String as PropType<'ascend' | 'descend'>,
    default: 'descend'
  }
})
const { num, buttonType, allowSelect, showMode, sortType } = toRefs(props)

const visible = ref(false)
const isSort = ref(false)

const emit = defineEmits([
  'handleAdd',
  'handleBatchDelete',
  'handleClose',
  'toggleButtonType',
  'updateAllowSelect',
  'handleSortChange'
])

const handleShowModal = () => {
  if (allowSelect.value && num.value > 0) {
    visible.value = true
  } else {
    emit('updateAllowSelect')
  }
}
const handleShowSort = () => {
  isSort.value = true
  emit('handleSortChange', sortType.value)
}
const handleClick = () => {
  if (allowSelect.value) {
    handleShowModal()
  }
}
const handleAdd = () => emit('handleAdd')
const handleBatchDelete = () => {
  emit('handleBatchDelete')
  visible.value = false
}
const handleClose = (tag: boolean) => emit('handleClose', tag)
const handleSortChange = () => emit('handleSortChange')
const toggleButtonType = () => emit('toggleButtonType')
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.demo-dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
