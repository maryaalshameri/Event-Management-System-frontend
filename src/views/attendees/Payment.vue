<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
    <div class="container mx-auto px-4 py-8">

        
      <div class="max-w-2xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">إتمام عملية الدفع</h1>
          
          <div v-if="loading" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
            <p class="mt-4 text-gray-600">جاري تحميل معلومات الدفع...</p>
          </div>

          <div v-else-if="order" class="space-y-6">
            <!-- معلومات الطلب -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4">معلومات الطلب</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">رقم الطلب</p>
                  <p class="font-medium">#{{ order.id }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">المجموع</p>
                  <p class="font-medium text-green-600">{{ order.total_amount }} ر.س</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">الفعالية</p>
                  <p class="font-medium">{{ order.event.title }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">التاريخ</p>
                  <p class="font-medium">{{ formatDate(order.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- طرق الدفع -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4">اختر طريقة الدفع</h3>
              
              <div class="space-y-3">
                <div v-for="method in paymentMethods" :key="method.id"
                     class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                     :class="selectedMethod === method.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900' : ''"
                     @click="selectedMethod = method.id">
                  <input type="radio" :id="method.id" :value="method.id" v-model="selectedMethod" class="hidden">
                 <i :class="[method.icon, 'text-lg ml-3', method.color]"></i>

                  <div>
                    <p class="font-medium">{{ method.name }}</p>
                    <p class="text-sm text-gray-500">{{ method.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- تفاصيل التذاكر -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4">التذاكر المطلوبة</h3>
              <div v-for="item in order.order_items" :key="item.id" class="flex justify-between items-center py-2">
                <div>
                  <p class="font-medium capitalize">{{ getTicketTypeText(item.ticket_type.name) }}</p>
                  <p class="text-sm text-gray-500">الكمية: {{ item.quantity }}</p>
                </div>
                <p class="font-medium">{{ item.price * item.quantity }} ر.س</p>
              </div>
              <div class="border-t pt-2 mt-2">
                <div class="flex justify-between font-bold">
                  <span>المجموع النهائي</span>
                  <span class="text-green-600">{{ order.total_amount }} ر.س</span>
                </div>
              </div>
            </div>

            <!-- أزرار الإجراء -->
            <div class="flex space-x-4 space-x-reverse gap-3">
              <button
                @click="cancelPayment"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                إلغاء الطلب
              </button>
              <button
                @click="processPayment"
                :disabled="processing"
                class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <i v-if="processing" class="fas fa-spinner fa-spin ml-2"></i>
                <i v-else class="fas fa-lock ml-2"></i>
                تأكيد الدفع
              </button>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-3xl text-yellow-500 mb-4"></i>
            <p class="text-gray-600 dark:text-gray-400">لم يتم العثور على الطلب</p>
            <router-link to="/events" class="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
              العودة إلى الفعاليات
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)
const processing = ref(false)
const selectedMethod = ref('credit_card')

const paymentMethods = [
  {
    id: 'credit_card',
    name: 'البطاقة الائتمانية',
    description: 'دفع آمن عبر البطاقة الائتمانية',
    icon: 'fas fa-credit-card',
    color: 'text-blue-500'
  },
  {
    id: 'mada',
    name: 'مدى',
    description: 'الدفع عبر مدى',
    icon: 'fas fa-credit-card',
    color: 'text-green-500'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'الدفع عبر Apple Pay',
    icon: 'fab fa-apple',
    color: 'text-gray-800'
  }
]

onMounted(() => {
  fetchOrderDetails()
})

// في الـ script section
const fetchOrderDetails = async () => {
  loading.value = true
  try {
    // ✅ استخدام المسار الجديد
    const response = await api.get(`/payment/order/${route.params.orderId}`)
    order.value = response.data.data.order
  } catch (error) {
    console.error('Error fetching order details:', error)
    showToast('خطأ', 'فشل في تحميل معلومات الطلب', 'error')
    router.push({ name: 'EventsList' }) // العودة للفعاليات في حالة الخطأ
  } finally {
    loading.value = false
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
      // توجيه إلى صفحة الدفع مع orderId فقط
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
const processPayment = async () => {
  processing.value = true
  try {
    const response = await api.post(`/payment/process/${route.params.orderId}`)
    
    // ✅ تحقق من الاستجابة مباشرة
    if (response.data.success) {
      if (response.data.data.next_step === 'redirect_to_payment_gateway') {
        // ✅ محاكاة عملية الدفع ثم التأكيد مباشرة
        showToast('معلومة', 'جاري معالجة الدفع...', 'info')
        
        // محاكاة انتظار عملية الدفع (2 ثانية)
        setTimeout(async () => {
          await confirmPayment()
        }, 2000)
      } else {
        // ✅ إذا كان مجاني أو تم الدفع مباشرة
        await confirmPayment()
      }
    } else {
      throw new Error(response.data.message || 'فشل في معالجة الدفع')
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    showToast('خطأ', error.response?.data?.message || 'فشل في عملية الدفع', 'error')
  } finally {
    processing.value = false
  }
}

const confirmPayment = async () => {
  try {
    const response = await api.get(`/payment/success/${route.params.orderId}`)
    
    if (response.data.success) {
      showToast('نجاح', 'تم الدفع وإنشاء التذاكر بنجاح', 'success')
      
      // ✅ الانتقال إلى صفحة التذاكر بعد تأكيد النجاح
      setTimeout(() => {
        router.push({ 
          name: 'MyTickets',
          query: { 
            payment: 'success', 
            orderId: route.params.orderId 
          }
        })
      }, 1500)
    } else {
      throw new Error(response.data.message || 'فشل في تأكيد الدفع')
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    showToast('خطأ', error.response?.data?.message || 'فشل في تأكيد الدفع وإنشاء التذاكر', 'error')
  }
}

const cancelPayment = async () => {
  try {
    const response = await api.post(`/payment/cancel/${route.params.orderId}`)
    
    // ✅ أي استجابة بدون error تعتبر نجاح
    const successMessage = response.data?.message || 'تم إلغاء الطلب بنجاح'
    showToast('تم', successMessage, 'success')
    
  } catch (error) {
    console.error('Error canceling payment:', error)
    
    // ✅ حتى في حالة الخطأ، قد يكون الطلب قد ألغي
    const errorMessage = error.response?.data?.message || 'فشل في إلغاء الطلب'
    showToast('تنبيه', errorMessage, 'warning')
  }
  
  // ✅ الانتقال في كل الحالات بعد المحاولة
  setTimeout(() => {
    router.push({ name: 'EventsList' })
  }, 1500)
}


const getTicketTypeText = (name) => {
  const types = {
    'regular': 'عادية',
    'vip': 'VIP',
    'premium': 'بريميوم'
  }
  return types[name] || name
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}



</script>