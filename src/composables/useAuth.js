// src/composables/useAuth.js
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

export function useAuth() {
  const store = useStore()
  const router = useRouter()
  const loading = ref(false)
  const error = ref('')

  // معلومات المستخدم
  const user = ref(null)

  // جلب بيانات المستخدم من API باستخدام التوكن
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/v1/me') // تأكد من endpoint المستخدم
      user.value = response.data
    } catch (err) {
      console.error('Failed to fetch user:', err)
      user.value = null
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = ''
    try {
      await store.dispatch('logout')
      user.value = null
      router.push('/')
    } catch (e) {
      error.value = 'حدث خطأ أثناء تسجيل الخروج'
    } finally {
      loading.value = false
    }
  }

  // جلب بيانات المستخدم عند تحميل composable
  onMounted(() => {
    fetchUser()
  })

  return { logout, loading, error, user, fetchUser }
}
