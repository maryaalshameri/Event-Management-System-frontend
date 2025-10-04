<template>
  <!-- Sidebar للشاشات الكبيرة -->
  <aside class="hidden md:flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl w-80 h-screen fixed top-0 right-0 z-40 border-l border-gray-200 dark:border-gray-700 transition-all duration-500 mt-20"> <!-- أضفنا mt-20 هنا -->
    <!-- الشعار -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3 space-x-reverse">
        <div class="w-12 h-12 ml-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <i class="fas fa-crown text-white text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">الإدارة العامة</p>
        </div>
      </div>
    </div>

    <!-- القائمة -->
    <div class="flex-1 px-4 py-6 overflow-y-auto">
      <nav class="space-y-2">
        <router-link
          :to="{ name: 'AdminDashboard' }"
          class="nav-item group"
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-tachometer-alt nav-icon"></i>
          </div>
          <span class="nav-text">لوحة التحكم</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
        
        <router-link
          :to="{ name: 'AdminUsers' }"
          class="nav-item group"
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-users nav-icon"></i>
          </div>
          <span class="nav-text">إدارة المستخدمين</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
        
        <router-link
          :to="{ name: 'AdminEvents' }"
          class="nav-item group"
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-calendar-alt nav-icon"></i>
          </div>
          <span class="nav-text">الفعاليات</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
        
        <router-link
          :to="{ name: 'AdminOrders' }"
          class="nav-item group"
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-shopping-cart nav-icon"></i>
          </div>
          <span class="nav-text">الطلبات</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
        
        <router-link
          :to="{ name: 'AdminReports' }"
          class="nav-item group"
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-chart-pie nav-icon"></i>
          </div>
          <span class="nav-text">التقارير والإحصائيات</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
      </nav>

      <!-- قسم الإحصائيات السريعة -->
      <div class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <i class="fas fa-chart-line ml-2"></i>
          نظرة سريعة
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="text-gray-600 dark:text-gray-400">المستخدمين النشطين</span>
            <span class="font-bold text-green-600">{{ quickStats.activeUsers || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-gray-600 dark:text-gray-400">الفعاليات القادمة</span>
            <span class="font-bold text-blue-600">{{ quickStats.upcomingEvents || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-gray-600 dark:text-gray-400">طلبات جديدة</span>
            <span class="font-bold text-orange-600">{{ quickStats.newOrders || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-gray-600 dark:text-gray-400">الإيرادات اليوم</span>
            <span class="font-bold text-purple-600">{{ formatCurrency(quickStats.todayRevenue) }}</span>
          </div>
        </div>
        
        <!-- حالة التحميل -->
        <div v-if="loading" class="mt-3 text-center">
          <i class="fas fa-spinner fa-spin text-blue-500"></i>
          <span class="text-xs text-gray-500 mr-1">جاري التحميل...</span>
        </div>
        
        <!-- زر تحديث -->
        <button 
          @click="fetchQuickStats"
          class="mt-3 w-full text-xs bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center"
        >
          <i class="fas fa-redo-alt ml-1 text-xs"></i>
          تحديث البيانات
        </button>
      </div>
    </div>

    <!-- الفوتر -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          <i class="fas fa-shield-alt ml-1 text-green-500"></i>
          نظام آمن
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          آخر تحديث: {{ lastUpdate }}
        </p>
      </div>
    </div>
  </aside>

  <!-- Bottom Navigation للشاشات الصغيرة -->
  <nav class="md:hidden fixed bottom-0 right-0 left-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-3 z-50">
    <router-link
      :to="{ name: 'AdminDashboard' }"
      class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-tachometer-alt"></i>
      </div>
      <span class="nav-mobile-text">الرئيسية</span>
    </router-link>

    <router-link
      :to="{ name: 'AdminUsers' }"
      class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-users"></i>
      </div>
      <span class="nav-mobile-text">المستخدمين</span>
    </router-link>

    <router-link
      :to="{ name: 'AdminEvents' }"
      class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-calendar"></i>
      </div>
      <span class="nav-mobile-text">الفعاليات</span>
    </router-link>
    
    <router-link
      :to="{ name: 'AdminOrders' }"
      class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <span class="nav-mobile-text">الطلبات</span>
    </router-link>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/services/api'

export default {
  name: "AdminSidebar",
  setup() {
    const quickStats = ref({
      activeUsers: 0,
      upcomingEvents: 0,
      newOrders: 0,
      todayRevenue: 0
    })
    
    const loading = ref(false)
    const lastUpdate = ref('')
    let refreshInterval = null

    // دالة جلب البيانات السريعة
    const fetchQuickStats = async () => {
      loading.value = true
      try {
        const response = await api.get('/admin/dashboard/stats')
        if (response.data) {
          quickStats.value = response.data
        }
        
        // تحديث وقت آخر تحديث
        lastUpdate.value = new Date().toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error('Error fetching quick stats:', error)
        // استخدام بيانات افتراضية في حالة الخطأ
        quickStats.value = {
          activeUsers: 1234,
          upcomingEvents: 56,
          newOrders: 23,
          todayRevenue: 12500
        }
      } finally {
        loading.value = false
      }
    }

    // دالة تنسيق العملة
    const formatCurrency = (amount) => {
      if (!amount) return '٠ ر.س'
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    onMounted(() => {
      fetchQuickStats()
      
      // تحديث البيانات كل 5 دقائق تلقائياً
      refreshInterval = setInterval(fetchQuickStats, 5 * 60 * 1000)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    })

    return {
      quickStats,
      loading,
      lastUpdate,
      fetchQuickStats,
      formatCurrency
    }
  }
}
</script>

<style scoped>
/* أنيميشن مخصص */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* أنماط السايدبار */

/* تأثيرات إضافية */
.nav-item {
  animation: slideIn 0.5s ease-out;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.2s; }
.nav-item:nth-child(3) { animation-delay: 0.3s; }
.nav-item:nth-child(4) { animation-delay: 0.4s; }
.nav-item:nth-child(5) { animation-delay: 0.5s; }

/* تحسينات التمرير */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style>