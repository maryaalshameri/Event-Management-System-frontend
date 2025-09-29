<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <!-- Admin Sidebar -->
    <AdminSidebar />
    
    <!-- المحتوى الرئيسي -->
    <div class="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 md:mr-64 pb-16 md:pb-0">
      <HeaderComponent :title="currentTitle" />
      
      <!-- المحتوى الديناميكي -->
      <main class="pt-20 px-4 sm:px-6 lg:px-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Layout/Header.vue'
import AdminSidebar from '@/components/Layout/AdminSidebar.vue'

export default {
  name: 'AdminDashboard',
  components: { HeaderComponent, AdminSidebar },
  computed: {
    currentTitle() {
      return this.$route.meta.title || 'لوحة التحكم';
    }
  }
}
</script>