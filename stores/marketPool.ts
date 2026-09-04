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
    addToCart(item, preferences = '', quantity = 1) {
      // Create a unique cart ID to allow same items with different preferences
      const cartId = `${item._id}_${Date.now()}`
      this.cart.push({ ...item, quantity, preferences, cartId })
    },
    removeFromCart(cartId) {
      this.cart = this.cart.filter(i => i.cartId !== cartId)
    },
    updateQuantity(cartId, quantity) {
      const item = this.cart.find(i => i.cartId === cartId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(cartId)
        } else {
          item.quantity = quantity
        }
      }
    },
    clearCart() {
      this.cart = []
    },
    async checkout(deliveryDetails = {}) {
      try {
        const itemsPayload = this.cart.map(i => ({ 
          itemId: i._id, 
          quantity: i.quantity,
          preferences: i.preferences || '' 
        }))
        const response = await api.post('/market-pool/checkout', {
          campaignId: this.campaign._id,
          items: itemsPayload,
          deliveryDetails
        })
        this.clearCart()
        return response.data
      } catch (error) {
        console.error('Checkout failed', error)
        throw error
      }
    }
  }
})
