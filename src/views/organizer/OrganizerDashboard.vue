<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <!-- Sidebar -->
    <SidebarComponent />
    
    <!-- المحتوى الرئيسي -->
    <div class="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 md:mr-64 pb-16 md:pb-0"> <!-- تغيير ml-64 إلى mr-64 -->
      <HeaderComponent :title="currentTitle" />
      
      <!-- المحتوى الديناميكي -->
      <main class="pt-20 px-4 sm:px-6 lg:px-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderComponent from '@/components/Layout/Header.vue'
import SidebarComponent from '@/components/Layout/Sidebar.vue'

export default {
  name: 'OrganizerDashboard',
  components: { HeaderComponent, SidebarComponent },
  setup() {
    const route = useRoute()
    //     onMounted(() => {
    //   console.log('OrganizerDashboard mounted')
    //   console.log('Current route:', route.path)
    //   console.log('Current route name:', route.name)
    // })
    const pageTitles = {
      'Dashboard': 'لوحة تحكم المنظم',
      'OrganizerEvents': 'إدارة الفعاليات',
   
      'EventDetails': 'تفاصيل الفعالية',
      'OrganizerOrders': 'إدارة الطلبات',
      'OrganizerAttendees': 'تفاصيل الحضور',
      'OrganizerReports': 'التقارير والإحصائيات'
    }
    
    const currentTitle = computed(() => {
      return pageTitles[route.name] || 'لوحة تحكم المنظم'
    })
    
    return { currentTitle }
  }
}
</script>