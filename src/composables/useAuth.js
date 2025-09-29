import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '@/services/api'

export function useAuth() {
  const router = useRouter()
  const store = useStore()
  const user = ref(null)
  const loading = ref(true)

  onMounted(async () => {
    await loadUserData()
  })

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/me')
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await store.dispatch('logout')
      user.value = null
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return {
    user,
    loading,
    logout,
    updateUser,
    loadUserData
  }
}