<template>
  <Modal :show="show" @close="close">
    <div class="p-6 max-h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ isEdit ? 'تعديل الفعالية' : 'إنشاء فعالية جديدة' }}
        </h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- عرض الأخطاء -->
      <div v-if="errors.length > 0" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <ul class="list-disc list-inside">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- العنوان -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">عنوان الفعالية</label>
          <input
            type="text"
            id="title"
            v-model="form.title"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <!-- الوصف -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          ></textarea>
        </div>

        <!-- التاريخ والوقت -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ البداية</label>
            <input
              type="datetime-local"
              id="start_date"
              v-model="form.start_date"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ النهاية</label>
            <input
              type="datetime-local"
              id="end_date"
              v-model="form.end_date"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        <!-- الموقع والإحداثيات -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">الموقع</label>
            <input
              type="text"
              id="location"
              v-model="form.location"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label for="capacity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">السعة الإجمالية</label>
            <input
              type="number"
              id="capacity"
              :value="calculateTotalCapacity()"
              disabled
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-white cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">يتم حساب السعة تلقائياً من مجموع التذاكر</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="latitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300">خط العرض (اختياري)</label>
            <input
              type="number"
              step="any"
              id="latitude"
              v-model="form.latitude"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label for="longitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300">خط الطول (اختياري)</label>
            <input
              type="number"
              step="any"
              id="longitude"
              v-model="form.longitude"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <!-- الفئة والسعر -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">الفئة</label>
            <select
              id="category"
              v-model="form.category"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">اختر الفئة</option>
              <option value="festival">موسيقى</option>
              <option value="sports">رياضة</option>
              <option value="conference">مؤتمر</option>
              <option value="workshop">ورشة عمل</option>
              <option value="concert">معرض</option>
            </select>
          </div>
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">السعر الأساسي</label>
            <input
              type="number"
              id="price"
              v-model="form.price"
              min="0"
              step="0.01"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        <!-- الصورة -->
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300">صورة الفعالية</label>
          <input
            type="file"
            id="image"
            ref="imageInput"
            @change="handleImageUpload"
            accept="image/*"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" class="h-32 object-cover rounded" />
          </div>
        </div>

        <!-- أنواع التذاكر -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">أنواع التذاكر</label>
          
          <!-- تذكرة Regular -->
          <div class="border rounded-lg p-3 mb-2 dark:border-gray-600">
            <h4 class="font-medium mb-2">تذكرة عادية (Regular)</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">السعر</label>
                <input
                  v-model="form.ticket_types[0].price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">الكمية</label>
                <input
                  v-model="form.ticket_types[0].quantity"
                  type="number"
                  min="1"
                  @input="updateCapacity"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">الوصف</label>
                <input
                  v-model="form.ticket_types[0].description"
                  type="text"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="وصف التذكرة العادية"
                />
              </div>
            </div>
          </div>

          <!-- تذكرة VIP -->
          <div class="border rounded-lg p-3 mb-2 dark:border-gray-600">
            <h4 class="font-medium mb-2">تذكرة VIP</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">السعر</label>
                <input
                  v-model="form.ticket_types[1].price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">الكمية</label>
                <input
                  v-model="form.ticket_types[1].quantity"
                  type="number"
                  min="1"
                  @input="updateCapacity"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">الوصف</label>
                <input
                  v-model="form.ticket_types[1].description"
                  type="text"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="وصف تذكرة VIP"
                />
              </div>
            </div>
          </div>

          <!-- تذكرة Premium -->
          <div class="border rounded-lg p-3 mb-2 dark:border-gray-600">
            <h4 class="font-medium mb-2">تذكرة Premium</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">السعر</label>
                <input
                  v-model="form.ticket_types[2].price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">الكمية</label>
                <input
                  v-model="form.ticket_types[2].quantity"
                  type="number"
                  min="1"
                  @input="updateCapacity"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">الوصف</label>
                <input
                  v-model="form.ticket_types[2].description"
                  type="text"
                  class="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="وصف تذكرة Premium"
                />
              </div>
            </div>
          </div>

          <!-- عرض السعة التلقائية -->
          <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p class="text-sm">السعة الإجمالية: <strong>{{ calculateTotalCapacity() }}</strong> مقعد</p>
          </div>
        </div>

        <!-- حالة الفعالية (للتعديل فقط) -->
        <div v-if="isEdit">
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">الحالة</label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
            <option value="cancelled">ملغي</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="flex justify-end space-x-2 space-x-reverse pt-4 gap-4">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="submitting">
              <i class="fas fa-spinner fa-spin ml-1"></i> جاري الحفظ...
            </span>
            <span v-else>
              <i class="fas fa-save ml-1"></i> {{ isEdit ? 'تحديث' : 'إنشاء' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'
import Modal from '@/components/Shared/Modal.vue'

const props = defineProps({
  show: Boolean,
  event: Object
})

const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.event)
const submitting = ref(false)
const imageInput = ref(null)
const imagePreview = ref('')
const errors = ref([])

const form = ref({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  latitude: '',
  longitude: '',
  capacity: 0,
  category: '',
  price: 0,
  image: null,
  ticket_types: [
    { name: 'regular', price: 0, quantity: 1, description: 'تذكرة عادية' },
    { name: 'vip', price: 0, quantity: 1, description: 'تذكرة VIP' },
    { name: 'premium', price: 0, quantity: 1, description: 'تذكرة Premium' }
  ],
  status: 'draft'
})

// دالة الإغلاق المعدلة
const close = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    latitude: '',
    longitude: '',
    capacity: 0,
    category: '',
    price: 0,
    image: null,
    ticket_types: [
      { name: 'regular', price: 0, quantity: 1, description: 'تذكرة عادية' },
      { name: 'vip', price: 0, quantity: 1, description: 'تذكرة VIP' },
      { name: 'premium', price: 0, quantity: 1, description: 'تذكرة Premium' }
    ],
    status: 'draft'
  }
  imagePreview.value = ''
  errors.value = []
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const calculateTotalCapacity = () => {
  const total = form.value.ticket_types.reduce((total, ticket) => {
    return total + (parseInt(ticket.quantity) || 0)
  }, 0)
  
  form.value.capacity = total
  return total
}

const updateCapacity = () => {
  calculateTotalCapacity()
}

const formatFormData = () => {
  const formData = new FormData()
  
  calculateTotalCapacity()
  
  // إضافة الحقول الأساسية
  const fields = [
    'title', 'description', 'start_date', 'end_date', 'location',
    'latitude', 'longitude', 'capacity', 'category', 'price', 'status'
  ]
  
  fields.forEach(field => {
    if (form.value[field] !== null && form.value[field] !== undefined) {
      formData.append(field, form.value[field])
    }
  })
  
  // إضافة أنواع التذاكر
  form.value.ticket_types.forEach((ticket, index) => {
    formData.append(`ticket_types[${index}][name]`, ticket.name)
    formData.append(`ticket_types[${index}][price]`, ticket.price)
    formData.append(`ticket_types[${index}][quantity]`, ticket.quantity)
    formData.append(`ticket_types[${index}][description]`, ticket.description || '')
  })
  
  // إضافة الصورة
  if (form.value.image && typeof form.value.image !== 'string') {
    formData.append('image', form.value.image)
  }
  
  return formData
}

const submitForm = async () => {
  submitting.value = true
  errors.value = []
  
  try {
    calculateTotalCapacity()
    
    let response
    
    if (isEdit.value) {
      // ✅ للتعديل: استخدام JSON
      const requestData = {
        title: form.value.title,
        description: form.value.description,
        start_date: form.value.start_date,
        end_date: form.value.end_date,
        location: form.value.location,
        latitude: form.value.latitude || null,
        longitude: form.value.longitude || null,
        capacity: form.value.capacity,
        category: form.value.category,
        price: parseFloat(form.value.price),
        status: form.value.status,
        ticket_types: form.value.ticket_types.map(ticket => ({
          name: ticket.name,
          price: parseFloat(ticket.price),
          quantity: parseInt(ticket.quantity),
          description: ticket.description
        }))
      }

      console.log('📤 البيانات المرسلة للتعديل (JSON):', requestData)

      response = await api.put(`/organizer/events/${props.event.id}`, requestData, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
    } else {
      // ✅ للإضافة: استخدام FormData
      const formData = new FormData()
      
      // إضافة الحقول الأساسية
      const fields = [
        'title', 'description', 'start_date', 'end_date', 'location',
        'latitude', 'longitude', 'capacity', 'category', 'price', 'status'
      ]
      
      fields.forEach(field => {
        if (form.value[field] !== null && form.value[field] !== undefined) {
          formData.append(field, form.value[field])
        }
      })
      
      // إضافة أنواع التذاكر
      form.value.ticket_types.forEach((ticket, index) => {
        formData.append(`ticket_types[${index}][name]`, ticket.name)
        formData.append(`ticket_types[${index}][price]`, ticket.price)
        formData.append(`ticket_types[${index}][quantity]`, ticket.quantity)
        formData.append(`ticket_types[${index}][description]`, ticket.description || '')
      })
      
      // إضافة الصورة
      if (form.value.image && typeof form.value.image !== 'string') {
        formData.append('image', form.value.image)
      }
      
      console.log('📤 البيانات المرسلة للإضافة (FormData):')
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      response = await api.post('/organizer/events', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    console.log('📥 الاستجابة من السيرفر:', response.data)
    showToast('نجاح', `تم ${isEdit.value ? 'تحديث' : 'إنشاء'} الفعالية بنجاح`, 'success')
    emit('saved')
    close()
  } catch (error) {
    console.error('❌ Error saving event:', error)
    
    if (error.response) {
      console.error('📋 تفاصيل الخطأ:', error.response.data)
      console.error('🧾 حالة الخطأ:', error.response.status)
    }
    
    if (error.response?.status === 422) {
      errors.value = []
      if (error.response.data.errors) {
        Object.keys(error.response.data.errors).forEach(field => {
          error.response.data.errors[field].forEach(message => {
            errors.value.push(message)
          })
        })
      }
      showToast('خطأ في التحقق', 'يرجى مراجعة البيانات المدخلة', 'error')
    } else {
      errors.value = ['حدث خطأ في الاتصال بالخادم']
      showToast('خطأ', `فشل في ${isEdit.value ? 'تحديث' : 'إنشاء'} الفعالية`, 'error')
    }
  } finally {
    submitting.value = false
  }
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

// مراقبة التغييرات في الـ props
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await nextTick() // الانتظار حتى يتم تحديث الـ DOM
    
    if (props.event) {
      // ملء النموذج ببيانات الفعالية للتعديل
      Object.keys(form.value).forEach(key => {
        if (props.event[key] !== undefined && props.event[key] !== null) {
          if (key === 'ticket_types' && Array.isArray(props.event[key])) {
            // تحديث أنواع التذاكر
            props.event[key].forEach((ticket, index) => {
              if (form.value.ticket_types[index]) {
                form.value.ticket_types[index] = {
                  ...form.value.ticket_types[index],
                  price: ticket.price,
                  quantity: ticket.quantity,
                  description: ticket.description || form.value.ticket_types[index].description
                }
              }
            })
          } else {
            form.value[key] = props.event[key]
          }
        }
      })
      
      // تحديث التواريخ
      if (props.event.start_date) {
        form.value.start_date = formatDateForInput(props.event.start_date)
      }
      if (props.event.end_date) {
        form.value.end_date = formatDateForInput(props.event.end_date)
      }
      
      // عرض الصورة إذا وجدت
      if (props.event.image) {
        imagePreview.value = props.event.image
        form.value.image = props.event.image // الحفاظ على الصورة الحالية
      }
      
      calculateTotalCapacity()
    }
  }
})
</script>