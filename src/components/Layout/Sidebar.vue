<template>
  <!-- Sidebar للشاشات الكبيرة -->
  <aside class="hidden md:flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl w-80 h-screen fixed top-0 right-0 z-40 border-l border-gray-200 dark:border-gray-700 transition-all duration-500 mt-20">
    <!-- الشعار -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3 space-x-reverse">
        <div class="w-12 h-12 ml-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
          <i class="fas fa-calendar-check text-white text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">لوحة المنظم</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">إدارة الفعاليات</p>
        </div>
      </div>
    </div>

    <!-- القائمة -->
    <div class="flex-1 px-4 py-6 overflow-y-auto">
      <nav class="space-y-2">
        <router-link
          :to="{ name: 'Dashboard' }"
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
          :to="{ name: 'OrganizerEvents' }"
          class="nav-item group"
         
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-calendar-alt nav-icon"></i>
          </div>
          <span class="nav-text">فعالياتي</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
        
       
        
        <router-link
          :to="{ name: 'OrganizerOrders' }"
           class="nav-item group"
          active-class="nav-item-active"
        >
          <div class="nav-icon-container">
            <i class="fas fa-shopping-cart nav-icon"></i>
          </div>
          <span class="nav-text">التذاكر والطلبات</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
        
        <router-link
          :to="{ name: 'OrganizerReports' }"
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

        <router-link
          :to="{ name: 'OrganizerSettings' }"
          class="nav-item group"
          active-class="nav-item-active"

        >
          <div class="nav-icon-container">
            <i class="fas fa-cog nav-icon"></i>
          </div>
          <span class="nav-text">الإعدادات</span>
          <div class="nav-arrow">
            <i class="fas fa-chevron-left"></i>
          </div>
        </router-link>
      </nav>

      <!-- قسم سريع للوصول -->
      <div class="mt-8 p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <i class="fas fa-bolt ml-2"></i>
          وصول سريع
        </h3>
        <div class="space-y-2">
          <button 
            @click="$router.push({ name: 'OrganizerEvents' })"
            class="w-full text-right text-xs bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200 flex items-center justify-between"
          >
            <span>إنشاء فعالية جديدة</span>
            <i class="fas fa-plus text-green-500"></i>
          </button>
          
          <button 
            @click="$router.push({ name: 'OrganizerOrders' })"
            class="w-full text-right text-xs bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200 flex items-center justify-between"
          >
            <span>عرض الطلبات الجديدة</span>
            <i class="fas fa-external-link-alt text-blue-500"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- الفوتر -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          <i class="fas fa-user-check ml-1 text-green-500"></i>
          حساب منظم
        </p>
      </div>
    </div>
  </aside>

  <!-- Bottom Navigation للشاشات الصغيرة -->
  <nav class="md:hidden fixed bottom-0 right-0 left-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-3 z-50">
    <router-link
      :to="{ name: 'Dashboard' }"
      class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-tachometer-alt"></i>
      </div>
      <span class="nav-mobile-text">الرئيسية</span>
    </router-link>

    <router-link
      :to="{ name: 'OrganizerEvents' }"
      class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-calendar"></i>
      </div>
      <span class="nav-mobile-text">الفعاليات</span>
    </router-link>

   
    
    <router-link
      :to="{ name: 'OrganizerOrders' }"
     class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <span class="nav-mobile-text">التذاكر</span>
    </router-link>

    <router-link
      :to="{ name: 'OrganizerReports' }"
     class="nav-mobile-item group"
      active-class="nav-mobile-item-active"
    >
      <div class="nav-mobile-icon">
            <i class="fas fa-chart-pie nav-icon"></i>
      </div>
      <span class="nav-mobile-text">التقارير</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "SidebarComponent",
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