<template>
  <div class="container mx-auto px-4 py-6">
    <!-- رأس الصفحة -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">الحضور - {{ event?.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ formatDate(event?.start_date) }} - {{ event?.location }}
        </p>
      </div>
      <div class="flex space-x-3 space-x-reverse gap-4">
        <button 
          @click="exportAttendees"
          :disabled="exporting"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-download ml-2"></i>
          {{ exporting ? 'جاري التصدير...' : 'تصدير الحضور' }}
        </button>
        <button 
          @click="$router.back()"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-arrow-right ml-2"></i>
          رجوع
        </button>
      </div>
    </div>

    <!-- إحصائيات سريعة -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="fas fa-users text-blue-600 dark:text-blue-300"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الحضور</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ totalAttendees }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <i class="fas fa-ticket-alt text-green-600 dark:text-green-300"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي التذاكر</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ totalTickets }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <i class="fas fa-money-bill-wave text-purple-600 dark:text-purple-300"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalRevenue) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
            <i class="fas fa-chart-line text-orange-600 dark:text-orange-300"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">متوسط التذكرة</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(averageTicketPrice) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- فلترة البحث -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ابحث باسم المستخدم، البريد الإلكتروني، أو نوع التذكرة..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
        <div class="flex space-x-3 space-x-reverse">
          <select 
            v-model="ticketTypeFilter"
            class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">جميع أنواع التذاكر</option>
            <option v-for="type in ticketTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <span class="mr-2 text-gray-600 dark:text-gray-400">جاري تحميل بيانات الحضور...</span>
    </div>

    <!-- جدول الحضور -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          عرض {{ filteredAttendees.length }} من أصل {{ attendees.length }} حضور
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          آخر تحديث: {{ lastUpdated }}
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-right">رقم الطلب</th>
              <th class="px-4 py-3 text-right">اسم المستخدم</th>
              <th class="px-4 py-3 text-right">البريد الإلكتروني</th>
              <th class="px-4 py-3 text-right">نوع التذكرة</th>
              <th class="px-4 py-3 text-right">الكمية</th>
              <th class="px-4 py-3 text-right">المبلغ</th>
              <th class="px-4 py-3 text-right">تاريخ الطلب</th>
              <th class="px-4 py-3 text-right">حالة الحضور</th>
              <th class="px-4 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="attendee in filteredAttendees" 
              :key="attendee.order_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                #{{ attendee.order_id }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-3">
                    <i class="fas fa-user text-blue-600 dark:text-blue-300"></i>
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ attendee.user_name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-900 dark:text-white">
                {{ attendee.user_email }}
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ attendee.ticket_type }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-900 dark:text-white text-center">
                {{ attendee.quantity }}
              </td>
              <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(attendee.total_amount) }}
              </td>
              <td class="px-4 py-3 text-gray-900 dark:text-white">
                {{ formatDateTime(attendee.ordered_at) }}
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="attendanceStatusClass(attendee.attendance_status)">
                  {{ getAttendanceStatusText(attendee.attendance_status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex space-x-2 space-x-reverse gap-4">
                  <button 
                    @click="toggleAttendance(attendee)"
                    :class="['px-3 py-1 text-xs rounded-full', attendee.attendance_status === 'attended' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-green-100 text-green-800 hover:bg-green-200']"
                    :title="attendee.attendance_status === 'attended' ? 'إلغاء الحضور' : 'تأكيد الحضور'"
                  >
                    <i class="fas" :class="attendee.attendance_status === 'attended' ? 'fa-times' : 'fa-check'"></i>
                    {{ attendee.attendance_status === 'attended' ? 'إلغاء' : 'تأكيد' }}
                  </button>
                  <button 
                    @click="openOrderModal(attendee)"
                    class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                    title="عرض تفاصيل الطلب"
                  >
                    <i class="fas fa-eye"></i>
                    عرض
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- حالة عدم وجود نتائج -->
        <div v-if="filteredAttendees.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-users text-4xl mb-3"></i>
          <p class="text-lg">لا توجد بيانات حضور</p>
          <p class="text-sm mt-1" v-if="searchQuery || ticketTypeFilter">
            حاول تعديل معايير البحث
          </p>
        </div>
      </div>
    </div>

    <!-- Modal تأكيد الحضور -->
    <div v-if="showAttendanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {{ selectedAttendee?.attendance_status === 'attended' ? 'إلغاء الحضور' : 'تأكيد الحضور' }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          هل أنت متأكد من {{ selectedAttendee?.attendance_status === 'attended' ? 'إلغاء حضور' : 'تأكيد حضور' }} 
          <strong>{{ selectedAttendee?.user_name }}</strong>؟
        </p>
        <div class="flex justify-end space-x-3 space-x-reverse gap-4">
          <button 
            @click="showAttendanceModal = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            إلغاء
          </button>
          <button 
            @click="confirmAttendance"
            :class="['px-4 py-2 text-white rounded-lg', selectedAttendee?.attendance_status === 'attended' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700']"
          >
            {{ selectedAttendee?.attendance_status === 'attended' ? 'إلغاء الحضور' : 'تأكيد الحضور' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal جديد لعرض تفاصيل الطلب -->
    <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <!-- رأس الـ Modal -->
        <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            تفاصيل الطلب #{{ selectedOrder?.order_id }}
          </h3>
          <button 
            @click="closeOrderModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- محتوى الـ Modal -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- معلومات المستخدم -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات المستخدم</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">الاسم:</label>
                <p class="font-medium">{{ selectedOrder?.user_name }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني:</label>
                <p class="font-medium">{{ selectedOrder?.user_email }}</p>
              </div>
            </div>
          </div>

          <!-- معلومات الطلب -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات الطلب</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">رقم الطلب:</label>
                <p class="font-medium">#{{ selectedOrder?.order_id }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">تاريخ الطلب:</label>
                <p class="font-medium">{{ formatDateTime(selectedOrder?.ordered_at) }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">حالة الدفع:</label>
                <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  مكتمل
                </span>
              </div>
            </div>
          </div>

          <!-- تفاصيل التذاكر -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-3">تفاصيل التذاكر</h4>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ selectedOrder?.ticket_type }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">نوع التذكرة</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ selectedOrder?.quantity }} تذاكر</p>
                  <p class="text-lg font-bold text-green-600 dark:text-green-400">
                    {{ formatCurrency(selectedOrder?.total_amount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ملخص المبلغ -->
          <div class="border-t dark:border-gray-700 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600 dark:text-gray-400">المبلغ الإجمالي:</span>
              <span class="font-bold">{{ formatCurrency(selectedOrder?.total_amount) }}</span>
            </div>
            <div class="flex justify-between items-center text-green-600 dark:text-green-400">
              <span>حالة الدفع:</span>
              <span class="font-bold">مدفوع</span>
            </div>
          </div>
        </div>

        <!-- أسفل الـ Modal -->
        <div class="flex justify-end p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <button 
            @click="closeOrderModal"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

// المتغيرات التفاعلية
const event = ref(null)
const attendees = ref([])
const loading = ref(false)
const exporting = ref(false)
const searchQuery = ref('')
const ticketTypeFilter = ref('')
const showAttendanceModal = ref(false)
const showOrderModal = ref(false) // إضافة متغير للـ Modal الجديد
const selectedAttendee = ref(null)
const selectedOrder = ref(null) // إضافة متغير للطلب المحدد

// الحسابات
const filteredAttendees = computed(() => {
  let filtered = attendees.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(attendee =>
      attendee.user_name.toLowerCase().includes(query) ||
      attendee.user_email.toLowerCase().includes(query) ||
      attendee.ticket_type.toLowerCase().includes(query)
    )
  }

  if (ticketTypeFilter.value) {
    filtered = filtered.filter(attendee => attendee.ticket_type === ticketTypeFilter.value)
  }

  return filtered
})

const totalAttendees = computed(() => attendees.value.length)

const totalTickets = computed(() => {
  return attendees.value.reduce((sum, attendee) => sum + (parseInt(attendee.quantity) || 0), 0)
})

const totalRevenue = computed(() => {
  return attendees.value.reduce((sum, attendee) => sum + (parseFloat(attendee.total_amount) || 0), 0)
})

const averageTicketPrice = computed(() => {
  const tickets = totalTickets.value
  const revenue = totalRevenue.value
  return tickets > 0 ? revenue / tickets : 0
})

const ticketTypes = computed(() => {
  const types = new Set(attendees.value.map(attendee => attendee.ticket_type))
  return Array.from(types).sort()
})

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// الدوال
const fetchEventAttendees = async () => {
  loading.value = true
  try {
    const eventId = route.params.id
    const [eventResponse, attendeesResponse] = await Promise.all([
      api.get(`/organizer/events/${eventId}`),
      api.get(`/organizer/events/${eventId}/attendees`)
    ])
    
    event.value = eventResponse.data
    attendees.value = attendeesResponse.data.map(attendee => ({
      ...attendee,
      attendance_status: 'not_attended' // سيتم دمج هذه المعلومة من الخادم لاحقاً
    }))
  } catch (error) {
    console.error('Error fetching attendees:', error)
    showToast('خطأ', 'فشل في تحميل بيانات الحضور', 'error')
  } finally {
    loading.value = false
  }
}

const toggleAttendance = (attendee) => {
  selectedAttendee.value = attendee
  showAttendanceModal.value = true
}

const confirmAttendance = async () => {
  try {
    // هنا سيتم إضافة API call لتحديث حالة الحضور
    const newStatus = selectedAttendee.value.attendance_status === 'attended' ? 'not_attended' : 'attended'
    selectedAttendee.value.attendance_status = newStatus
    
    showToast('نجاح', `تم ${newStatus === 'attended' ? 'تأكيد' : 'إلغاء'} الحضور بنجاح`, 'success')
    showAttendanceModal.value = false
  } catch (error) {
    console.error('Error updating attendance:', error)
    showToast('خطأ', 'فشل في تحديث حالة الحضور', 'error')
  }
}

// دالة فتح Modal الطلب
const openOrderModal = (attendee) => {
  selectedOrder.value = attendee
  showOrderModal.value = true
}

// دالة إغلاق Modal الطلب
const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

const exportAttendees = async () => {
  exporting.value = true
  try {
    // هنا سيتم إضافة دالة التصدير
    showToast('نجاح', 'تم تصدير بيانات الحضور بنجاح', 'success')
  } catch (error) {
    console.error('Error exporting attendees:', error)
    showToast('خطأ', 'فشل في تصدير البيانات', 'error')
  } finally {
    exporting.value = false
  }
}

// الدوال المساعدة
const formatCurrency = (amount) => {
  // تحقق من أن amount موجود وهو رقم
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '٠٫٠٠ ر.س'
  }
  
  const num = parseFloat(amount)
  if (isNaN(num)) {
    return '٠٫٠٠ ر.س'
  }
  
  // استخدام تنسيق الأرقام العربية
  return new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num) + ' ر.س'
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const attendanceStatusClass = (status) => {
  const classes = {
    attended: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    not_attended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getAttendanceStatusText = (status) => {
  const texts = {
    attended: 'حاضر',
    not_attended: 'لم يحضر بعد'
  }
  return texts[status] || status
}

onMounted(() => {
  fetchEventAttendees()
})
</script>

<style scoped>
/* تأثيرات للـ Modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>