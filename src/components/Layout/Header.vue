<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-50 right-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- عنوان -->
        <div>
          <span class="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {{ title }}
          </span>
        </div>

        <!-- أيقونات -->
        <div class="flex items-center gap-4 relative">
          <!-- الوضع الليلي -->
          <button @click="toggleDarkMode" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl">
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <!-- البروفايل -->
          <div class="relative" v-if="!authLoading">
            <div
              @click="toggleDropdown"
              class="cursor-pointer flex items-center gap-2 select-none"
            >
              <!-- صورة البروفايل أو الحرف الأول -->
              <div class="relative">
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  class="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                  alt="صورة المستخدم"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                  :class="getUserAvatarColor(user?.name)"
                >
                  {{ getUserInitials(user?.name) }}
                </div>
              </div>
              
              <span class="hidden sm:block text-gray-700 dark:text-gray-200 font-medium">
                {{ user?.name || 'جاري التحميل...' }}
              </span>
              <i class="fas fa-caret-down text-gray-500"></i>
            </div>

            <!-- Dropdown -->
            <transition name="fade">
              <div
                v-if="dropdownOpen"
                class="absolute md:right-0 md:mt-2 md:w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-50 w-screen left-0 md:left-auto top-16 md:top-auto"
              >
                <!-- الإعدادات -->
                <button
                  @click="toggleSettingsDropdown"
                  class="w-full flex justify-between items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  الإعدادات
                  <i :class="settingsOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                </button>

                <!-- Sub-dropdown -->
                <transition name="fade">
                  <div
                    v-if="settingsOpen"
                    class="border-t border-gray-200 dark:border-gray-600"
                  >
                    <button
                      @click="openEditProfileModal"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      تعديل البيانات الشخصية
                    </button>
                    <button
                      @click="openChangePasswordModal"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      تغيير كلمة المرور
                    </button>
                  </div>
                </transition>

                <!-- تسجيل خروج -->
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  تسجيل الخروج
                </button>
              </div>
            </transition>
          </div>

          <!-- تحميل -->
          <div v-else class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span class="text-gray-500 text-sm">جاري التحميل...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تعديل البيانات الشخصية -->
    <EditProfileModal 
      v-if="showEditProfileModal"
      :user="user"
      @close="closeEditProfileModal"
      @saved="handleProfileUpdated"
    />

    <!-- مودال تغيير كلمة المرور -->
    <ChangePasswordModal 
      v-if="showChangePasswordModal"
      @close="closeChangePasswordModal"
      @saved="handlePasswordUpdated"
    />
  </header>
</template>

<script>
import { ref, onMounted, watch } from "vue"
import { useAuth } from "@/composables/useAuth"
import { useDarkMode } from '@/composables/useDarkMode'
import EditProfileModal from '@/components/Modals/EditProfileModal.vue'
import ChangePasswordModal from '@/components/Modals/ChangePasswordModal.vue'

export default {
  props: ["title"],
  components: {
    EditProfileModal,
    ChangePasswordModal
  },
  setup() {
    const { user: authUser, logout: authLogout, loading: authLoading, updateUser } = useAuth()
    const dropdownOpen = ref(false)
    const settingsOpen = ref(false)
    const showEditProfileModal = ref(false)
    const showChangePasswordModal = ref(false)
    const user = ref(null)
    const { isDark, toggleDarkMode } = useDarkMode()

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    // مراقبة تغييرات المستخدم
    watch(authUser, (newUser) => {
      user.value = newUser
    }, { immediate: true })

    // دالة لاستخراج الأحرف الأولى من الاسم
    const getUserInitials = (name) => {
      if (!name) return '?'
      
      // استخراج أول حرف من كل كلمة (الاسم الأول والأخير)
      const names = name.split(' ')
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase()
      } else {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
      }
    }

    // دالة لتحديد لون الخلفية بناءً على الاسم
    const getUserAvatarColor = (name) => {
      if (!name) return 'bg-indigo-600'
      
      // إنشاء لون ثابت بناءً على الاسم
      const colors = [
        'bg-indigo-600',
        'bg-pink-600',
        'bg-purple-600',
        'bg-blue-600',
        'bg-green-600',
        'bg-yellow-600',
        'bg-red-600',
        'bg-teal-600',
        'bg-orange-600',
        'bg-cyan-600'
      ]
      
      // استخدام الاسم لتحديد اللون بشكل ثابت
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      const index = Math.abs(hash) % colors.length
      return colors[index]
    }

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
      if (!dropdownOpen.value) settingsOpen.value = false
    }

    const toggleSettingsDropdown = () => {
      settingsOpen.value = !settingsOpen.value
    }

    const openEditProfileModal = () => {
      showEditProfileModal.value = true
      dropdownOpen.value = false
      settingsOpen.value = false
    }

    const openChangePasswordModal = () => {
      showChangePasswordModal.value = true
      dropdownOpen.value = false
      settingsOpen.value = false
    }

    const closeEditProfileModal = () => {
      showEditProfileModal.value = false
    }

    const closeChangePasswordModal = () => {
      showChangePasswordModal.value = false
    }

    const handleProfileUpdated = (updatedUser) => {
      updateUser(updatedUser)
      showEditProfileModal.value = false
    }

    const handlePasswordUpdated = () => {
      showChangePasswordModal.value = false
    }

    const logout = () => {
      authLogout()
      dropdownOpen.value = false
      settingsOpen.value = false
    }

    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.relative')
      if (dropdown && !dropdown.contains(event.target)) {
        dropdownOpen.value = false
        settingsOpen.value = false
      }
    }

    return { 
      logout, 
      dropdownOpen, 
      settingsOpen, 
      toggleDropdown, 
      toggleSettingsDropdown, 
      isDark, 
      toggleDarkMode, 
      user,
      authLoading,
      showEditProfileModal,
      showChangePasswordModal,
      openEditProfileModal,
      openChangePasswordModal,
      closeEditProfileModal,
      closeChangePasswordModal,
      handleProfileUpdated,
      handlePasswordUpdated,
      getUserInitials,
      getUserAvatarColor
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .fade-enter-from,
  .fade-leave-to {
    transform: translateY(-20px);
  }
}

/* تأثيرات إضافية للصورة */
.avatar-container {
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}
</style>