<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4" :class="borderColor">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
      </div>
      <div class="p-3 rounded-full bg-opacity-20" :class="bgColor">
        <i class="fas" :class="[iconClass, textColor]"></i>
      </div>
    </div>
    <div v-if="trend" class="mt-2 flex items-center">
      <i class="fas" :class="[trendIcon, trendTextColor]"></i>
      <span class="text-sm ml-1" :class="trendTextColor">{{ trend }}%</span>
      <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">من الشهر الماضي</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'StatCard',
  props: {
    title: String,
    value: [String, Number],
    icon: String,
    color: {
      type: String,
      default: 'blue'
    },
    trend: Number
  },
  setup(props) {
    const colorClasses = {
      blue: {
        border: 'border-l-blue-500',
        bg: 'bg-blue-500',
        text: 'text-blue-500'
      },
      green: {
        border: 'border-l-green-500',
        bg: 'bg-green-500',
        text: 'text-green-500'
      },
      purple: {
        border: 'border-l-purple-500',
        bg: 'bg-purple-500',
        text: 'text-purple-500'
      },
      yellow: {
        border: 'border-l-yellow-500',
        bg: 'bg-yellow-500',
        text: 'text-yellow-500'
      },
      red: {
        border: 'border-l-red-500',
        bg: 'bg-red-500',
        text: 'text-red-500'
      }
    }

    const borderColor = computed(() => colorClasses[props.color]?.border || 'border-l-blue-500')
    const bgColor = computed(() => colorClasses[props.color]?.bg || 'bg-blue-500')
    const textColor = computed(() => colorClasses[props.color]?.text || 'text-blue-500')
    
    const iconClass = computed(() => {
      const icons = {
        users: 'fa-users',
        'user-tie': 'fa-user-tie',
        calendar: 'fa-calendar',
        'money-bill-wave': 'fa-money-bill-wave',
        ticket: 'fa-ticket-alt',
        shopping: 'fa-shopping-cart',
        chart: 'fa-chart-line'
      }
      return icons[props.icon] || 'fa-chart-bar'
    })

    const trendIcon = computed(() => props.trend >= 0 ? 'fa-arrow-up' : 'fa-arrow-down')
    const trendTextColor = computed(() => props.trend >= 0 ? 'text-green-500' : 'text-red-500')

    return {
      borderColor,
      bgColor,
      textColor,
      iconClass,
      trendIcon,
      trendTextColor
    }
  }
}
</script>