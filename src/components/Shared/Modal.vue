<template>
  <Transition 
    enter-active-class="transition ease-out duration-300" 
    enter-from-class="opacity-0 scale-95" 
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200" 
    leave-from-class="opacity-100 scale-100" 
    leave-to-class="opacity-0 scale-95"
  >
    <div v-show="show" class="fixed inset-0 z-[9999] overflow-y-auto">
      <!-- الخلفية الشفافة -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
      
      <!-- محتوى المودال مع إمكانية التمرير -->
      <div class="flex min-h-full items-center justify-center p-4" :style="modalStyle">
        <div 
          class="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all w-full z-[10000] flex flex-col"
          :class="maxWidthClass"
          :style="contentStyle"
        >
          <!-- محتوى المودال القابل للتمرير -->
          <div class="flex-1 overflow-y-auto">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { onMounted, onUnmounted, computed, watch, ref } from 'vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '2xl'
    },
    closeable: {
      type: Boolean,
      default: true
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: String,
      default: 'calc(100vh - 8rem)' // حساب ديناميكي
    },
    headerOffset: {
      type: Number,
      default: 80 // ارتفاع الهيدر التقريبي
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const headerHeight = ref(props.headerOffset)

    const close = () => {
      if (props.closeable) {
        emit('close')
      }
    }

    const closeOnEscape = (e) => {
      if (e.key === 'Escape' && props.show && props.closeable) {
        close()
      }
    }

    // حساب ارتفاع الهيدر الفعلي
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        headerHeight.value = header.offsetHeight + 20 // +20 للتباعد الإضافي
      }
    }

    // إدارة scroll الجسم عند فتح/إغلاق المودال
    watch(() => props.show, (newValue) => {
      if (newValue) {
        document.body.classList.add('modal-open')
        document.addEventListener('keydown', closeOnEscape)
        calculateHeaderHeight()
      } else {
        document.body.classList.remove('modal-open')
        document.removeEventListener('keydown', closeOnEscape)
      }
    })

    const modalStyle = computed(() => {
      return {
        paddingTop: `${headerHeight.value}px`,
        paddingBottom: `${headerHeight.value}px`
      }
    })

    const contentStyle = computed(() => {
      return {
        maxHeight: props.maxHeight
      }
    })

    onMounted(() => {
      if (props.show) {
        document.body.classList.add('modal-open')
        document.addEventListener('keydown', closeOnEscape)
        calculateHeaderHeight()
      }
    })

    onUnmounted(() => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', closeOnEscape)
    })

    const maxWidthClass = computed(() => {
      return {
        'sm': 'sm:max-w-sm',
        'md': 'sm:max-w-md',
        'lg': 'sm:max-w-lg',
        'xl': 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        '6xl': 'sm:max-w-6xl',
        '7xl': 'sm:max-w-7xl',
      }[props.maxWidth]
    })

    return {
      close,
      maxWidthClass,
      modalStyle,
      contentStyle
    }
  }
}
</script>