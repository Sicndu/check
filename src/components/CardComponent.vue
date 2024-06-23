<template>
  <div class="card-container" v-if="props.data?.length > 0">
    <a-row :gutter="[24, 24]">
      <a-col :span="8" v-for="(item, index) in props.data" :key="index">
        <a-card hoverable style="background-color: #fafafa">
          <a-space direction="vertical">
            <a-row>
              <a-col :span="8">
                <img alt="" :width="70" :src="image" />
              </a-col>
              <a-col :span="16">
                <a-row>
                  <a-col :span="18">
                    <div class="ellipsis-text" :title="item.name">
                      <span style="font-size: 18px">{{ item.name }}</span>
                    </div>
                  </a-col>
                  <a-col :span="6">
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
                  </a-col>
                </a-row>
                <div style="font-size: 12px">
                  <a-space style="margin-bottom: 10px">
                    <span>设备ID:</span>
                    <span>{{ item.key }}</span>
                  </a-space>
                  <a-space>
                    <span>创建时间:</span>
                    <span>{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  </a-space>
                </div>
              </a-col>
            </a-row>
          </a-space>
          <template #actions>
            <a-space @click="handleEdit(item.key)">
              <edit-two-tone two-tone-color="#315efd" />
              <span>编辑</span>
            </a-space>
            <a-popconfirm
              placement="top"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleNotActive(item.key)"
            >
              <template #title>
                <p>{{ `确认${item.status.value !== 'notActive' ? '禁用' : '启用'}？` }}</p>
              </template>
              <a-space>
                <check-circle-two-tone
                  two-tone-color="#315efd"
                  v-if="item.status.value !== 'notActive'"
                />
                <stop-two-tone two-tone-color="#315efd" v-else />
                <span>{{ item.status.value !== 'notActive' ? '禁用' : '启用' }}</span>
              </a-space>
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
  EditTwoTone,
  DeleteTwoTone,
  CheckCircleTwoTone,
  StopTwoTone
} from '@ant-design/icons-vue'
import image from '/img.png'
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

const handleEdit = (key: string) => emit('handleEdit', key)
const handleNotActive = (key: string) => emit('handleNotActive', key)
const handleDelete = (key: string) => emit('handleDelete', key)
</script>

<style scoped>
.ellipsis-text {
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 130px;
  display: inline-block;
  vertical-align: top;
}
.card-container {
  margin-top: 15px;
  height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
