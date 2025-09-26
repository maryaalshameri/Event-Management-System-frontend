// src/store/index.js (تحديث)
import { createStore } from 'vuex'
import api from '@/services/api'

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  getters: {
    isLogged: state => !!state.token,
    userRole: state => state.user?.role || null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearToken(state) {
      state.token = null
      localStorage.removeItem('token')
    },
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('user')
    },
  },
  actions: {
    async register({ commit }, payload) {
      try {
        const res = await api.post('/register', payload)
        commit('setToken', res.data.token)
        commit('setUser', res.data.user)
        return res
      } catch (error) {
        throw error.response?.data || error
      }
    },
    async login({ commit }, payload) {
      try {
        const res = await api.post('/login', payload)
        commit('setToken', res.data.token)
        commit('setUser', res.data.user)
        return res
      } catch (error) {
        throw error.response?.data || error
      }
    },
    async fetchUser({ commit, state }) {
      if (!state.token) return null
      try {
        const res = await api.get('/me')
        commit('setUser', res.data)
        return res
      } catch (error) {
        throw error.response?.data || error
      }
    },
    async logout({ commit }) {
      try {
        await api.post('/logout')
      } catch (e) {
        console.error('Logout error:', e)
      } finally {
        commit('clearToken')
        commit('clearUser')
      }
    },
    async initialize({ state, dispatch }) {
      if (state.token) {
        try {
          await dispatch('fetchUser')
        } catch (e) {
          dispatch('logout')
        }
      }
    },
  },
})