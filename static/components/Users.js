export default {
  template: `
    <div>
      <body style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); height: 100vh; display: flex; flex-direction: column; align-items: center;">

        <div class="container">
          <div class="rounded-square">
            <h2 style="text-align: left; color: white;"><u>Users</u></h2><br>
            <div class="dashboard">
              <table style="width: 100%; border-collapse: collapse; color: white;">
                <thead>
                  <th><u>Name</u></th>
                  <th><u>Status</u></th>
                  <th><u>Actions</u></th>
                </thead>
                <tbody>
                <tr v-for="user in allUsers" :key="user.id" style="color: white;">
                  <td v-if="user.username !== 'admin'">{{ user.username }}</td>
                  <td v-if="user.role[0] === 'artist'">Activate</td>
                  <td v-if="user.role[0] !== 'artist'">Deactivate </td>
                  <td v-if="user.username !== 'admin'">
                    <button class="btn btn-outline-success" v-if="user.role[0] !== 'artist'" @click="approve(user.id)">Activate</button>
                    <button class="btn btn-outline-danger" v-if="user.role[0] === 'artist'" @click="approve(user.id)">Deactivate</button>
                  </td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>

        <div><p style="text-align: left; color: white;">_________________________________________________________________________________________________________________________________________________________________________________</p></div>

        <div class="container">
          <div class="rounded-square">
            <h2 style="text-align: left; color: white;"><u>Songs</u></h2><br>
            <div class="dashboard">
              <table style="width: 100%; border-collapse: collapse; color: white;">
                <thead>
                  <th><u>Song Name</u></th>
                  <th><u>Status</u></th>
                  <th><u>Actions</u></th>
                </thead>
                <tbody>
                  <tr v-for="song in allSong" :key="song.song_id" style="color: white;">
                    <td>{{ song.sName }}</td>
                    <td v-if="!song.sFlag">Activate</td>
                    <td v-if="song.sFlag">Deactivate</td>
                    <td>
                    <router-link class="btn btn-outline-success" :to="'/play/' + song.song_id">Play</router-link>
                      <button class="btn btn-outline-danger"  @click="deleteItem(song.song_id, 'song')">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div><p style="text-align: left; color: white;">_________________________________________________________________________________________________________________________________________________________________________________</p></div>

        <div class="container">
          <div class="rounded-square">
            <h2 style="text-align: left; color: white;"><u>Albums</u></h2><br>
            <div class="dashboard">
              <table style="width: 100%; border-collapse: collapse; color: white;">
                <thead>
                  <th><u>Album Name</u></th>
                  <th><u>Status</u></th>
                  <th><u>Actions</u></th>
                </thead>
                <tbody>
                  <tr v-for="album in allAlbum" :key="album.album_id" style="color: white;">
                    <td>{{ album.aName }}</td>
                    <td v-if="!album.aFlag">Activate</td>
                    <td v-if="album.aFlag">Deactivate</td>
                    <td>
                    <router-link class="btn btn-outline-success" :to="'/show/album/' + album.aName">View</router-link>
                      <button class="btn btn-outline-danger"  @click="deleteItem(album.album_id, 'album')">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </body>
    </div>
  `,
  data() {
    return {
      allUsers: [],
      allSong: [],
      allAlbum: [],
      role: localStorage.getItem('role'),
      token: localStorage.getItem('auth-token'),
    };
  },
  
  methods: {
    async approve(itemId) {
      try {
        
        const res = await fetch(`/change_activate/artist/${itemId}`, {
          headers: {
            'Authentication-Token': this.token,
          },
        });
        const data = await res.json().catch((e) => {});
        if (res.ok) {
          alert(data.message);
          location.reload();
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('An error occurred while approving/deactivating the user.');
      }
    },
    async deleteItem(Id, itemType) {
      try {
        console.log(Id,itemType);
        if (Id) {
          console.log(Id,itemType);
        if (itemType === 'album') {
          const res = await fetch(`/api/delete/album/${Id}`, {
            method: 'DELETE',
            headers: {'Authentication-Token': this.token,},
          });
          const data = await res.json().catch((e) => {});
          if (res.ok) {
            alert(data.message);
            location.reload();
          } else {
            alert(data.message);
          }
        } else {
          const res = await fetch(`/api/delete/song/${Id}`, {
            method: 'DELETE',
            headers: {'Authentication-Token': this.token,},
          });
          const data = await res.json().catch((e) => {});
          if (res.ok) {
            alert(data.message);
            location.reload();
          } else {
            alert(data.message);
          }
        }
      }
      } catch (error) {
        alert('An error occurred while DELETE.');
      }
    },
  },
  async mounted() {
    try {
      const [songRes, albumRes, usersRes] = await Promise.all([
        fetch('/api/all_song', { headers: { 'Authentication-Token': this.token } }),
        fetch('/api/all_album', { headers: { 'Authentication-Token': this.token } }),
        fetch('/users', { headers: { 'Authentication-Token': this.token } }),
      ]);
      
      const [songData, albumData, userData] = await Promise.all([
        songRes.json(),
        albumRes.json(),
        usersRes.json(),
      ]);
      
      if (songRes.ok) {
        this.allSong = songData;
      } else {
        alert(songData.message);
      }

      if (albumRes.ok) {
        this.allAlbum = albumData;
      } else {
        alert(albumData.message);
      }

      if (usersRes.ok) {
        this.allUsers = userData;
      } else {
        alert(userData.message);
      }
    } catch (error) {
      alert('An error occurred while fetching data.');
    }
  },
};
