export default {
  template: `
    <nav class="navbar navbar-dark bg-dark" v-if="is_login">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <span class="navbar-brand">{{ role.toUpperCase() }}</span>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="role === 'admin'">
              <router-link class="nav-link" to="/users">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="role === 'artist'">
              <router-link class="nav-link" to="/artist_dashboad">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="role === 'artist'">
              <router-link class="nav-link" to="/create-resource">Upload</router-link>
            </li>
            <li class="nav-item" v-if="is_login">
              <button class="nav-link" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
        <div class="d-flex" v-if="is_login && (role === 'user' || role === 'artist') && (this.$route.path === '/')"> 
          <input class="form-control me-2" type="search" placeholder="Search" id="search" aria-label="Search" v-model="input">
          <button class="btn btn-outline-success" @click="search()">Search</button>
          <button v-if="role === 'user'" class="btn btn-outline-light" @click="Creater()">New Creater</button>
          </div>
      </div>
    </nav>
  `,
  data() {
    return {
      role: localStorage.getItem('role'),
      is_login: localStorage.getItem('auth-token'),
      input: null,
    }
  },
  methods: {
    logout() {
      if (window.confirm("Do you want to LOGOUT")) {
        (async () => {
          try {
            const res = await fetch(`/user-logout`, {});
            const data = await res.json()
            if (res.ok) {
              localStorage.removeItem('auth-token');
              localStorage.removeItem('role');
              this.$router.push({ path: '/login' });
            } else {
              alert(data.message);
            }
          } catch (error) {
            console.error('An error occurred during logout:', error);
            alert('An unexpected error occurred during logout. Please try again.');
          }
        })();
      }
    },
    search() {
      if (this.input) {
        this.$router.push({ path: '/', query: { q: this.input } });
      }
    },
    Creater(){
      this.$router.push({ path: '/artist_register' });
      
    },
  },
}
