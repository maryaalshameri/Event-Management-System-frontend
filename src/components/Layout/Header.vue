<template>
 <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full z-50 right-0 transition-all duration-500">    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center">
        <!-- العنوان والمسار -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- زر القائمة للموبايل -->
          <button @click="toggleSidebar" class="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl">
            <i class="fas fa-bars"></i>
          </button>
          
          <!-- العنوان -->
          <div class="flex flex-col">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {{ title }}
            </h1>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <i class="fas fa-home ml-1 text-xs"></i>
              <span>لوحة التحكم</span>
              <i class="fas fa-chevron-left mx-2 text-xs"></i>
              <span class="text-gray-700 dark:text-gray-300">{{ title }}</span>
            </div>
          </div>
        </div>

        <!-- أيقونات -->
        <div class="flex items-center gap-6">
          <!-- البحث -->
          <div class="relative hidden md:block">
            <div class="input-container-glow group">
              <i class="fas fa-search input-icon group-focus-within:text-purple-500"></i>
              <input
                type="text"
                placeholder="بحث..."
                class="input-field-search"
                v-model="searchQuery"
              >
              <div class="glow-effect"></div>
            </div>
          </div>

          <!-- الإشعارات -->
          <div class="relative">
            <button 
              @click="toggleNotifications"
              class="header-icon-btn relative"
              :class="{ 'header-icon-btn-active': notificationsOpen }"
            >
              <i class="fas fa-bell"></i>
              <span v-if="unreadNotifications > 0" class="notification-badge">
                {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
              </span>
            </button>

            <!-- قائمة الإشعارات -->
            <transition name="fade-scale">
              <div 
                v-if="notificationsOpen"
                class="notifications-dropdown"
              >
                <div class="notifications-header">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">الإشعارات</h3>
                  <button class="text-sm text-purple-600 hover:text-purple-700">تعيين الكل كمقروء</button>
                </div>
                
                <div class="notifications-list">
                  <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    class="notification-item"
                    :class="{ 'unread': !notification.read }"
                  >
                    <div class="notification-icon">
                      <i :class="notification.icon" class="text-white"></i>
                    </div>
                    <div class="notification-content">
                      <p class="notification-text">{{ notification.message }}</p>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="notifications-footer">
                  <button class="view-all-btn">عرض جميع الإشعارات</button>
                </div>
              </div>
            </transition>
          </div>

          <!-- الوضع الليلي -->
          <button 
            @click="toggleDarkMode" 
            class="header-icon-btn"
            :class="{ 'header-icon-btn-active': isDark }"
          >
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <!-- البروفايل -->
          <div class="relative">
            <button
              @click="toggleProfileDropdown"
              class="profile-btn group"
              :class="{ 'profile-btn-active': profileDropdownOpen }"
            >
              <div class="avatar-container">
                <img
                  v-if="user?.avatar"
                   :src="`http://127.0.0.1:8000/storage/${user.avatar}`"
                  class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-lg"
                  alt="صورة المستخدم"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  :class="getUserAvatarColor(user?.name)"
                >
                  {{ getUserInitials(user?.name) }}
                </div>
              </div>
              
              <div class="profile-info">
                <span class="profile-name">{{ user?.name || 'جاري التحميل...' }}</span>
                <span class="profile-role"> {{ user?.role }}</span>
              </div>
              
              <i class="fas fa-chevron-down profile-arrow transition-transform duration-300"></i>
            </button>

            <!-- Dropdown -->
            <transition name="fade-scale">
              <div
                v-if="profileDropdownOpen"
                class="profile-dropdown"
              >
                <!-- رأس البروفايل -->
                <div class="profile-dropdown-header">
                  <div class="flex items-center space-x-3 space-x-reverse gap-3">
                    <div class="avatar-container">
                      <img
                        v-if="user?.avatar"
                        :src="user.avatar"
                        class="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-lg"
                        alt="صورة المستخدم"
                      />
                      <div
                        v-else
                        class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        :class="getUserAvatarColor(user?.name)"
                      >
                        {{ getUserInitials(user?.name) }}
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 dark:text-white">{{ user?.name }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">مدير النظام</p>
                    </div>
                  </div>
                </div>

                <!-- القائمة -->
                <div class="profile-dropdown-menu">
                  <button @click="openEditProfileModal" class="dropdown-item">
                    <i class="fas fa-user-edit dropdown-icon ml-3"></i>
                    <span>تعديل الملف الشخصي</span>
                  </button>
                  
                  <button @click="openChangePasswordModal" class="dropdown-item">
                    <i class="fas fa-lock dropdown-icon ml-3"></i>
                    <span>تغيير كلمة المرور</span>
                  </button>
                  
                  <button class="dropdown-item">
                    <i class="fas fa-cog dropdown-icon ml-3"></i>
                    <span>الإعدادات</span>
                  </button>
                  
                  <div class="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                  
                  <button @click="logout" class="dropdown-item text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <i class="fas fa-sign-out-alt dropdown-icon ml-3"></i>
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- المودالات -->

  </header>


   <EditProfileModal 
    v-if="showEditProfileModal"
    :user="user"
    @close="closeEditProfileModal"
    @saved="handleProfileUpdated"
  />

  <ChangePasswordModal 
    v-if="showChangePasswordModal"
    @close="closeChangePasswordModal"
    @saved="handlePasswordUpdated"
  />
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
    const { isDark, toggleDarkMode } = useDarkMode()
    
    const searchQuery = ref('')
    const notificationsOpen = ref(false)
    const profileDropdownOpen = ref(false)
    const showEditProfileModal = ref(false)
    const showChangePasswordModal = ref(false)
    const user = ref(null)

    // بيانات الإشعارات
    const notifications = ref([
      { id: 1, message: 'مستخدم جديد قام بالتسجيل', time: 'منذ 5 دقائق', read: false, icon: 'fas fa-user-plus' },
      { id: 2, message: 'تم إنشاء فعالية جديدة', time: 'منذ ساعة', read: false, icon: 'fas fa-calendar-plus' },
      { id: 3, message: 'طلب جديد يحتاج للموافقة', time: 'منذ 3 ساعات', read: true, icon: 'fas fa-shopping-cart' },
      { id: 4, message: 'تقرير المبيعات جاهز', time: 'منذ يوم', read: true, icon: 'fas fa-chart-bar' }
    ])

    const unreadNotifications = ref(2)

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.body.classList.remove('modal-open')
    })

    watch(authUser, (newUser) => {
      user.value = newUser
    }, { immediate: true })



    watch([showEditProfileModal, showChangePasswordModal], ([editOpen, passwordOpen]) => {
  if (editOpen || passwordOpen) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})



    const getUserInitials = (name) => {
      if (!name) return '?'
      const names = name.split(' ')
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase()
      } else {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
      }
    }

    const getUserAvatarColor = (name) => {
      if (!name) return 'bg-gradient-to-r from-purple-500 to-blue-500'
      const colors = [
        'bg-gradient-to-r from-purple-500 to-blue-500',
        'bg-gradient-to-r from-pink-500 to-rose-500',
        'bg-gradient-to-r from-green-500 to-teal-500',
        'bg-gradient-to-r from-orange-500 to-red-500',
        'bg-gradient-to-r from-indigo-500 to-purple-500'
      ]
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      const index = Math.abs(hash) % colors.length
      return colors[index]
    }

    const toggleNotifications = () => {
      notificationsOpen.value = !notificationsOpen.value
      if (notificationsOpen.value) profileDropdownOpen.value = false
    }

    const toggleProfileDropdown = () => {
      profileDropdownOpen.value = !profileDropdownOpen.value
      if (profileDropdownOpen.value) notificationsOpen.value = false
    }

    const toggleSidebar = () => {
      // إضافة دالة لتبديل السايدبار للموبايل
      emit('toggle-sidebar')
    }

    const openEditProfileModal = () => {
      showEditProfileModal.value = true
      profileDropdownOpen.value = false
    }

    const openChangePasswordModal = () => {
      showChangePasswordModal.value = true
      profileDropdownOpen.value = false
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
      profileDropdownOpen.value = false
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        notificationsOpen.value = false
        profileDropdownOpen.value = false
      }
    }

    return { 
      searchQuery,
      notificationsOpen,
      profileDropdownOpen,
      showEditProfileModal,
      showChangePasswordModal,
      isDark,
      toggleDarkMode,
      user,
      authLoading,
      notifications,
      unreadNotifications,
      toggleNotifications,
      toggleProfileDropdown,
      toggleSidebar,
      openEditProfileModal,
      openChangePasswordModal,
      closeEditProfileModal,
      closeChangePasswordModal,
      handleProfileUpdated,
      handlePasswordUpdated,
      logout,
      getUserInitials,
      getUserAvatarColor
    }
  }
}
</script>

<style scoped>
/* أنيميشن مخصص */
@keyframes fade-scale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fade-scale-enter-active {
  animation: fade-scale 0.2s ease-out;
}

.fade-scale-leave-active {
  animation: fade-scale 0.15s ease-in reverse;
}

/* أنماط الهيدر */

</style>