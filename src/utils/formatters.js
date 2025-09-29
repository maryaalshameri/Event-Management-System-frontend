/**
 * أدوات تنسيق البيانات
 */

/**
 * تنسيق العملة
 * @param {number} amount - المبلغ
 * @param {string} currency - العملة (افتراضي: SAR)
 * @returns {string} المبلغ المنسق
 */
export const formatCurrency = (amount, currency = 'SAR') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '٠ ر.س'
  }
  
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * تنسيق التاريخ
 * @param {string|Date} dateString - تاريخ
 * @returns {string} التاريخ المنسق
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * تنسيق التاريخ والوقت
 * @param {string|Date} dateString - تاريخ
 * @returns {string} التاريخ والوقت المنسق
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * تنسيق الوقت فقط
 * @param {string|Date} dateString - تاريخ
 * @returns {string} الوقت المنسق
 */
export const formatTime = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * تنسيق التاريخ للتخزين (YYYY-MM-DD)
 * @param {string|Date} dateString - تاريخ
 * @returns {string} التاريخ بصيغة YYYY-MM-DD
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  return date.toISOString().split('T')[0]
}

/**
 * تنسيق التاريخ والوقت للتخزين
 * @param {string|Date} dateString - تاريخ
 * @returns {string} التاريخ والوقت بصيغة ISO
 */
export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  // إزالة الثواني والمللي ثانية
  return date.toISOString().slice(0, 16)
}

/**
 * تنسيق الرقم بإضافة فواصل
 * @param {number} number - الرقم
 * @returns {string} الرقم المنسق
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '٠'
  }
  
  return new Intl.NumberFormat('ar-SA').format(number)
}

/**
 * تقصير النص وإضافة نقاط إذا كان طويلاً
 * @param {string} text - النص
 * @param {number} maxLength - الطول الأقصى
 * @returns {string} النص المختصر
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + '...'
}

/**
 * تنسيق المدة الزمنية (مثل: منذ 5 دقائق)
 * @param {string|Date} dateString - التاريخ
 * @returns {string} المدة الزمنية
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'الآن'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `منذ ${diffInDays} يوم`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `منذ ${diffInWeeks} أسبوع`
  }
  
  return formatDate(date)
}

/**
 * تنسيق حجم الملف
 * @param {number} bytes - الحجم بالبايت
 * @returns {string} الحجم المنسق
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 بايت'
  
  const k = 1024
  const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * تنسيق النسبة المئوية
 * @param {number} value - القيمة
 * @param {number} total - الإجمالي
 * @returns {string} النسبة المئوية
 */
export const formatPercentage = (value, total) => {
  if (total === 0) return '0%'
  
  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}

/**
 * تنسيق رقم الهاتف
 * @param {string} phone - رقم الهاتف
 * @returns {string} رقم الهاتف المنسق
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-'
  
  // إزالة جميع المسافات والرموز
  const cleaned = phone.replace(/\D/g, '')
  
  // تنسيق الرقم السعودي
  if (cleaned.length === 10 && cleaned.startsWith('05')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }
  
  // تنسيق الأرقام الدولية
  if (cleaned.length > 10) {
    return `+${cleaned}`
  }
  
  return phone
}

/**
 * تنسيق البريد الإلكتروني (إخفاء جزء منه)
 * @param {string} email - البريد الإلكتروني
 * @returns {string} البريد الإلكتروني المخفي جزئياً
 */
export const formatEmailPartial = (email) => {
  if (!email) return '-'
  
  const [username, domain] = email.split('@')
  if (!username || !domain) return email
  
  const hiddenUsername = username.length > 2 
    ? username.substring(0, 2) + '***'
    : '***'
  
  return `${hiddenUsername}@${domain}`
}

/**
 * تنسيق الاسم (إظهار الاسم الأول والأخير فقط)
 * @param {string} fullName - الاسم الكامل
 * @returns {string} الاسم المنسق
 */
export const formatShortName = (fullName) => {
  if (!fullName) return '-'
  
  const names = fullName.split(' ').filter(name => name.trim() !== '')
  if (names.length === 0) return '-'
  
  if (names.length === 1) return names[0]
  
  return `${names[0]} ${names[names.length - 1]}`
}

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatDateForInput,
  formatDateTimeForInput,
  formatNumber,
  truncateText,
  formatTimeAgo,
  formatFileSize,
  formatPercentage,
  formatPhoneNumber,
  formatEmailPartial,
  formatShortName
}