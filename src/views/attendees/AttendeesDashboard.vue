<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <HeaderComponent :title="currentTitle" />
    
    <div class="flex">
      <!-- Sidebar للشاشات الكبيرة -->
      <AttendeeSidebar />
      
      <!-- المحتوى الرئيسي - أضفنا z-index أقل -->
      <main class="flex-1 min-h-screen transition-all duration-300 md:mr-80 z-10">
        <div class="pt-24 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8">
          <router-view></router-view>
        </div>
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