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
    async fetchActiveCampaign(campaignId = null) {
      try {
        const response = await api.get('/market-pool/active-campaigns')
        if (response.data && response.data.length > 0) {
          const activeData = campaignId ? response.data.find(c => c.campaign._id === campaignId) : response.data[0]
          
          if (activeData) {
            this.campaign = activeData.campaign
            this.items = activeData.items
            
            // If the cart has items from a different campaign, clear it to prevent cross-contamination
            if (this.cart.length > 0 && this.cart[0].campaignId && this.cart[0].campaignId !== activeData.campaign._id) {
               this.clearCart()
            }
            return activeData
          }
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
      this.cart.push({ ...item, quantity, preferences, cartId, campaignId: this.campaign._id })
      this.saveCart()
    },
    removeFromCart(cartId) {
      this.cart = this.cart.filter(i => i.cartId !== cartId)
      this.saveCart()
    },
    updateQuantity(cartId, quantity) {
      const item = this.cart.find(i => i.cartId === cartId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(cartId)
        } else {
          item.quantity = quantity
          this.saveCart()
        }
      }
    },
    clearCart() {
      this.cart = []
      this.saveCart()
    },
    initCart() {
      if (process.client) {
        const saved = localStorage.getItem('marketPoolCart')
        if (saved) {
          try { this.cart = JSON.parse(saved) } catch (e) { console.error('Failed to parse cart', e) }
        }
      }
    },
    saveCart() {
      if (process.client) {
        localStorage.setItem('marketPoolCart', JSON.stringify(this.cart))
      }
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
