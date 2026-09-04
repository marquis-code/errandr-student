import { defineStore } from 'pinia'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

export const useMarketPoolStore = defineStore('marketPool', {
  state: () => ({
    campaign: null,
    items: [],
    cart: []
  }),
  getters: {
    cartTotal: (state) => state.cart.reduce((total, item) => total + (item.appPrice * item.quantity), 0),
    cartItemCount: (state) => state.cart.reduce((count, item) => count + item.quantity, 0)
  },
  actions: {
    async fetchActiveCampaign() {
      try {
        const response = await api.get('/market-pool/active')
        if (response.data) {
          this.campaign = response.data.campaign
          this.items = response.data.items
          return response.data
        }
        return null
      } catch (error) {
        console.error('Error fetching market pool campaign', error)
        return null
      }
    },
    addToCart(item) {
      const existing = this.cart.find(i => i._id === item._id)
      if (existing) {
        existing.quantity++
      } else {
        this.cart.push({ ...item, quantity: 1 })
      }
    },
    removeFromCart(itemId) {
      this.cart = this.cart.filter(i => i._id !== itemId)
    },
    updateQuantity(itemId, quantity) {
      const item = this.cart.find(i => i._id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(itemId)
        } else {
          item.quantity = quantity
        }
      }
    },
    clearCart() {
      this.cart = []
    },
    async checkout() {
      try {
        const itemsPayload = this.cart.map(i => ({ itemId: i._id, quantity: i.quantity }))
        await api.post('/market-pool/checkout', {
          campaignId: this.campaign._id,
          items: itemsPayload
        })
        this.clearCart()
        return true
      } catch (error) {
        console.error('Checkout failed', error)
        throw error
      }
    }
  }
})
