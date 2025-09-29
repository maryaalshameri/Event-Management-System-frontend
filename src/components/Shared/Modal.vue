<template>
  <Transition 
    enter-active-class="transition ease-out duration-200" 
    enter-from-class="opacity-0" 
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-100" 
    leave-from-class="opacity-100" 
    leave-to-class="opacity-0"
  >
    <div v-show="show" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- الخلفية الشفافة -->
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" @click="close"></div>
      
      <!-- محتوى المودال -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div 
          class="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all w-full"
          :class="maxWidthClass"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { onMounted, onUnmounted, computed } from 'vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '2xl'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => {
      emit('close')
    }

    const closeOnEscape = (e) => {
      if (e.key === 'Escape' && props.show) {
        close()
      }
    }

    onMounted(() => document.addEventListener('keydown', closeOnEscape))
    onUnmounted(() => document.removeEventListener('keydown', closeOnEscape))

    const maxWidthClass = computed(() => {
      return {
        'sm': 'sm:max-w-sm',
        'md': 'sm:max-w-md',
        'lg': 'sm:max-w-lg',
        'xl': 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
      }[props.maxWidth]
    })

    return {
      close,
      maxWidthClass
    }
  }
}
</script>

<style scoped>
/* تأكد من أن المودال فوق كل شيء */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

/* منع scroll على body عندما يكون المودال مفتوحاً */
body.modal-open {
  overflow: hidden;
}
</style>