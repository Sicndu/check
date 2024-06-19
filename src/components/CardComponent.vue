<template>
  <div class="card-container" v-if="props.data?.length > 0">
    <a-row :gutter="[25, 25]">
      <a-col :span="6" v-for="(item, index) in props.data" :key="index">
        <a-card hoverable style="background-color: #fafafa">
          <template #title>
            <a-space>
              <div class="ellipsis-text" :title="item.name">
                <span>{{ item.name }}</span>
              </div>
              <a-tag>
                <close-circle-filled
                  style="color: #eb2f96"
                  v-if="item.status.value === 'offline'"
                />
                <check-circle-filled
                  style="color: #315efd"
                  v-else-if="item.status.value === 'online'"
                />
                <pause-circle-filled style="color: #ffa600" v-else />
                <span>{{ item.status.text }}</span>
              </a-tag>
            </a-space>
          </template>
          <a-space direction="vertical">
            <a-space align="center">
              <div class="ellipsis-text" :title="item.name">
                <span>设备ID：{{ item.key }}</span>
              </div>
            </a-space>
            <a-space direction="vertical">
              <span>创建时间：{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              <div class="describe-text">说明：{{ item.describe }}</div>
            </a-space>
          </a-space>
          <template #actions>
            <eye-two-tone two-tone-color="#315efd" @click="handleView(item.key)" />
            <edit-two-tone two-tone-color="#315efd" @click="handleEdit(item.key)" />
            <a-popconfirm
              placement="top"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleNotActive(item.key)"
            >
              <template #title>
                <p>{{ `确认${item.status.value !== 'notActive' ? '禁用' : '启用'}？` }}</p>
              </template>
              <check-circle-two-tone
                two-tone-color="#315efd"
                v-if="item.status.value !== 'notActive'"
              />
              <stop-two-tone two-tone-color="#315efd" v-else />
            </a-popconfirm>
            <a-tooltip :title="item.status.value !== 'notActive' ? '设备启用中，无法删除' : ''">
              <a-popconfirm
                placement="top"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(item.key)"
                :disabled="item.status.value !== 'notActive'"
              >
                <template #title>
                  <p>确认删除？</p>
                </template>
                <delete-two-tone
                  :two-tone-color="item.status.value !== 'notActive' ? '#878787' : '#eb2f96'"
                  :class="item.status.value !== 'notActive' ? 'button-pointer' : ''"
                />
              </a-popconfirm>
            </a-tooltip>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <div v-else>
    <a-empty />
  </div>
</template>
<script setup lang="ts">
import {
  CloseCircleFilled,
  CheckCircleFilled,
  PauseCircleFilled,
  EyeTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  CheckCircleTwoTone,
  StopTwoTone
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { DataType } from './type'
import { PropType } from 'vue'

const emit = defineEmits(['handleView', 'handleEdit', 'handleNotActive', 'handleDelete'])
const props = defineProps({
  data: {
    type: Array as PropType<DataType[]>,
    required: true
  }
})

const handleView = (key: string) => emit('handleView', key)
const handleEdit = (key: string) => emit('handleEdit', key)
const handleNotActive = (key: string) => emit('handleNotActive', key)
const handleDelete = (key: string) => emit('handleDelete', key)
</script>

<style scoped>
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
  display: inline-block;
  vertical-align: top;
}
.describe-text {
  height: 80px;
}
.card-container {
  margin-top: 15px;
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
