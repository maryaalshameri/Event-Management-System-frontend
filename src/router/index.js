// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

// صفحات
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AttendeesDashboard from '@/views/attendees/AttendeesDashboard.vue'
import OrganizerDashboard from '@/views/organizer/OrganizerDashboard.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import Welcome from '@/views/Welcome.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
  // { path: '/attendees/dashboard', name: 'AttendeesDashboard', component: AttendeesDashboard, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }, // أي مسار غير معروف
   { 
    path: '/forgot-password', 
    name: 'ForgotPassword', 
    component: ForgotPassword,
    meta: { guest: true }
  },


 {
    path: '/attendee',
    component:AttendeesDashboard,
    meta: { requiresAuth: true},
    children: [
      {
        path: 'events',
        name: 'EventsList',
        component: () => import('@/views/attendees/EventsList.vue'),
        meta: { title: 'استكشاف الفعاليات' }
      },
      {
        path: 'events/:id',
        name: 'EventDetails',
        component: () => import('@/views/attendees/EventDetails.vue'),
        meta: { title: 'تفاصيل الفعالية' }
      },
      {
        path: 'my-tickets',
        name: 'MyTickets',
        component: () => import('@/views/attendees/MyTickets.vue'),
        meta: { title: 'تذاكري' }
      },
      {
        path: 'upcoming-events',
        name: 'UpcomingEvents',
        component: () => import('@/views/attendees/UpcomingEvents.vue'),
        meta: { title: 'الفعاليات القادمة' }
      },
      {
        path: 'past-events',
        name: 'PastEvents',
        component: () => import('@/views/attendees/PastEvents.vue'),
        meta: { title: 'الفعاليات السابقة' }
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import('@/views/attendees/Favorites.vue'),
        meta: { title: 'المفضلة' }
      },
      {
        path: 'my-reviews',
        name: 'MyReviews',
        component: () => import('@/views/attendees/MyReviews.vue'),
        meta: { title: 'تقييماتي' }
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/views/attendees/Notifications.vue'),
        meta: { title: 'الإشعارات' }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/attendees/Help.vue'),
        meta: { title: 'الأسئلة الشائعة' }
      },
      {
        path: 'support',
        name: 'Support',
        component: () => import('@/views/attendees/Support.vue'),
        meta: { title: 'الدعم الفني' }
      },
      {
        path: 'payment/:orderId',
        name: 'Payment',
        component: () => import('@/views/attendees/Payment.vue'),
        meta: { title: 'الدفع' }
      },
      // إعادة توجيه المسار الأساسي
      { path: '', redirect: { name: 'EventsList' } }
    ]
  },




  {
    path: '/organizer',
    component: OrganizerDashboard, // هذا المكون سيحتوي على Header و Sidebar و router-view
    meta: { requiresAuth: true, role: 'organizer' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/organizer/Dashboard.vue'),
          meta: { title: 'لوحة التحكم' }
      },
      {
        path: 'events',
        name: 'OrganizerEvents',
        component: () => import('@/views/organizer/Events.vue'),
          meta: { title: ' فعالياتي' }
      },
  
      {
        path: 'orders',
        name: 'OrganizerOrders',
        component: () => import('@/views/organizer/Orders.vue'),
          meta: { title: ' ادارة الطلبات' }
      },
      {
        path: 'events/:id/attendees',
        name: 'OrganizerAttendees',
        component: () => import('@/views/organizer/Attendees.vue'),
          meta: { title: ' الحضور' }
      },
       { path: "settings", name: "OrganizerSettings",
         component: ()  => import("@/views/organizer/Settings.vue"),
          meta: { title: "الإعدادات" } },
      {
        path: 'reports',
        name: 'OrganizerReports',
        component: () => import('@/views/organizer/Reports.vue'),
          meta: { title: 'التقارير ' }
      },
      // إعادة توجيه المسار الأساسي إلى dashboard
      { path: '', redirect: { name: 'Dashboard' } }
    ]
  },
  {
  path: '/admin',
  component: AdminDashboard,
  meta: { requiresAuth: true, role: 'admin' },
  children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { title: 'لوحة التحكم' }
    },
    {
      path: 'users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/Users.vue'),
      meta: { title: 'إدارة المستخدمين' }
    },
    {
      path: 'events',
      name: 'AdminEvents',
      component: () => import('@/views/admin/Events.vue'),
      meta: { title: 'إدارة الفعاليات' }
    },
    {
      path: 'orders',
      name: 'AdminOrders',
      component: () => import('@/views/admin/Orders.vue'),
      meta: { title: 'إدارة الطلبات' }
    },
    {
      path: 'reports',
      name: 'AdminReports',
      component: () => import('@/views/admin/Reports.vue'),
      meta: { title: 'التقارير والإحصائيات' }
    },
    { path: '', redirect: { name: 'AdminDashboard' } }
  ]
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard عام للتحقق من الوصول حسب الدور
router.beforeEach(async (to, from, next) => {
  // تأكد من مزامنة المستخدم من localStorage
  if (store.state.token && !store.state.user) {
    try {
      await store.dispatch('fetchUser')
    } catch {
      await store.dispatch('logout')
    }
  }

  const isLogged = store.getters.isLogged
  const userRole = store.getters.userRole

  if (to.meta.requiresAuth && !isLogged) {
    // يحتاج تسجيل الدخول
    return next({ name: 'Login' })
  }

  if (to.meta.guest && isLogged) {
    // المستخدم مسجل الدخول ولا يمكنه الوصول للـ guest
    return next({ path: userRole === 'organizer' ? '/organizer/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/' })
  }

  if (to.meta.role && userRole !== to.meta.role) {
    // صلاحية غير صحيحة
    return next({ path: userRole === 'organizer' ? '/organizer/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/' })
  }

  next()
})

export default router
