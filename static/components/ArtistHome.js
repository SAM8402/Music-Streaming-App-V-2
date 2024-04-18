export default {
  template: `
    <div v-if="userRole === 'artist'" style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);">
      <div class="roundsquare">
        <h1 style="text-align: left; color: white;"><u>Dashboard</u></h1>
        <ul class="playlist-list">
          <li>
            <div class="roundedsquare">
              <h3 style="color: white;"><u>Total Songs Uploaded</u> : {{ total_songs }}</h3>
            </div>
          </li>
          <li>
            <div class="roundedsquare">
              <h3 style="color: white;"><u>Average Songs Rating</u> : {{ avg_rating }}</h3>
            </div>
          </li>
          <li>
            <div class="roundedsquare">
              <h3 style="color: white;"><u>Total Album</u> : {{ total_albums }}</h3>
            </div>
          </li>
        </ul>
      </div>

      <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; height: 80vh;">
        <div class="rounded-square" style="width: 2000px; height: auto; border-radius: 20px; background-color: #b8c0c5; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: auto; margin: auto;">
          <u><h2 style="text-align: left;">Your Songs</h2></u><br>
          <div class="dashboard" style="width: 80%; margin: 0 auto; text-align: center;">
            <table style="width: 100%; border-collapse: collapse">
              <thead>
                <th><u>Song Name</u></th>
                <th><u>Artist Name</u></th>
                <th><u>Song Duration</u></th>
                <th><u>Song Rating</u></th>
                <th><u>Song Release</u></th>
                <th><u>Actions</u></th>
              </thead>
              <tr  v-for="song in allSong" :key="song.song_id">
                <td>{{ song.sName }}</td>
                <td>{{ song.artistname }}</td>
                <td>{{ song.song_duration }}</td>
                <td>{{ song.rating }}</td>
                <td>{{ song.song_release }}</td>
                <td class="actions">
                <router-link v-if="song.song_id " class="btn btn-success" :to="'/play/' + song.song_id">Play</router-link>
                <router-link v-if="song.song_id " class="btn btn-info" :to="'/editsong/' + song.song_id">Edit</router-link>
                <button class="btn btn-danger" v-if="!song.sFlag && song.song_id" @click="deleteSong(song.song_id)">Delete</button>
                </td>
              </tr>
            </table>
          </div><br><br>

          <u><h2 style="text-align: left;">Your Album</h2></u><br>
          <div class="dashboard" style="width: 80%; margin: 0 auto; text-align: center;">
            <table style="width: 100%; border-collapse: collapse">
              <thead>
                <th><u>Album Name</u></th>
                <th><u>Album Duration</u></th>
                <th><u>Release Date</u></th>
                <th><u>Actions</u></th>
              </thead>
              <tr v-for="album in allAlbum" :key="album.album_id">
                <td>{{ album.aName }}</td>
                <td>{{ album.album_release }}</td>
                <td>{{ album.album_duration }}</td>
                <td class="actions">
                  <button class="btn btn-success" @click="editAlbum(album.aName)">View / Edit  </button>
                  <button class="btn btn-danger" @click="deleteAlbum(album.album_id)">Delete</button>
                </td>
              </tr>
            </table>

            <br><br>
            <img :src="songRatingGraph" alt="Song Ratings Graph" width="750" height="380">
            <u><h2>Graph between Songs and their Rating</h2></u>
            <br><br>
            <button @click="downlodResource" style="width: 350px; height: 50px; margin: 10px auto; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; margin-top: 20px; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;">Download Report</button><span v-if='isWaiting'>Waiting...</span>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      userRole: localStorage.getItem('role'),
      token: localStorage.getItem('auth-token'),
      allSong: [],
      allAlbum: [],
      songRatingGraph: '',
      total_songs: 0,
      total_albums: 0,
      flagged_songs_count: 0,
      avg_rating: 0,
      isWaiting: false,
    };
  },

  methods: {
    async downlodResource() {
      this.isWaiting = true
      const res = await fetch('/download-csv', {
        headers: {'Authentication-Token': this.token,},
      })
      const data = await res.json()
      if (res.ok) {
        const taskId = data['task-Id']
        console.log(data);
        console.log(taskId);
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskId}`)
          if (csv_res.ok) {
            this.isWaiting = false
            clearInterval(intv)
            window.location.href = `/get-csv/${taskId}`
          }
        }, 1000)
      }
    },
    async deleteSong(songId) {
      // Handle delete song action
      if (songId) {
          const res = await fetch(`/api/delete/song/${songId}`, {
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
    editAlbum(name) {
      // Handle edit album action
      return this.$router.push({ path: '/show/album/' + name });
    },
    async deleteAlbum(albumId) {
      // Handle delete album action
      if (albumId) {
        const res = await fetch(`/api/delete/album/${albumId}`, {
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
},

  async mounted() {
    try {
      const [songRes, albumRes, graphRes] = await Promise.all([
        fetch('/api/song', { headers: { 'Authentication-Token': this.token } }),
        fetch('/api/album', { headers: { 'Authentication-Token': this.token } }),
        fetch('/graph', { headers: { 'Authentication-Token': this.token } }),
      ]);

      const [albumData, songData, graphData] = await Promise.all([
        albumRes.json(),
        songRes.json(),
        graphRes.json(),
      ]);

      if (songRes.ok) {
        this.allSong = songData;
        this.total_songs = songData.length;
        console.log('this.allSong');
        console.log(this.allSong);
      } else {
        alert(songData.message);
      }

      if (albumRes.ok) {
        this.allAlbum = albumData;
        this.total_albums = albumData.length;
        console.log(this.allAlbum);
      } else {
        alert(albumData.message);
      }

      if (graphRes.ok) {
        this.avg_rating = graphData.avg_rating;
        this.flagged_songs_count = graphData.flagged_songs_count;
        this.songRatingGraph = 'static/Song_rating_graph.png';
      } else {
        alert(graphData.message || 'Failed to fetch data from the server.');
      }
    } catch (error) {
      this.error = 'An error occurred while fetching data.';
    }
  },
};
