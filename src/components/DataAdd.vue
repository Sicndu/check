<template>
  <a-modal :visible="visible" title="新增数据" :width="500" @cancel="closeModal">
    <a-form
      ref="formRef"
      :label-col="{ span: 5 }"
      :model="formState"
      :wrapper-col="{ span: 19 }"
      labelAlign="left"
      size="small"
    >
      <a-form-item
        label="设备编号"
        name="key"
        :rules="[
          { validator: validateId, trigger: 'blur' },
          {
            pattern: /^(?=.*[._*#])[a-zA-Z0-9._*#]+$/,
            message: '必须包含._*#中任意特殊字符，且不能输入中文'
          }
        ]"
      >
        <a-input v-model:value="formState.key" placeholder="不输则自动生成" :disabled="viewRef" />
      </a-form-item>
      <a-form-item
        label="设备名称"
        name="name"
        :rules="[
          { required: true, message: '请输入设备名称' },
          { max: 20, message: '最多20个字符' }
        ]"
      >
        <a-input v-model:value="formState.name" placeholder="请输入设备名称" :disabled="viewRef" />
      </a-form-item>
      <a-form-item label="说明" name="describe" :rules="[{ max: 100, message: '最多100个字符' }]">
        <a-textarea
          v-model:value="formState.describe"
          type="textarea"
          placeholder="请输入设备说明"
          :disabled="viewRef"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button style="margin-left: 10px" @click="closeModal">取消</a-button>
      <a-button type="primary" @click="onSubmit" v-if="!viewRef">
        {{ isEdit ? '保存' : '新增' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import { DataType } from './type'
import { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import { testData } from './table.ts'

const props = defineProps({
  data: {
    type: Array as PropType<DataType[]>,
    required: true
  }
})

const emit = defineEmits(['success'])

const formState: UnwrapRef<DataType> = reactive({
  key: '',
  name: '',
  createTime: 0,
  status: testData[0],
  describe: ''
})
const initialFormState = { ...formState }
const formRef = ref<any>()
const visible = ref(false)
const viewRef = ref(false)
const isEdit = ref(false)

const closeModal = () => {
  Object.assign(formState, initialFormState)
  viewRef.value = false
  visible.value = false
  isEdit.value = false
}

const validateId = (_: Rule, value: string) => {
  return new Promise((resolve, reject) => {
    if (value.length > 0 && !isEdit) {
      const tag = props.data.find((item: any) => item.key === value)
      if (tag) {
        reject('设备编号重复')
      } else {
        resolve(true)
      }
    } else {
      resolve(true)
    }
  })
}

const openModal = (str: string, key?: any) => {
  if (str !== 'add') {
    isEdit.value = true
    const tag = props.data.find((item: any) => item.key === key)
    if (tag) {
      formState.key = tag.key
      formState.name = tag.name
      formState.status = tag.status
      formState.describe = tag.describe
    }
    if (str === 'view') {
      viewRef.value = true
    }
  }
  visible.value = true
}

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      const maxNum = Math.max(
        ...props.data.map((item: any) => {
          const parts = item.key.split('_')
          if (parts.length > 1) {
            const numPart = Number(parts[1])
            if (!isNaN(numPart)) {
              return numPart // 返回提取出的数字
            }
          }
          return -Infinity // 如果没有有效的数字，返回一个比任何实际数字都小的值
        })
      )
      const key = `ID_${maxNum + 1}`
      if (isEdit.value) {
        const tag = props.data.find((item: any) => item.key === formState.key)
        if (tag) {
          tag.key = formState.key || key
          tag.name = formState.name
          tag.status = formState.status
          tag.describe = formState.describe
        }
      } else {
        const params = {
          key: formState.key || key,
          name: formState.name,
          createTime: Date.now(),
          describe: formState.describe,
          status: testData[Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1))]
        }
        emit('success', { ...params })
      }
      closeModal()
      message.success(`${isEdit.value ? '编辑' : '新增'}成功`)
    })
    .catch((error: string) => {
      console.log('error', error)
    })
}

defineExpose({
  openModal
})
</script>

<style scoped></style>
