<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 transition-all duration-500">
    <!-- شريط التنقل -->
    <nav class="bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg border-b border-white/10 fixed w-full top-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- الشعار -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-calendar-alt text-white text-lg"></i>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              MaryEvent
            </span>
          </div>

          <!-- القائمة -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">الميزات</a>
            <a href="#statistics" class="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">الإحصائيات</a>
            <a href="#testimonials" class="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">التقييمات</a>
            <a href="#contact" class="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">اتصل بنا</a>
          </div>

          <!-- الأزرار -->
          <div class="flex items-center space-x-4">
            <!-- زر Dark Mode -->
            <button @click="toggleDarkMode" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group">
              <i :class="isDark ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-indigo-300'" class="text-lg group-hover:scale-110 transition-transform"></i>
            </button>
            
            <router-link 
              to="/login" 
              class="px-6 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-purple-500 rounded-xl transition-all duration-300 hover:scale-105"
            >
              تسجيل الدخول
            </router-link>
            <router-link 
              to="/register" 
              class="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              إنشاء حساب
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- المحتوى الرئيسي -->
    <main class="pt-16">
      <!-- قسم البطل -->
      <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- خلفية متحركة -->
        <div class="absolute inset-0">
          <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div class="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="animate-float">
            <h1 class="text-6xl md:text-8xl font-black mb-8">
              <span class="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                MaryEvent
              </span>
            </h1>
          </div>
          
          <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
              منصة الفعاليات المستقبلية
            </span>
            <br>
            حيث تلتقي الابتكارات وتنطلق التجارب الاستثنائية
          </p>

          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <router-link 
              to="/events" 
              class="group px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3"
            >
              <span>استكشاف الفعاليات</span>
              <i class="fas fa-arrow-left group-hover:translate-x-1 transition-transform duration-300"></i>
            </router-link>
            
            <router-link 
              to="/register" 
              class="group px-12 py-4 border-2 border-purple-500 hover:border-purple-400 text-purple-300 hover:text-white rounded-2xl text-lg font-semibold backdrop-blur-sm hover:bg-purple-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3"
            >
              <i class="fas fa-crown group-hover:rotate-12 transition-transform duration-300"></i>
              <span>انضم كمنظم</span>
            </router-link>
          </div>

          <!-- إحصائيات سريعة -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto">
            <div v-for="stat in quickStats" :key="stat.id" class="text-center animate-fade-in-up" :style="`animation-delay: ${stat.delay}ms`">
              <div class="text-3xl md:text-4xl font-bold text-white mb-2">{{ stat.value }}</div>
              <div class="text-sm text-gray-400">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ميزات المنصة -->
      <section id="features" class="py-32 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-5xl font-bold text-white mb-6">
              لماذا تختار 
              <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MaryEvent</span>؟
            </h2>
            <p class="text-xl text-gray-400 max-w-3xl mx-auto">
              نقدم لك تجربة فريدة تجمع بين البساطة والقوة في عالم تنظيم الفعاليات
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-12">
            <div v-for="(feature, index) in features" :key="feature.id" 
                 class="group p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:-translate-y-4"
                 :style="`animation-delay: ${index * 200}ms`">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span class="text-2xl">{{ feature.icon }}</span>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">{{ feature.title }}</h3>
              <p class="text-gray-400 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- إحصائيات متقدمة -->
      <section id="statistics" class="py-32 bg-gradient-to-b from-transparent to-black/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-5xl font-bold text-white mb-8">
                أرقام 
                <span class="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">تتحدث</span>
                عنا
              </h2>
              <p class="text-xl text-gray-400 mb-12">
                انضم إلى مجتمعنا المتنامي من المنظمين والمشاركين الذين يثقون بنا
              </p>
              
              <div class="grid grid-cols-2 gap-8">
                <div v-for="stat in advancedStats" :key="stat.id" 
                     class="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300">
                  <div class="text-3xl font-bold text-white mb-2">{{ stat.value }}</div>
                  <div class="text-green-400 text-sm">{{ stat.label }}</div>
                </div>
              </div>
            </div>

            <div class="relative">
              <div class="relative z-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-white/10">
                <div class="grid grid-cols-2 gap-6">
                  <div v-for="chart in statsCharts" :key="chart.id" 
                       class="bg-black/20 rounded-2xl p-6 text-center">
                    <div class="text-2xl font-bold text-white mb-2">{{ chart.percentage }}</div>
                    <div class="text-sm text-gray-400">{{ chart.label }}</div>
                    <div class="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000" 
                           :style="`width: ${chart.percentage}`"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- قسم التقييمات -->
      <section id="testimonials" class="py-32">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-20">
            <h2 class="text-5xl font-bold text-white mb-6">
              ماذا يقول 
              <span class="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">عملاؤنا</span>؟
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="testimonial in testimonials" :key="testimonial.id"
                 class="group p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:-translate-y-2">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {{ testimonial.initials }}
                </div>
                <div class="mr-4">
                  <div class="text-white font-semibold">{{ testimonial.name }}</div>
                  <div class="text-gray-400 text-sm">{{ testimonial.role }}</div>
                </div>
              </div>
              <p class="text-gray-300 leading-relaxed italic">"{{ testimonial.comment }}"</p>
              <div class="flex mt-4">
                <i v-for="star in 5" :key="star" 
                   class="fas fa-star text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- تذييل الصفحة -->
    <footer id="contact" class="bg-black/40 backdrop-blur-lg border-t border-white/10 pt-20 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <!-- معلومات الشركة -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <i class="fas fa-calendar-alt text-white text-xl"></i>
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MaryEvent
              </span>
            </div>
            <p class="text-gray-400 mb-6 max-w-md leading-relaxed">
              منصة رائدة في تنظيم الفعاليات والحفلات، نقدم حلولاً مبتكرة تجمع بين التكنولوجيا المتقدمة والخبرة البشرية.
            </p>
            <div class="flex space-x-4 space-x-reverse">
              <a v-for="social in socialLinks" :key="social.name"
                 :href="social.url" 
                 class="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-purple-500 flex items-center justify-center transition-all duration-300 group">
                <i :class="social.icon" class="text-gray-400 group-hover:text-white text-lg"></i>
              </a>
            </div>
          </div>

          <!-- روابط سريعة -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-6">روابط سريعة</h3>
            <ul class="space-y-4">
              <li v-for="link in quickLinks" :key="link.name">
                <a :href="link.url" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <i class="fas fa-chevron-left text-xs"></i>
                  <span>{{ link.name }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- النشرة البريدية -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-6">اشترك في النشرة البريدية</h3>
            <p class="text-gray-400 mb-4">كن أول من يعلم عن أحدث الفعاليات والعروض</p>
            <div class="flex flex-col space-y-4">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                class="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300"
              >
              <button class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl px-6 py-3 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>اشترك الآن</span>
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- حقوق النشر -->
        <div class="border-t border-white/10 pt-8 text-center">
          <p class="text-gray-400">
            © 2024 MaryEvent. جميع الحقوق محفوظة. 
            <span class="text-purple-400">صنع بكل ❤️ للمجتمع</span>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useDarkMode } from '@/composables/useDarkMode'

export default {
  name: 'Welcome',
  setup() {
    const { isDark, toggleDarkMode } = useDarkMode()

    const quickStats = [
      { id: 1, value: '500+', label: 'فعالية نشطة', delay: 0 },
      { id: 2, value: '50K+', label: 'مستخدم مسجل', delay: 200 },
      { id: 3, value: '100K+', label: 'تذكرة مباعة', delay: 400 },
      { id: 4, value: '98%', label: 'رضى العملاء', delay: 600 }
    ]

    const features = [
      {
        id: 1,
        icon: '🚀',
        title: 'تجربة مستخدم فائقة',
        description: 'واجهة مستخدم بديهية وسلسة تجعل عملية حجز التذاكر تجربة ممتعة'
      },
      {
        id: 2,
        icon: '🛡️',
        title: 'أمان متكامل',
        description: 'أنظمة دفع آمنة وحماية متقدمة لبياناتك الشخصية والمالية'
      },
      {
        id: 3,
        icon: '📊',
        title: 'تحليلات ذكية',
        description: 'تقارير وتحليلات متقدمة تساعد المنظمين على اتخاذ قرارات أفضل'
      }
    ]

    const advancedStats = [
      { id: 1, value: '99.9%', label: 'وقت التشغيل' },
      { id: 2, value: '30+', label: 'مدينة' },
      { id: 3, value: '15+', label: 'فئة فعاليات' },
      { id: 4, value: '24/7', label: 'دعم فني' }
    ]

    const statsCharts = [
      { id: 1, percentage: '95%', label: 'رضى المنظمين' },
      { id: 2, percentage: '98%', label: 'رضى المشاركين' },
      { id: 3, percentage: '90%', label: 'نمو المبيعات' },
      { id: 4, percentage: '85%', label: 'تكرار الاستخدام' }
    ]

    const testimonials = [
      {
        id: 1,
        name: 'أحمد محمد',
        initials: 'أم',
        role: 'منظم فعاليات',
        comment: 'منصة MaryEvent غيرت طريقة تنظيمي للفعاليات بشكل كامل. الأدوات المتقدمة والدعم الرائع جعلوا عملي أسهل بكثير.'
      },
      {
        id: 2,
        name: 'فاطمة علي',
        initials: 'فع',
        role: 'مشاركة',
        comment: 'تجربة رائعة! عملية الحجز سلسة والتذاكر تصل فوراً. أصبحت هذه المنصة وجهتي الأولى للفعاليات.'
      },
      {
        id: 3,
        name: 'خالد السعدي',
        initials: 'خس',
        role: 'شريك تجاري',
        comment: 'التقارير التحليلية ساعدتني على فهم جمهوري بشكل أفضل وزيادة مبيعات التذاكر بنسبة 40%.'
      }
    ]

    const socialLinks = [
      { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
      { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
      { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
      { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '#' }
    ]

    const quickLinks = [
      { name: 'عن المنصة', url: '#about' },
      { name: 'الميزات', url: '#features' },
      { name: 'الأسعار', url: '#pricing' },
      { name: 'المدونة', url: '#blog' },
      { name: 'اتصل بنا', url: '#contact' }
    ]

    return {
      isDark,
      toggleDarkMode,
      quickStats,
      features,
      advancedStats,
      statsCharts,
      testimonials,
      socialLinks,
      quickLinks
    }
  },
  mounted() {
    this.addScrollEffects()
  },
  methods: {
    addScrollEffects() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      }, { threshold: 0.1 })

      document.querySelectorAll('section > div, .feature-card, .stat-card').forEach((el) => {
        observer.observe(el)
      })
    }
  }
}
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تخصيص شريط التمرير */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #db2777);
}

/* تأثيرات إضافية */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .text-6xl {
    font-size: 3.5rem;
  }
  
  .text-8xl {
    font-size: 4.5rem;
  }
}
</style>