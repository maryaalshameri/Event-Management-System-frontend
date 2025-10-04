<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <button 
        @click="addUser" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <i class="fas fa-plus ml-2"></i>
        إضافة مستخدم
      </button>
    </div>

    <!-- فلترة البحث باستخدام المكون الجديد -->
    <FilterBar
    
      :filters="filters"
      :filters-config="filtersConfig"
      :loading="loading"
      @update:filters="handleFiltersUpdate"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <span class="mr-2">جاري تحميل البيانات...</span>
    </div>

    <!-- جدول المستخدمين -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          عرض {{ meta.from }} إلى {{ meta.to }} من {{ meta.total }} مستخدم
        </div>
        <div class="flex space-x-2 space-x-reverse">
          <ExportButton
            :exporting="exporting"
            :total-items="meta.total"
            :filtered-items="users.length"
            :selected-items="selectedUsers"
            @export="handleExport"
          />
        </div>
      </div>
      
      <div v-if="users.length === 0" class="p-6 text-center text-gray-500">
        <i class="fas fa-search text-3xl mb-2"></i>
        <p>لا توجد مستخدمين تطابق معايير البحث</p>
        <button 
          @click="resetFilters"
          class="mt-2 text-blue-600 hover:text-blue-800"
        >
          عرض جميع المستخدمين
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-right w-8">
                <input 
                  type="checkbox" 
                  v-model="selectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </th>
              <th class="px-4 py-3 text-right">المستخدم</th>
              <th class="px-4 py-3 text-right">البريد الإلكتروني</th>
              <th class="px-4 py-3 text-right">الدور</th>
              <th class="px-4 py-3 text-right">الهاتف</th>
              <th class="px-4 py-3 text-right">تاريخ التسجيل</th>
              <th class="px-4 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3">
                <input 
                  type="checkbox" 
                  v-model="selectedUsers"
                  :value="user.id"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <img 
                    :src="`http://127.0.0.1:8000/storage/${user.avatar}`"
                     
                    :alt="user.name"
                    class="h-10 w-10 rounded-full object-cover ml-3"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-black dark:text-gray-50">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="roleClass(user.role)">
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td class="px-4 py-3 text-black dark:text-gray-50">{{ user.phone || 'غير مضاف' }}</td>
              <td class="px-4 py-3 text-black dark:text-gray-50">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-3">
                <div class="flex space-x-2 space-x-reverse gap-3">
                  <button 
                    @click="editUser(user)"
                    class="text-blue-600 hover:text-blue-800"
                    title="تعديل"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="changePassword(user)"
                    class="text-green-600 hover:text-green-800"
                    title="تغيير كلمة المرور"
                  >
                    <i class="fas fa-key"></i>
                  </button>
                  <button 
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-800"
                    title="حذف"
                    :disabled="user.id === 1"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- الترقيم -->
      <div v-if="meta && meta.total > meta.per_page" class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300 mb-2 md:mb-0">
            عرض <span class="font-medium">{{ meta.from }}</span> إلى <span class="font-medium">{{ meta.to }}</span> من <span class="font-medium">{{ meta.total }}</span> نتيجة
          </div>
          <div class="flex space-x-2">
            <button 
              @click="goToPage(meta.current_page - 1)"
              :disabled="meta.current_page === 1"
              class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              السابق
            </button>
            <button 
              v-for="page in pages"
              :key="page"
              @click="goToPage(page)"
              :class="['px-3 py-1 rounded-md text-sm font-medium', page === meta.current_page ? 'bg-indigo-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600']"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
            <button 
              @click="goToPage(meta.current_page + 1)"
              :disabled="meta.current_page === meta.last_page"
              class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>

    <UserModal 
      v-if="showUserModal"
      :user="selectedUser"
      @close="showUserModal = false"
      @saved="handleUserSaved"
    />

    <!-- نموذج تغيير كلمة المرور -->
    <PasswordModal 
      v-if="showPasswordModal"
      :user="selectedUser"
      @close="showPasswordModal = false"
      @saved="handlePasswordChanged"
    />

    <!-- تأكيد الحذف -->
    <ConfirmationModal 
      v-if="showDeleteModal"
      title="تأكيد الحذف"
      message="هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
      confirm-text="حذف"
      cancel-text="إلغاء"
      @confirm="deleteUser"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useTableFilter } from '@/composables/useTableFilter'
import { useExcelExport } from '@/composables/useExcelExport'
import FilterBar from '@/components/Table/FilterBar.vue'
import ExportButton from '@/components/Table/ExportButton.vue'
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import UserModal from '@/components/Admin/UserModal.vue'
import PasswordModal from '@/components/Admin/PasswordModal.vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

// استخدام composables
const { filters, resetFilters: resetTableFilters } = useTableFilter()
const { exporting, exportToExcel } = useExcelExport()

// المتغيرات التفاعلية
const users = ref([])
const loading = ref(false)
const selectedUsers = ref([])
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// متغيرات Modals
const showUserModal = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)

// تكوين الفلترة للمستخدمين
const filtersConfig = [
  {
    key: 'search',
    label: 'بحث',
    type: 'text',
    placeholder: 'ابحث بالاسم أو البريد الإلكتروني...'
  },
  {
    key: 'role',
    label: 'الدور',
    type: 'select',
    defaultOption: 'جميع الأدوار',
    options: [
      { value: 'admin', label: 'مدير' },
      { value: 'organizer', label: 'منظم' },
      { value: 'attendee', label: 'حضور' }
    ]
  },
  {
    key: 'status',
    label: 'الحالة',
    type: 'select',
    defaultOption: 'جميع الحالات',
    options: [
      { value: 'active', label: 'نشط' },
      { value: 'inactive', label: 'غير نشط' },
      { value: 'suspended', label: 'موقوف' }
    ]
  },
  {
    key: 'sort_by',
    label: 'الترتيب حسب',
    type: 'select',
    options: [
      { value: 'created_at', label: 'تاريخ التسجيل' },
      { value: 'name', label: 'الاسم' },
      { value: 'email', label: 'البريد الإلكتروني' }
    ]
  },
  {
    key: 'sort_order',
    label: 'نوع الترتيب',
    type: 'select',
    options: [
      { value: 'desc', label: 'تنازلي' },
      { value: 'asc', label: 'تصاعدي' }
    ]
  },
  {
    key: 'per_page',
    label: 'عدد العناصر',
    type: 'select',
    options: [
      { value: '10', label: '10' },
      { value: '15', label: '15' },
      { value: '25', label: '25' },
      { value: '50', label: '50' },
      { value: '100', label: '100' }
    ]
  }
]

// computed properties للترقيم
const pages = computed(() => {
  if (!meta.value || meta.value.last_page <= 1) return []
  
  const totalPages = meta.value.last_page
  const currentPage = meta.value.current_page
  const delta = 2
  
  let range = []
  
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i)
  }
  
  if (currentPage - delta > 2) {
    range.unshift('...')
  }
  
  if (currentPage + delta < totalPages - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (totalPages > 1) {
    range.push(totalPages)
  }
  
  return range
})

const selectAll = computed({
  get: () => users.value.length > 0 && selectedUsers.value.length === users.value.length,
  set: (value) => {
    if (value) {
      selectedUsers.value = users.value.map(user => user.id)
    } else {
      selectedUsers.value = []
    }
  }
})

// الدوال الرئيسية
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    
    const defaultFilters = {
      page: 1,
      per_page: 15,
      sort_by: 'created_at',
      sort_order: 'desc'
    }
    
    const allFilters = { ...defaultFilters, ...filters.value }
    
    Object.keys(allFilters).forEach(key => {
      if (allFilters[key] !== null && allFilters[key] !== undefined && allFilters[key] !== '') {
        params.append(key, allFilters[key])
      }
    })

    const response = await api.get(`/admin/users?${params}`)
    
    users.value = response.data.data || []
    meta.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      per_page: parseInt(allFilters.per_page) || 15,
      total: users.value.length,
      from: 1,
      to: users.value.length
    }
    
  } catch (error) {
    console.error('Error fetching users:', error)
    showToast('خطأ', 'فشل في تحميل بيانات المستخدمين', 'error')
    users.value = []
    meta.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
  } finally {
    loading.value = false
  }
}

const handleFiltersUpdate = (newFilters) => {
  Object.keys(newFilters).forEach(key => {
    if (newFilters[key] === '' || newFilters[key] === null) {
      delete filters.value[key]
    } else {
      filters.value[key] = newFilters[key]
    }
  })
}

const applyFilters = () => {
  filters.value.page = 1
  fetchUsers()
}

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > meta.value.last_page) return
  filters.value.page = page
  fetchUsers()
}

const resetFilters = () => {
  resetTableFilters()
  filters.value = {
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc'
  }
  fetchUsers()
}

const handleExport = async (type) => {
  try {
    let dataToExport = []
    
    if (type === 'all') {
      const params = new URLSearchParams()
      Object.keys(filters.value).forEach(key => {
        if (key !== 'page' && key !== 'per_page' && filters.value[key]) {
          params.append(key, filters.value[key])
        }
      })
      params.append('per_page', meta.value.total)
      
      const response = await api.get(`/admin/users?${params}`)
      dataToExport = response.data.data || []
    } else if (type === 'selected') {
      dataToExport = users.value.filter(user => selectedUsers.value.includes(user.id))
    } else {
      dataToExport = [...users.value]
    }

    const columns = [
      { key: 'name', header: 'الاسم', width: 25 },
      { key: 'email', header: 'البريد الإلكتروني', width: 25 },
      { key: 'role', header: 'الدور', width: 15, formatter: getRoleText },
      { key: 'phone', header: 'الهاتف', width: 15, formatter: (val) => val || 'غير مضاف' },
      { key: 'status', header: 'الحالة', width: 10, formatter: (val) => val || 'نشط' },
      { key: 'created_at', header: 'تاريخ التسجيل', width: 20, formatter: formatDateForExport }
    ]

    await exportToExcel(dataToExport, columns, 'المستخدمين')
    showToast('نجاح', `تم تصدير ${dataToExport.length} مستخدم بنجاح`, 'success')
  } catch (error) {
    showToast('خطأ', error.message || 'حدث خطأ أثناء التصدير', 'error')
  }
}

// دوال إدارة المستخدمين
const addUser = () => {
  selectedUser.value = {} 
  showUserModal.value = true
}

const editUser = (user) => {
  selectedUser.value = { ...user }
  showUserModal.value = true
}

const changePassword = (user) => {
  selectedUser.value = user
  showPasswordModal.value = true
}

const confirmDelete = (user) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  try {
    await api.delete(`/admin/users/${selectedUser.value.id}`)
    showDeleteModal.value = false
    showToast('نجاح', 'تم حذف المستخدم بنجاح', 'success')
    fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error.response?.status === 403) {
      showToast('خطأ', error.response.data.message, 'error')
    } else {
      showToast('خطأ', 'فشل في حذف المستخدم', 'error')
    }
  }
}

const handleUserSaved = (message) => {
  showUserModal.value = false
  showToast('نجاح', message, 'success')
  fetchUsers()
}

const handlePasswordChanged = () => {
  showPasswordModal.value = false
  showToast('نجاح', 'تم تغيير كلمة المرور بنجاح', 'success')
}

// الدوال المساعدة
const formatDateForExport = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const roleClass = (role) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    organizer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    attendee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getRoleText = (role) => {
  const texts = {
    admin: 'مدير',
    organizer: 'منظم',
    attendee: 'حضور'
  }
  return texts[role] || role
}

// مشاهدة التغييرات
watch(() => filters.value.per_page, (newValue) => {
  if (newValue) {
    filters.value.page = 1
    fetchUsers()
  }
})

// مراقبة حالة المودال
watch(showUserModal, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

watch(showPasswordModal, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

watch(showDeleteModal, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

onMounted(() => {
  filters.value = {
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc',
    ...filters.value
  }
  fetchUsers()
})
</script>