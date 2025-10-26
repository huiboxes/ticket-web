<template>
  <div>
    <a-card title="乘车人管理">
      <template #extra>
        <a-button type="primary" @click="showModal">
          <template #icon>
            <plus-outlined />
          </template>
          新增
        </a-button>
      </template>
      
      <a-table :columns="columns" :data-source="passengerList" :pagination="pagination" :loading="loading" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <span>{{ getPassengerTypeText(record.type) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="link" size="small">编辑</a-button>
              <a-button type="link" size="small" danger>删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 新增乘车人模态框 -->
    <a-modal 
      v-model:open="modalVisible" 
      title="新增乘车人" 
      @ok="handleOk" 
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="姓名" v-bind="validateInfos.name">
          <a-input v-model:value="form.name" placeholder="请输入姓名" />
        </a-form-item>
        
        <a-form-item label="身份证号" v-bind="validateInfos.idCard">
          <a-input v-model:value="form.idCard" placeholder="请输入身份证号" />
        </a-form-item>
        
        <a-form-item label="类型" v-bind="validateInfos.type">
          <a-select v-model:value="form.type" placeholder="请选择类型">
            <a-select-option value="1">成人</a-select-option>
            <a-select-option value="2">儿童</a-select-option>
            <a-select-option value="3">学生</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Form, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getPassengerList, savePassenger } from "@/api/passenger"

const store = useStore()

// 表格列定义
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
  }
]

// 乘车人列表数据
const passengerList = ref([])

// 表格加载状态
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 模态框可见性
const modalVisible = ref(false)

// 表单数据
const form = reactive({
  name: '',
  idCard: '',
  type: undefined
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  idCard: [{ required: true, message: '请输入身份证号' }],
  type: [{ required: true, message: '请选择类型' }]
}

// 表单验证实例
const { validate, validateInfos, resetFields } = Form.useForm(form, rules)

// 确认按钮加载状态
const confirmLoading = ref(false)

// 获取乘客列表
const fetchPassengerList = async () => {
  try {
    loading.value = true
    const memberId = store.state.member.id
    if (memberId) {
      const response = await getPassengerList({
        memberId,
        page: pagination.current,
        size: pagination.pageSize
      })
      
      const { total, list } = response.data
      passengerList.value = list
      pagination.total = total
    }
  } catch (error) {
    console.error('获取乘客列表失败:', error)
    message.error('获取乘客列表失败')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchPassengerList()
}

// 显示模态框
const showModal = () => {
  modalVisible.value = true
}

// 点击确定按钮
const handleOk = () => {
  validate()
    .then(() => {
      confirmLoading.value = true
      
      savePassengerData()
    })
    .catch(err => {
      console.log('表单验证失败:', err)
    })
}

const savePassengerData = async () => {
  try {
    const response = await savePassenger({
      name: form.name,
      idCard: form.idCard,
      type: form.type
    })
    
    if (response.success) {
      message.success('新增乘客成功')
      
      // 重置表单和状态
      resetFields()
      confirmLoading.value = false
      modalVisible.value = false
      
      // 重新获取乘客列表
      fetchPassengerList()
    } else {
      message.error(response.message || '新增乘客失败')
      confirmLoading.value = false
    }
  } catch (error) {
    console.error('新增乘客失败:', error)
    message.error('新增乘客失败')
    confirmLoading.value = false
  }
}

// 点击取消按钮
const handleCancel = () => {
  modalVisible.value = false
  resetFields()
}

// 获取乘客类型文本
const getPassengerTypeText = (type) => {
  switch (type) {
    case '1':
      return '成人'
    case '2':
      return '儿童'
    case '3':
      return '学生'
    default:
      return ''
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchPassengerList()
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>