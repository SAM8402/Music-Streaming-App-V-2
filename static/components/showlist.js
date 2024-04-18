export default {
  template: `
    <div>
      <div style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); height: 100vh; display: flex; flex-direction: column; align-items: center;">
        <div class="container">
          <div class="rounded-square">
            <h1 v-if="this.$route.params.type === 'playlist'" style="text-align: left; color: white;" class="mt-5"><u>Your Playlist :- {{this.$route.params.name}}</u></h1>
            <button class="btn btn-outline-danger" v-if="$route.params.type === 'playlist'" @click="deletePlaylist()">Delete Playlist</button>
            <h1 v-if="this.$route.params.type === 'album'" style="text-align: left; color: white;" class="mt-5"><u>Your Album :- {{this.$route.params.name}}</u></h1>
            <h1 v-if="this.$route.params.type === 'genre'" style="text-align: left; color: white;" class="mt-5"><u>Your Genre :- {{this.$route.params.name}}</u></h1>
            <button v-if="this.$route.params.type !== 'genre'" @click="rename($route.params.type)" class="btn btn-info" style="color: #000;">Rename</button>
            <button v-if="this.$route.params.type === 'album'" @click="report" class="btn btn-danger" style="color: #fff;">Report</button>
            </br></br>
            <div class="form-group">
            </div>
            <div class="dashboard">
              <table style="width: 100%; border-collapse: collapse; color: white;">
                <thead>
                  <th><h3><u>Song Name</u></h3></th>
                  <th><h3><u>Action</u></h3></th>
                </thead>
                <tbody>
                  <tr v-for="song in allSongs" :key="song.song_id" style="color: white;">
                    <td v-if="!song.sFlag">
                    <h5>{{ song.sName }} </h5>
                    </td>
                    <td>
                      <router-link v-if="!song.sFlag" class="btn btn-outline-success" :to="'/play/' + song.song_id">Play</router-link>
                      <button 
                          class="btn btn-outline-danger" 
                          v-if="!song.sFlag && (($route.params.type === 'album' || $route.params.type === 'genre') && role !== 'user')"
                          @click="deleteItem(song.song_id)"
                      >
                          Delete
                      </button>
                      <button 
                          class="btn btn-outline-danger" 
                          v-if="!song.sFlag && ($route.params.type === 'playlist')" 
                          @click="deletePlaylistSong(song.song_id)"
                      >
                          Delete
                      </button>



                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      allSongs: [],
      albumid:0,
      genreid:0,
      playlistid:0,
      newName: '',
      role: localStorage.getItem('role'),
      token: localStorage.getItem('auth-token'),
    };
  },
  methods: {
    async deletePlaylist(name=this.$route.params.name) {
      // Handle delete Playlist action
      if (name) {
          const res = await fetch(`/api/delete/playlist/${name}`, {
            method: 'DELETE',
            headers: {'Authentication-Token': this.token,},
          });
          const data = await res.json().catch((e) => {});
          if (res.ok) {
            alert(data.message);
            return this.$router.push({ path: '/' });
          } else {
            alert(data.message);
          }
      }
    },
    async deletePlaylistSong(id) {
      // Handle delete Playlist action
      if (id) {
          const res = await fetch(`/api/delete/playlist/song/${id}`, {
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
    },
    async rename(typ) {
      // Function to handle renaming
      const newName = prompt('Enter new name:');
      if (newName) {
        try {
            if (typ === 'album') {
            const res = await fetch(`/api/update/album/${this.albumid}`, {
              method: 'PUT',
              headers: {
                'Authentication-Token': this.token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: newName }),
            });
            const data = await res.json();
            if (res.ok) {
              alert(data.message);
              // Refresh the data after renaming
              return this.$router.push({ path: '/show/album/' + newName });
            } else {
              alert(data.message);
            }
          }
            if (typ === 'playlist') {
            const res = await fetch(`/api/update/playlist/${this.playlistid}`, {
              method: 'PUT',
              headers: {
                'Authentication-Token': this.token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ pName: newName }),
            });
            const data = await res.json();
            if (res.ok) {
              alert(data.message);
              // Refresh the data after renaming
              return this.$router.push({ path: '/show/playlist/' + newName });
            } else {
              alert(data.message);
            }
          }
        } catch (error) {
          console.error('An error occurred while renaming:', error);
          alert('An error occurred while renaming.');
        }
      }
    },
    async report() {
      try {
        const res = await fetch(`/api/flag_album/${this.albumid}`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json', // Added Content-Type header
          },
          body: JSON.stringify({}), // Added empty body
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          // You may want to refresh the song data after submitting the report
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('An error occurred while submitting the report.');
      }
    },
  },
  async mounted() {
    const name = this.$route.params.name;
    const type = this.$route.params.type;
    try {
      if (type === 'playlist') {
        const songRes = await fetch(`/api/playlist/${name}`, {
          headers: { 'Authentication-Token': this.token },
        });
    
        if (!songRes.ok) {
          throw new Error('Failed to fetch songs.');
        }
    
        const songData = await songRes.json();
        console.log(songData);
        this.allSongs = [...this.allSongs, ...songData];
        
        console.log("allSongs", this.allSongs);
      }
      if (type === 'album') {
        const songRes = await fetch('/api/all_song', {
          headers: { 'Authentication-Token': this.token },
        });
  
        if (!songRes.ok) {
          throw new Error('Failed to fetch songs.');
        }
  
        const songData = await songRes.json();
        this.allSongs = songData;
        this.allSongs = this.allSongs.filter(song => song.albumname === name);
        console.log("allSongs",this.allSongs);
      }
      if (type === 'genre') {
        const songRes = await fetch('/api/all_song', {
          headers: { 'Authentication-Token': this.token },
        });
  
        if (!songRes.ok) {
          throw new Error('Failed to fetch songs.');
        }
  
        const songData = await songRes.json();
        this.allSongs = songData;
        console.log("allSongs",this.allSongs);
        this.allSongs = this.allSongs.filter(song => song.genrename === name);
      }
      this.albumid = this.allSongs.length > 0 ? this.allSongs[0].albumid : null;
      this.playlistid = this.allSongs.length > 0 ? this.allSongs[0].playlistid : null;
      this.genreid = this.allSongs.length > 0 ? this.allSongs[0].genreid : null;

    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      alert('An error occurred while fetching data.');
    }
  },
  // created() {
  //   this.showPlaylist();
  // },
};
