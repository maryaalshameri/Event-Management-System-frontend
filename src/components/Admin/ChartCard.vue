<script setup>
import { Line, Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'

// تسجيل المكونات الخاصة بـ chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

const props = defineProps({
  title: { type: String, required: true },
  type: { type: String, default: 'line' }, // line | bar | pie
  data: { type: Object, required: true }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: false }
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 h-80">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
      {{ title }}
    </h3>

    <div class="h-64">
      <component
        :is="type === 'line' ? Line : type === 'bar' ? Bar : Pie"
        :data="data"
        :options="chartOptions"
      />
    </div>
  </div>
</template>
