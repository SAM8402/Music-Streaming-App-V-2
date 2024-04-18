import Home from './components/Home.js'
import Login from './components/Login.js'
import Users from './components/Users.js'
import ArtistHome from './components/ArtistHome.js'
import ArtistRegister from './components/ArtistRegister.js'
import ResourceForm from './components/ResourceForm.js'
import Play from './components/Play.js'
import Playlist from './components/playlist.js'
import EditSong from './components/editsong.js'
import Show from './components/showlist.js'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/artist_dashboad', component: ArtistHome},
  { path: '/artist_register', component: ArtistRegister},
  { path: '/login', component: Login, name: 'Login' },
  { path: '/users', component: Users },
  { path: '/playlist', component: Playlist },
  { path: `/play/:id`, component: Play },
  { path: `/show/:type/:name`, component: Show }, 
  { path: `/editsong/:id`, component: EditSong },
  { path: '/create-resource', component: ResourceForm },
]

export default new VueRouter({
  routes,
})
