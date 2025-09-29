<template>
  <Modal :show="true" @close="$emit('close')" max-width="md">
    <div class="p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ user.id ? 'تعديل المستخدم' : 'إضافة مستخدم جديد' }}
      </h2>

      <form @submit.prevent="saveUser">
        <div class="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الاسم الكامل
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رقم الهاتف
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone[0] }}</p>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الدور
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="attendee">حضور</option>
              <option value="organizer">منظم</option>
              <option value="admin">مدير</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role[0] }}</p>
          </div>

          <!-- إضافة حقل تأكيد كلمة المرور فقط عند إنشاء مستخدم جديد -->
          <div v-if="!user.id">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كلمة المرور
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
            </div>

            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation[0] }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 space-x-reverse gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"
          >
            {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import api from '@/services/api'
import Modal from '@/components/Shared/Modal.vue'

export default {
  components: { Modal },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      role: 'attendee',
      password: '',
      password_confirmation: ''
    })

    const errors = ref({})
    const saving = ref(false)

    watch(() => props.user, (newUser) => {
      if (newUser && newUser.id) {
        form.name = newUser.name || ''
        form.email = newUser.email || ''
        form.phone = newUser.phone || ''
        form.role = newUser.role || 'attendee'
        form.password = ''
        form.password_confirmation = ''
      } else {
        Object.assign(form, {
          name: '',
          email: '',
          phone: '',
          role: 'attendee',
          password: '',
          password_confirmation: ''
        })
      }
      errors.value = {}
    }, { immediate: true })

    const saveUser = async () => {
      saving.value = true
      errors.value = {}

      try {
        // التحقق من تطابق كلمة المرور عند الإنشاء
        if (!props.user.id && form.password !== form.password_confirmation) {
          errors.value = { password: ['كلمة المرور وتأكيدها غير متطابقين'] }
          saving.value = false
          return
        }

        let data = { ...form }

        // إذا كان تعديلاً، لا نرسل كلمة المرور إذا كانت فارغة
        if (props.user.id) {
          if (!data.password) {
            delete data.password
            delete data.password_confirmation
          }
        }

        let response
        if (props.user.id) {
          response = await api.put(`/admin/users/${props.user.id}`, data)
        } else {
          response = await api.post('/admin/users', data)
        }

        emit('saved', props.user.id ? 'تم تحديث المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors
        } else {
          console.error('Error saving user:', error)
          errors.value = { general: ['حدث خطأ أثناء حفظ المستخدم'] }
        }
      } finally {
        saving.value = false
      }
    }

    return {
      form,
      errors,
      saving,
      saveUser
    }
  }
}
</script>