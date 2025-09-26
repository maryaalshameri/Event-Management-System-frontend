import { ref, onMounted, watch } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  onMounted(() => {
    // التحقق من الإعدادات المحفوظة أو تفضيل النظام
    const saved = localStorage.getItem('darkMode')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = saved ? JSON.parse(saved) : systemPrefersDark
    updateDarkMode()
  })

  watch(isDark, (newVal) => {
    localStorage.setItem('darkMode', JSON.stringify(newVal))
    updateDarkMode()
  })

  function toggleDarkMode() {
    isDark.value = !isDark.value
  }

  function updateDarkMode() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    toggleDarkMode
  }
}