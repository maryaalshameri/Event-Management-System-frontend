import api from './api'

export const organizerService = {
  // إحصائيات Dashboard
  async getDashboardStats() {
    try {
      const response = await api.get('/organizer/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // الفعاليات
  async getEvents(params = {}) {
    try {
      const response = await api.get('/organizer/events', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  async getEvent(id) {
    try {
      const response = await api.get(`/organizer/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  async createEvent(formData) {
    try {
      const response = await api.post('/organizer/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  async updateEvent(id, formData) {
    try {
      const response = await api.post(`/organizer/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  async deleteEvent(id) {
    try {
      const response = await api.delete(`/organizer/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // الطلبات - الدوال المفقودة
  async getOrders(params = {}) {
    try {
      const response = await api.get('/organizer/orders', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  async getOrder(id) {
    try {
      const response = await api.get(`/organizer/orders/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  }
}