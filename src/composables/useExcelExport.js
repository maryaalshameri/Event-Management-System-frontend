import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function useExcelExport() {
  const exporting = ref(false)

  const exportToExcel = async (data, columns, fileName = 'data') => {
    exporting.value = true
    
    try {
      if (!data || data.length === 0) {
        throw new Error('لا توجد بيانات للتصدير')
      }

      // تحضير البيانات للتصدير
      const excelData = data.map(item => {
        const row = {}
        columns.forEach(col => {
          const value = item[col.key]
          row[col.header] = col.formatter ? col.formatter(value, item) : value || ''
        })
        return row
      })

      // إنشاء workbook
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(excelData)
      
      // تنسيق الأعمدة
      if (columns.length > 0) {
        worksheet['!cols'] = columns.map(col => ({ wch: col.width || 15 }))
      }

      // إضافة البيانات إلى workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات')

      // إنشاء الملف وتنزيله
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      
      const finalFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, finalFileName)

      return true

    } catch (error) {
      console.error('Error exporting to Excel:', error)
      throw error
    } finally {
      exporting.value = false
    }
  }

  return {
    exporting,
    exportToExcel
  }
}