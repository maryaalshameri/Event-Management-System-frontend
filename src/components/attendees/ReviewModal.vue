<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl">
      <!-- الرأس -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600">
        <div class="flex items-center">
          <div class="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg ml-3">
            <i class="fas fa-star text-amber-600 dark:text-amber-400"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">تقييم الفعالية</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ event?.title }}</p>
          </div>
        </div>
      </div>

      <!-- المحتوى -->
      <div class="p-6">
        <!-- النجوم -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            كيف كانت تجربتك في الفعالية؟
          </label>
          <div class="flex justify-center space-x-1 space-x-reverse mb-3">
            <button
              v-for="star in 5"
              :key="star"
              @click="rating = star"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
              class="text-3xl transition-transform duration-200 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full p-1"
              :class="[
                star <= (hoverRating || rating) 
                  ? 'text-amber-500' 
                  : 'text-gray-300 dark:text-gray-600',
                star === rating ? 'scale-110' : ''
              ]"
            >
              ★
            </button>
          </div>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ getRatingText(rating) }}
          </p>
        </div>

        <!-- التعليق -->
        <div class="mb-2">
          <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            التعليق (اختياري)
          </label>
          <textarea
            id="comment"
            v-model="comment"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            placeholder="شاركنا بتجربتك في الفعالية..."
            :disabled="submitting"
          ></textarea>
        </div>
      </div>

      <!-- الأزرار -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3 space-x-reverse gap-3">
        <button
          @click="close"
          :disabled="submitting"
          class="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center"
        >
          <i class="fas fa-times ml-2"></i>
          إلغاء
        </button>
        <button
          @click="submitReview"
          :disabled="!rating || submitting"
          class="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <i v-if="submitting" class="fas fa-spinner fa-spin ml-2"></i>
          <i v-else class="fas fa-paper-plane ml-2"></i>
          <span>{{ submitting ? 'جاري الإرسال...' : 'إرسال التقييم' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const props = defineProps({
  show: Boolean,
  event: Object
})

const emit = defineEmits(['close', 'submitted'])

const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')
const submitting = ref(false)

// إعادة تعيين النموذج عند فتح المودال
watch(() => props.show, (newVal) => {
  if (newVal) {
    rating.value = 0
    hoverRating.value = 0
    comment.value = ''
    submitting.value = false
    console.log('Review modal opened for event:', props.event)
  }
})

// دالة للحصول على نص التقييم
const getRatingText = (rating) => {
  const texts = {
    0: 'اختر تقييمك',
    1: 'سيء',
    2: 'مقبول', 
    3: 'جيد',
    4: 'جيد جداً',
    5: 'ممتاز'
  }
  return texts[rating] || `${rating} من 5 نجوم`
}

const close = () => {
  if (!submitting.value) {
    emit('close')
  }
}

const submitReview = async () => {
  if (!rating.value) {
    showToast('تحذير', 'يرجى اختيار تقييم', 'warning')
    return
  }

  if (!props.event?.id) {
    showToast('خطأ', 'لا يمكن إرسال التقييم لهذه الفعالية', 'error')
    return
  }

  submitting.value = true

  try {
    console.log('Submitting review for event:', props.event.id)
    
    const response = await api.post('/attendee/reviews', {
      event_id: props.event.id,
      rating: rating.value,
      comment: comment.value
    })

    console.log('Review submitted successfully:', response.data)
    showToast('نجاح', 'تم إضافة التقييم بنجاح', 'success')
    emit('submitted')
    close()
  } catch (error) {
    console.error('Error submitting review:', error)
    
    let errorMessage = 'فشل في إضافة التقييم'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 422) {
      errorMessage = 'بيانات التقييم غير صالحة'
    } else if (error.response?.status === 409) {
      errorMessage = 'لقد قمت بتقييم هذه الفعالية مسبقاً'
    }
    
    showToast('خطأ', errorMessage, 'error')
  } finally {
    submitting.value = false
  }
}
</script>