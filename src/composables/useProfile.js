import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

export function useProfile() {
  const loading = ref(false)
  const errors = ref({})

const updateProfile = async (formData) => {
  loading.value = true
  errors.value = {}
  
  try {
    console.log('Sending form data to server...')
    
    const response = await api.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('Server response:', response.data) // أضف هذا السطر
    
    showToast('نجاح', 'تم تحديث الملف الشخصي بنجاح', 'success')
    return response.data
  } catch (error) {
    console.error('Update profile error:', error)
    console.error('Error response:', error.response) // أضف هذا
    
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
      showToast('خطأ', 'يوجد أخطاء في البيانات المدخلة', 'error')
    } else if (error.response?.data?.message) {
      showToast('خطأ', error.response.data.message, 'error')
    } else {
      showToast('خطأ', 'فشل في تحديث الملف الشخصي', 'error')
    }
    throw error
  } finally {
    loading.value = false
  }
}

  const updatePassword = async (passwordData) => {
    loading.value = true
    errors.value = {}
    
    try {
      const response = await api.put('/password', passwordData)
      showToast('نجاح', 'تم تحديث كلمة المرور بنجاح', 'success')
      return response.data
    } catch (error) {
      console.error('Update password error:', error.response?.data)
      
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        showToast('خطأ', error.response.data.message, 'error')
      } else {
        showToast('خطأ', 'فشل في تحديث كلمة المرور', 'error')
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errors,
    updateProfile,
    updatePassword
  }
}