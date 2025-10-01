<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <AttendeeSidebar />

    <!-- المحتوى الرئيسي -->
    <div class="flex-1 flex flex-col min-h-screen md:mr-64">
      <HeaderComponent :title="currentTitle" />
      
      <!-- المحتوى الرئيسي مع padding مناسب -->
      <main class="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-16 md:pb-0">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Layout/Header.vue'
import AttendeeSidebar from '@/components/Layout/AttendeeSidebar.vue'

export default {
  name: 'AttendeesDashboard',
  components: { HeaderComponent, AttendeeSidebar },
  computed: {
    currentTitle() {
      return this.$route.meta?.title || 'لوحة التحكم';
    }
  }
}
</script>