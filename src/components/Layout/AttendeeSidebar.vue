<template>
  <!-- Sidebar للشاشات الكبيرة -->
 <aside class="hidden md:flex flex-col bg-white dark:bg-gray-800 shadow-md w-64 h-screen fixed top-0 right-0 z-40"> 
       <div class="px-4 py-6 mt-12">
      <nav class="space-y-2">
        <router-link
          :to="{ name: 'EventsList' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-home ml-2"></i> الرئيسية
        </router-link>
        
        <router-link
          :to="{ name: 'EventsList' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-calendar ml-2"></i> استكشاف الفعاليات
        </router-link>
        
        <router-link
          :to="{ name: 'MyTickets' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-ticket-alt ml-2"></i> تذاكري
        </router-link>
        
        <router-link
          :to="{ name: 'UpcomingEvents' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-clock ml-2"></i> الفعاليات القادمة
        </router-link>
        
        <router-link
          :to="{ name: 'Favorites' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-heart ml-2"></i> المفضلة
        </router-link>

        <router-link
          :to="{ name: 'MyReviews' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-star ml-2"></i> تقييماتي
        </router-link>

        <router-link
          :to="{ name: 'Notifications' }"
          class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-100 dark:bg-gray-700 font-semibold"
        >
          <i class="fas fa-bell ml-2"></i> الإشعارات
        </router-link>
      </nav>

      <!-- قسم المساعدة -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-2">المساعدة</h3>
        <nav class="space-y-2">
          <router-link
            :to="{ name: 'Help' }"
            class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <i class="fas fa-question-circle ml-2"></i> الأسئلة الشائعة
          </router-link>
          
          <router-link
            :to="{ name: 'Support' }"
            class="block px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <i class="fas fa-headset ml-2"></i> الدعم الفني
          </router-link>
        </nav>
      </div>
    </div>
  </aside>

  <!-- Bottom nav للشاشات الصغيرة -->
  <nav class="md:hidden fixed bottom-0 right-0 left-0 bg-white dark:bg-gray-800 shadow-inner flex justify-around items-center py-2 z-50">    <router-link
      :to="{ name: 'EventsList' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-home"></i>
      <span class="text-xs">الرئيسية</span>
    </router-link>

    <router-link
      :to="{ name: 'EventsList' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-calendar"></i>
      <span class="text-xs">الفعاليات</span>
    </router-link>

    <router-link
      :to="{ name: 'MyTickets' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-ticket-alt"></i>
      <span class="text-xs">تذاكري</span>
    </router-link>
    
    <router-link
      :to="{ name: 'Favorites' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-heart"></i>
      <span class="text-xs">المفضلة</span>
    </router-link>
    
    <router-link
      :to="{ name: 'Notifications' }"
      class="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 font-semibold"
    >
      <i class="fas fa-bell"></i>
      <span class="text-xs">الإشعارات</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "AttendeeSidebar",
}
</script>