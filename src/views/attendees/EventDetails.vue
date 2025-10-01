<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 md:pb-0">
    <div class="container mx-auto px-4 py-6">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
        <span class="mr-3 text-gray-600 dark:text-gray-300">جاري تحميل التفاصيل...</span>
      </div>

      <!-- محتوى الفعالية -->
      <div v-else-if="event" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- صورة الفعالية -->
        <div class="relative h-64 md:h-96">
          <img
            :src="`http://127.0.0.1:8000/storage/${event.image}`"
            :alt="event.title"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0  bg-opacity-10"></div>
          <div class="absolute bottom-4 right-4 text-white">
            <h1 class="text-2xl md:text-4xl font-bold mb-2">{{ event.title }}</h1>
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt ml-2"></i>
                <span>{{ event.location }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-calendar ml-2"></i>
                <span>{{ formatDate(event.start_date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- المعلومات الرئيسية -->
            <div class="lg:col-span-2">
              <!-- الوصف -->
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">عن الفعالية</h2>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ event.description }}
                </p>
              </div>

              <!-- المنظم -->
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">المنظم</h2>
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center ml-3">
                    <i class="fas fa-user text-indigo-600"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ event.organizer?.name }}</p>
                    <p class="text-gray-500 text-sm">{{ event.organizer?.email }}</p>
                  </div>
                </div>
              </div>

              <!-- التقييمات -->
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">التقييمات</h2>
                <div class="flex items-center space-x-4 space-x-reverse">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-yellow-600">{{ averageRating }}</div>
                    <div class="flex justify-center mt-1">
                      <i v-for="n in 5" :key="n" 
                         class="fas fa-star" 
                         :class="n <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'"></i>
                    </div>
                    <div class="text-sm text-gray-500 mt-1">{{ totalReviews }} تقييم</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- الجانب الأيمن - الحجز -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-24">
                <!-- أنواع التذاكر -->
                <div class="mb-6">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">أنواع التذاكر</h3>
                  <div v-for="ticketType in event.ticket_types" :key="ticketType.id" 
                       class="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white capitalize">
                          {{ getTicketTypeText(ticketType.name) }}
                        </h4>
                        <p class="text-sm text-gray-500 mt-1">{{ ticketType.description }}</p>
                      </div>
                      <div class="text-lg font-bold text-indigo-600">
                        {{ formatPrice(ticketType.price) }}
                      </div>
                    </div>
                    
                    <div class="flex justify-between items-center mt-3">
                      <span class="text-sm text-gray-500">
                        متاح: {{ ticketType.available }} / {{ ticketType.quantity }}
                      </span>
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <button
                          @click="decrementTicket(ticketType.id)"
                          :disabled="getTicketCount(ticketType.id) <= 0"
                          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span class="w-8 text-center">{{ getTicketCount(ticketType.id) }}</span>
                        <button
                          @click="incrementTicket(ticketType.id)"
                          :disabled="getTicketCount(ticketType.id) >= ticketType.available"
                          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ملخص الطلب -->
                <div class="mb-6" v-if="totalTickets > 0">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">ملخص الطلب</h3>
                  <div class="space-y-2">
                    <div v-for="ticketType in event.ticket_types" :key="ticketType.id">
                      <div v-if="getTicketCount(ticketType.id) > 0" 
                           class="flex justify-between text-sm">
                        <span>{{ getTicketTypeText(ticketType.name) }} × {{ getTicketCount(ticketType.id) }}</span>
                        <span>{{ formatPrice(ticketType.price * getTicketCount(ticketType.id)) }}</span>
                      </div>
                    </div>
                    <div class="border-t pt-2 mt-2">
                      <div class="flex justify-between font-bold">
                        <span>المجموع</span>
                        <span class="text-green-600">{{ formatPrice(totalAmount) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- زر الحجز -->
                <button
                  @click="proceedToBooking"
                  :disabled="totalTickets === 0 || bookingLoading"
                  class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <i v-if="bookingLoading" class="fas fa-spinner fa-spin ml-2"></i>
                  <i v-else class="fas fa-ticket-alt ml-2"></i>
                  {{ totalAmount > 0 ? 'متابعة إلى الدفع' : 'حجز مجاني' }}
                </button>

                <!-- معلومات إضافية -->
                <div class="mt-4 text-center text-sm text-gray-500">
                  <p>ضمان استرجاع المبلغ خلال 24 ساعة</p>
                  <p>تذكرة إلكترونية - يمكنك تحميلها فوراً</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- عدم وجود فعالية -->
      <div v-else class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          الفعالية غير موجودة
        </h3>
        <router-link
          :to="{ name: 'EventsList' }"
          class="text-indigo-600 hover:text-indigo-700"
        >
          العودة إلى قائمة الفعاليات
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

// المتغيرات التفاعلية
const event = ref(null)
const loading = ref(false)
const bookingLoading = ref(false)
const selectedTickets = ref({})
const averageRating = ref(0)
const totalReviews = ref(0)

// computed properties
const totalTickets = computed(() => {
  return Object.values(selectedTickets.value).reduce((sum, count) => sum + count, 0)
})

const totalAmount = computed(() => {
  if (!event.value) return 0
  return event.value.ticket_types.reduce((total, ticketType) => {
    const count = selectedTickets.value[ticketType.id] || 0
    return total + (ticketType.price * count)
  }, 0)
})

// الدوال
const fetchEventDetails = async () => {
  loading.value = true
  try {
    const response = await api.get(`/attendee/events/${route.params.id}`)
    event.value = response.data.data.event
    averageRating.value = response.data.data.average_rating
    totalReviews.value = response.data.data.total_reviews
    
    // تهيئة selectedTickets
    event.value.ticket_types.forEach(ticketType => {
      selectedTickets.value[ticketType.id] = 0
    })
  } catch (error) {
    console.error('Error fetching event details:', error)
    showToast('خطأ', 'فشل في تحميل تفاصيل الفعالية', 'error')
  } finally {
    loading.value = false
  }
}

const getTicketCount = (ticketTypeId) => {
  return selectedTickets.value[ticketTypeId] || 0
}

const incrementTicket = (ticketTypeId) => {
  const ticketType = event.value.ticket_types.find(t => t.id === ticketTypeId)
  if (ticketType && selectedTickets.value[ticketTypeId] < ticketType.available) {
    selectedTickets.value[ticketTypeId]++
  }
}

const decrementTicket = (ticketTypeId) => {
  if (selectedTickets.value[ticketTypeId] > 0) {
    selectedTickets.value[ticketTypeId]--
  }
}

const proceedToBooking = async () => {
  if (totalTickets.value === 0) {
    showToast('تحذير', 'يرجى اختيار عدد التذاكر', 'warning')
    return
  }

  bookingLoading.value = true
  try {
    const tickets = Object.keys(selectedTickets.value)
      .filter(ticketTypeId => selectedTickets.value[ticketTypeId] > 0)
      .map(ticketTypeId => ({
        ticket_type_id: parseInt(ticketTypeId),
        quantity: selectedTickets.value[ticketTypeId]
      }))

    const response = await api.post('/attendee/orders', {
      event_id: event.value.id,
      tickets: tickets
    })

    showToast('نجاح', 'تم إنشاء الطلب بنجاح', 'success')
    
    if (totalAmount.value > 0) {
      // ✅ إصلاح: تمرير orderId فقط بدون paymentUrl
      router.push({
        name: 'Payment',
        params: { 
          orderId: response.data.data.order.id
        }
      })
    } else {
      // تأكيد مباشر للفعاليات المجانية
      await api.post(`/attendee/orders/${response.data.data.order.id}/confirm-payment`)
      showToast('نجاح', 'تم الحجز بنجاح', 'success')
      router.push({ name: 'MyTickets' })
    }
  } catch (error) {
    console.error('Error creating order:', error)
    showToast('خطأ', error.response?.data?.message || 'فشل في إنشاء الطلب', 'error')
  } finally {
    bookingLoading.value = false
  }
}

const getTicketTypeText = (name) => {
  const types = {
    'regular': 'تذكرة عادية',
    'vip': 'تذكرة VIP',
    'premium': 'تذكرة بريميوم'
  }
  return types[name] || name
}

const formatPrice = (price) => {
  return price > 0 ? `${price} ر.س` : 'مجاني'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchEventDetails()
})
</script>