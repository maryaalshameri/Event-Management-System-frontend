<template>
  <!-- Sidebar للشاشات الكبيرة -->
  <aside class="hidden md:flex flex-col bg-white dark:bg-gray-300 shadow-md w-64 h-screen fixed top-0 right-0 z-40">
    <div class="px-4 py-6 mt-12">
      <nav class="space-y-2">
        <router-link
          :to="{ name: 'Dashboard' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-tachometer-alt ml-2"></i> لوحة التحكم
        </router-link>
        
        <router-link
          :to="{ name: 'OrganizerEvents' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-calendar ml-2"></i> الفعاليات
        </router-link>
        
        <router-link
          :to="{ name: 'OrganizerOrders' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-ticket-alt ml-2"></i> التذاكر
        </router-link>
        
        <!-- <router-link
          :to="{ name: 'OrganizerAttendees' }"
           class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-user ml-2"></i> الحضور
        </router-link> -->
        
        <router-link
         :to="{ name: 'OrganizerReports' }"
           class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-chart-line ml-2"></i> التقارير
        </router-link>
      </nav>
    </div>
  </aside>

  <!-- Bottom nav للشاشات الصغيرة -->
  <nav class="md:hidden fixed bottom-0 right-0 left-0 bg-white dark:bg-gray-300 shadow-inner flex justify-around items-center py-2 z-50">
    <router-link
          :to="{ name: 'Dashboard' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-tachometer-alt"></i>
      <span class="text-xs">الرئيسية</span>
    </router-link>

    <router-link
          :to="{ name: 'OrganizerEvents' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-calendar"></i>
      <span class="text-xs">الفعاليات</span>
    </router-link>

    <router-link
          :to="{ name: 'OrganizerOrders' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-ticket-alt"></i>
      <span class="text-xs">التذاكر</span>
    </router-link>
    
    <!-- <router-link
        :to="{ name: 'OrganizerAttendees' }"
       class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-user"></i>
      <span class="text-xs">الحضور</span>
    </router-link> -->
    
    <router-link
       :to="{ name: 'OrganizerReports' }"
       class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-chart-line"></i>
      <span class="text-xs">التقارير</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "SidebarComponent",
}
</script>