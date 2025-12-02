import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: null,
      accessToken: null, // ⬅️ Only token loaded from localStorage
      userId: null,
      highestRole: null,
      highestRoleId: null
    },
    refreshToken: null,
    userDetails: null
  }),

  getters: {
    getAccessToken: (state) => state.user?.accessToken,
    isAuthenticated: () => !!localStorage.getItem('accessToken'),
    getUserName: (state) => state.user?.name,
    getUserDetails: (state) => state.userDetails,
    getHighestRole: (state) => state.user?.highestRole,
    getHighestRoleId: (state) => state.user?.highestRoleId,
    getUserId: (state) => state.user?.userId
  },

  actions: {
    login(userData) {
      // Save token manually
      localStorage.setItem('accessToken', userData.accessToken)

      // Update reactive state
      this.user = {
        ...this.user,
        name: userData.name,
        accessToken: userData.accessToken
      }
    },

    authenticateUserInfo(userDetails) {
      this.userDetails = userDetails

      const roleHierarchy = {
        'admin': 4,
        'subadmin': 3,
        'staff': 2,
        'employee': 1
      }

      let highestRole = null
      let highestValue = 0
      let highestRoleId = null

      if (userDetails.roles?.data) {
        userDetails.roles.data.forEach(role => {
          const currentValue = roleHierarchy[role.name] || 0
          if (currentValue > highestValue) {
            highestValue = currentValue
            highestRole = role.name
            highestRoleId = role.id
          }
        })
      }

      this.user = {
        ...this.user,
        userId: userDetails.id,
        highestRole,
        highestRoleId
      }
    },

    logout() {
      localStorage.removeItem('accessToken');
      this.$reset();

      this.user = {
        name: null,
        accessToken: null,
        userId: null,
        highestRole: null,
        highestRoleId: null
      }
      this.userDetails = null
      this.refreshToken = null
    }
  },

  // Persist only selected fields (exclude accessToken)
  persist: {
    paths: ['user.name', 'user.userId', 'user.highestRole', 'user.highestRoleId', 'userDetails']
  }
})
