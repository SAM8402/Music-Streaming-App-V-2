export default {
  template: `
    <div>
      <div style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); height: 100vh; display: flex; flex-direction: column; align-items: center;">
        <div class="container">
          <div class="rounded-square">
            <h2 style="text-align: left; color: white;" class="mt-5"><u>Create Your Playlist</u></h2>
            <select v-model="playlistStatus" name="status" id="status">
            <option value="Private">Private</option>
            <option value="Public">Public</option>
            </select>
            <div class="form-group">
              <label for="playlistTitle">Playlist Title</label>
              <input type="text" v-model="playlistTitle" name="playlistTitle" id="playlistTitle" class="form-control" placeholder="Enter new playlist title">
            </div>
            <div class="dashboard">
              <table style="width: 100%; border-collapse: collapse; color: white;">
                <thead>
                  <th><u>Song Name</u></th>
                  <th><u>Play</u></th>
                </thead>
                <tbody>
                  <tr v-for="song in allSongs" :key="song.song_id" v-if ="!song.sFlag" style="color: white;">
                    <td>
                      <label>
                        {{ song.sName }}
                        <input
                          type="checkbox"
                          v-model="selectedSongs"
                          :value="song.song_id"
                          name="selected_songs"
                        />
                      </label>
                    </td>
                    <td>
                      <router-link class="btn btn-outline-success" :to="'/play/' + song.song_id">Play</router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button @click="createPlaylist" style="width: 150px; height: 40px; margin-top: 20px; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;">Create Playlist</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      allSongs: [],
      selectedSongs: [],
      playlistTitle: '',
      playlistStatus: 'Private', 
      token: localStorage.getItem('auth-token'),
    };
  },
  methods: {
    async createPlaylist() {
      try {
        if (this.playlistTitle ==='') {
          return alert("Please Give a Playlist Title");
        }
        if (this.selectedSongs === []) {
          return alert("Please Select Songs");
        }
        const playlistData = {
          title: this.playlistTitle,
          status: this.playlistStatus,
          songs: this.selectedSongs,
        };
        console.log(playlistData);
        const res = await fetch('/api/playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token,
          },
          body: JSON.stringify(playlistData),
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          return this.$router.push({ path: '/' });

        } else {
          console.error('Server error:', data);
          alert('Error creating playlist. Please try again.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred. Please try again.');
      }
    },
  },
  async mounted() {
    try {
      const songRes = await fetch('/api/all_song', {
        headers: { 'Authentication-Token': this.token },
      });

      if (!songRes.ok) {
        throw new Error('Failed to fetch songs.');
      }

      const songData = await songRes.json();
      this.allSongs = songData;
      console.log(this.allSongs);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      alert('An error occurred while fetching data.');
    }
  },
};
