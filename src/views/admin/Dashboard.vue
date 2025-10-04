<template>
  <div class="container mx-auto px-4 py-6">
    
    <!-- الإحصائيات -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="إجمالي المستخدمين" 
        :value="stats.total_users" 
        icon="users"
        color="blue"
        :trend="userTrend"
      />
      <StatCard 
        title="المنظمين" 
        :value="stats.total_organizers" 
        icon="user-tie"
        color="green"
        :trend="organizerTrend"
      />
      <StatCard 
        title="الحضور" 
        :value="stats.total_attendees" 
        icon="users"
        color="purple"
        :trend="attendeeTrend"
      />
      <StatCard 
        title="إجمالي الفعاليات" 
        :value="stats.total_events" 
        icon="calendar"
        color="yellow"
        :trend="eventsTrend"
      />
      <StatCard 
        title="الفعاليات المنشورة" 
        :value="stats.published_events" 
        icon="calendar-check"
        color="green"
        :trend="publishedEventsTrend"
      />
      <StatCard 
        title="إجمالي الطلبات" 
        :value="stats.total_orders" 
        icon="shopping"
        color="blue"
        :trend="ordersTrend"
      />
      <StatCard 
        title="طلبات قيد الانتظار" 
        :value="stats.pending_orders" 
        icon="clock"
        color="yellow"
        :trend="pendingOrdersTrend"
      />
      <StatCard 
        title="إجمالي الإيرادات" 
        :value="`${formatCurrency(stats.total_revenue)}`" 
        icon="money-bill-wave"
        color="purple"
        :trend="revenueTrend"
      />
    </div>

    <!-- الرسوم البيانية -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard 
        title="توزيع المستخدمين" 
        type="doughnut" 
        :data="userDistributionData" 
      />
      <ChartCard 
        title="الإيرادات الشهرية" 
        type="line" 
        :data="revenueData" 
      />

    </div>

    <!-- أحدث الفعاليات -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">أحدث الفعاليات</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-2 text-right">اسم الفعالية</th>
              <th class="px-4 py-2 text-right">المنظم</th>
              <th class="px-4 py-2 text-right">التاريخ</th>
              <th class="px-4 py-2 text-right">الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in recentEvents" :key="event.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3">{{ event.title }}</td>
              <td class="px-4 py-3">{{ event.organizer?.name }}</td>
              <td class="px-4 py-3">{{ formatDate(event.start_date) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(event.status)">
                  {{ getStatusText(event.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- أحدث الطلبات -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">أحدث الطلبات</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-2 text-right">رقم الطلب</th>
              <th class="px-4 py-2 text-right">المستخدم</th>
              <th class="px-4 py-2 text-right">المبلغ</th>
              <th class="px-4 py-2 text-right">حالة الدفع</th>
              <th class="px-4 py-2 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3">#{{ order.id }}</td>
              <td class="px-4 py-3">{{ order.user?.name }}</td>
              <td class="px-4 py-3">{{ formatCurrency(order.total_amount) }}</td>
              <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full" :class="paymentStatusClass(order.payment_status)">
                {{ getPaymentStatusText(order.payment_status) }}
              </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(order.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import StatCard from '@/components/Admin/StatCard.vue'
import ChartCard from '@/components/Admin/ChartCard.vue'

export default {
  name: 'AdminDashboard',
  components: { StatCard, ChartCard },
  setup() {
    const stats = ref({
      total_users: 0,
      total_organizers: 0,
      total_attendees: 0,
      total_events: 0,
      published_events: 0,
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0
    })

    const recentEvents = ref([])
    const recentOrders = ref([])
    
    // قيم الاتجاهات (يمكن جلبها من API أو حسابها)
    const userTrend = ref(0)
    const organizerTrend = ref(0)
    const attendeeTrend = ref(0)
    const eventsTrend = ref(0)
    const publishedEventsTrend = ref(0)
    const ordersTrend = ref(0)
    const pendingOrdersTrend = ref(0)
    const revenueTrend = ref(0)

    const userDistributionData = computed(() => ({
      labels: ['منظمين', 'حضور', 'مديرين'],
      datasets: [{
        data: [
          stats.value.total_organizers,
          stats.value.total_attendees,
          Math.max(0, stats.value.total_users - stats.value.total_organizers - stats.value.total_attendees)
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 2
      }]
    }))

    const revenueData = ref({
      labels: [],
      datasets: [{
        label: 'الإيرادات',
        data: [],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    })

    const fetchDashboardData = async () => {
      try {
        // جلب الإحصائيات
        const statsResponse = await api.get('/admin/dashboard/stats')
        if (statsResponse.data) {
          stats.value = statsResponse.data
          
          // حساب الاتجاهات (هنا يمكنك استبدالها ببيانات حقيقية من API)
          userTrend.value = calculateRandomTrend()
          organizerTrend.value = calculateRandomTrend()
          attendeeTrend.value = calculateRandomTrend()
          eventsTrend.value = calculateRandomTrend()
          publishedEventsTrend.value = calculateRandomTrend()
          ordersTrend.value = calculateRandomTrend()
          pendingOrdersTrend.value = calculateRandomTrend()
          revenueTrend.value = calculateRandomTrend()
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        showToast('خطأ', 'فشل في تحميل البيانات ', 'error')
      }
    }
  // التصحيح في دالة fetchMonthlyRevenue
const fetchMonthlyRevenue = async () => {
  try {
    const response = await api.get('/admin/dashboard/monthly-revenue?months=8')
    console.log(response)
    const monthlyData = response.data.revenue_data
    
    // تحديث بيانات الرسم البياني بشكل صحيح
    revenueData.value = {
      labels: monthlyData.map(item => item.month),
      datasets: [{
        label: 'الإيرادات',
        data: monthlyData.map(item => item.total),
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    }
    
  } catch (error) {
    console.error('Error fetching monthly revenue:', error)
  }
}    

const fetchRecentEvents = async () => {
  try {
    const response = await api.get('/admin/dashboard/recent-events?limit=5')
    recentEvents.value = response.data
  } catch (error) {
    console.error('Error fetching recent events:', error)
  }
}

const fetchRecentOrders = async () => {
  try {
    const response = await api.get('/admin/dashboard/recent-orders?limit=5')
    recentOrders.value = response.data
  } catch (error) {
    console.error('Error fetching recent orders:', error)
  }
}



    // دالة مساعدة لحساب اتجاه عشوائي (للتوضيح فقط)
    const calculateRandomTrend = () => {
      return Math.floor(Math.random() * 41) - 20; // قيمة بين -20 و +20
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
      }).format(amount || 0)
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    }

    const statusClass = (status) => {
      const classes = {
        published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      }
      return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }

    const getStatusText = (status) => {
      const texts = {
        published: 'منشور',
        draft: 'مسودة',
        cancelled: 'ملغي',
        completed: 'مكتمل'
      }
      return texts[status] || status
    }

    const paymentStatusClass = (status) => {
      const classes = {
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      }
      return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }

    const getPaymentStatusText = (status) => {
      const texts = {
        completed: 'مكتمل',
        pending: 'قيد الانتظار',
        failed: 'فشل',
        refunded: 'تم الاسترجاع'
      }
      return texts[status] || status
    }

    onMounted(() => {
  fetchDashboardData()
  fetchMonthlyRevenue() 
   fetchRecentEvents() //
  fetchRecentOrders() // 
})

    return {
      stats,
      recentEvents,
      recentOrders,
      userDistributionData,
      revenueData,
      userTrend,
      organizerTrend,
      attendeeTrend,
      eventsTrend,
      publishedEventsTrend,
      ordersTrend,
      pendingOrdersTrend,
      revenueTrend,
      formatCurrency,
      formatDate,
      statusClass,
      getStatusText,
      paymentStatusClass,
      getPaymentStatusText
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: right;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
}

.dark th {
  background-color: #374151;
}

.dark table {
  border-color: #4b5563;
}
</style>