export const showToast = (title, message, type = 'success') => {
  // إنشاء عنصر toast ديناميكياً
  const toastId = 'toast-' + Date.now()
  const toastHtml = `
    <div id="${toastId}" class="fixed-toast ${type}">
      <div class="toast-content">
        <i class="toast-icon ${getToastIcon(type)}"></i>
        <div class="toast-message">
          <p class="toast-title">${title}</p>
          <p class="toast-text">${message}</p>
        </div>
        <button onclick="document.getElementById('${toastId}').remove()" class="toast-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `
  
  // إضافة الـ toast إلى DOM
  const toastContainer = document.getElementById('toast-container') || createToastContainer()
  toastContainer.innerHTML += toastHtml
  
  // إزالة الـ toast بعد 5 ثواني
  setTimeout(() => {
    const toastElement = document.getElementById(toastId)
    if (toastElement) {
      toastElement.remove()
    }
  }, 5000)
}

const createToastContainer = () => {
  const container = document.createElement('div')
  container.id = 'toast-container'
  container.className = 'toast-container'
  document.body.appendChild(container)
  return container
}

const getToastIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[type] || 'fas fa-bell'
}

// إضافة CSS للـ toast
const addToastStyles = () => {
  if (document.getElementById('toast-styles')) return
  
  const styles = `
    <style id="toast-styles">
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    }
    
    .fixed-toast {
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .fixed-toast:hover {
      transform: translateX(-5px);
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: white;
    }
    
    .fixed-toast.success { background: #10b981; }
    .fixed-toast.error { background: #ef4444; }
    .fixed-toast.warning { background: #f59e0b; }
    .fixed-toast.info { background: #3b82f6; }
    
    .toast-icon {
      font-size: 20px;
      margin-left: 12px;
    }
    
    .toast-message {
      flex: 1;
    }
    
    .toast-title {
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .toast-text {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      margin-right: -4px;
    }
    </style>
  `
  
  document.head.insertAdjacentHTML('beforeend', styles)
}

// تهيئة الـ styles عند تحميل الملف
addToastStyles()