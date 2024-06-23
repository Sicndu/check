<template>
  <div class="table-container" v-if="data && data.length > 0">
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ y: 500 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createTime'">
          <span>{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-space>
            <close-circle-filled style="color: #eb2f96" v-if="record.status.value === 'offline'" />
            <check-circle-filled
              style="color: #315efd"
              v-else-if="record.status.value === 'online'"
            />
            <pause-circle-filled style="color: #ffa600" v-else />
            <span>{{ record.status.text }}</span>
          </a-space>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space size="middle">
            <eye-two-tone two-tone-color="#315efd" @click="handleView(record.key)" />
            <edit-two-tone two-tone-color="#315efd" @click="handleEdit(record.key)" />
            <a-popconfirm
              placement="top"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleNotActive(record.key)"
            >
              <template #title>
                <p>{{ `确认${record.status.value !== 'notActive' ? '禁用' : '启用'}？` }}</p>
              </template>
              <check-circle-two-tone
                two-tone-color="#315efd"
                v-if="record.status.value !== 'notActive'"
              />
              <stop-two-tone two-tone-color="#315efd" v-else />
            </a-popconfirm>
            <a-tooltip
              :title="record.status.value !== 'notActive' ? '设备启用中，无法删除' : ''"
              placement="right"
            >
              <a-popconfirm
                placement="top"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.key)"
                :disabled="record.status.value !== 'notActive'"
              >
                <template #title>
                  <p>确认删除？</p>
                </template>
                <delete-two-tone
                  :two-tone-color="record.status.value !== 'notActive' ? '#878787' : '#eb2f96'"
                  :class="{ 'button-pointer': record.status.value !== 'notActive' }"
                />
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
  <div v-else>
    <a-empty />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs, PropType } from 'vue'
import {
  EyeTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  CheckCircleTwoTone,
  StopTwoTone,
  CheckCircleFilled,
  CloseCircleFilled,
  PauseCircleFilled
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { DataType } from './type'

const props = defineProps({
  rowSelection: Object,
  columns: Array,
  data: {
    type: Array as PropType<DataType[]>,
    required: true
  }
})
const { rowSelection, columns, data } = toRefs(props)

const emit = defineEmits(['handleView', 'handleEdit', 'handleNotActive', 'handleDelete'])

const handleView = (key: string) => emit('handleView', key)
const handleEdit = (key: string) => emit('handleEdit', key)
const handleNotActive = (key: string) => emit('handleNotActive', key)
const handleDelete = (key: string) => emit('handleDelete', key)
</script>
<style scoped>
.button-pointer {
  cursor: not-allowed;
}
.table-container {
  margin-top: 15px;
  height: calc(100vh - 250px);
}
</style>
