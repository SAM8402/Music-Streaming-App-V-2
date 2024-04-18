import UserHome from './UserHome.js'
import AdminHome from './AdminHome.js'

export default {
  template: `
    <div>
      <UserHome v-if="userRole === 'user' || userRole === 'artist'" />
      <AdminHome v-if="userRole === 'admin'" />
      
    </div>
  `,

  data() {
    return {
      userRole: localStorage.getItem('role'),
      token: localStorage.getItem('auth-token'),
    }
  },

  components: {
    UserHome,
    AdminHome,
  },
}
