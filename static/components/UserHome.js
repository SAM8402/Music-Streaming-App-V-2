export default {
  template: `
    <div style="margin: auto; padding: auto; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); height: 100vh; overflow-y: auto;">
      <div v-if="allSong">
        <div v-if="search">
        <div v-if="album">
        <h2 class="mt-5" style="color: white;"><u>Search Result</u></h2>
            <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
              <li v-for="album in searchResult" v-if="!album.aFlag" style="width: calc(100% / 6);height: auto; padding: 10px;">
              <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
                <div style="min-width: 200px; min-height: 200px; border-radius: 20px; background-color: #b8c0c5; display: flex; justify-content: center; align-items: center; text-align: center; margin-left: 8px; padding: 10px;">
                  <button @click="getUrl('album', album.album_id, album.aName)" class="btn btn-info" style="color: #000000; text-decoration: none;">{{ album.aName }}</button>
                </div>
              </div>
              </li>
            </ul>
          </div>
          <div v-else-if="song ">
          <h2 class="mt-5" style="color: white;"><u>Search Result</u></h2>
          <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
          <li v-for="(song, index) in searchResult" v-if="!song.sFlag" :key="index" style="width: calc(100% / 6); padding: 10px;">
            <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
              <img :src="getStaticUrl(song.image_path)" alt="Song Image" class="img-fluid" style="width: 100%;" />
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;">
                <router-link :to="'/play/' + song.song_id" style="color: #ffffff; font-size: 18px; text-align: center; text-decoration: none;">{{ song.sName }}</router-link>
              </div>
              <span class="mt-5" style="color: white;font-size: 18px; text-align: center; text-decoration: none;">Name : {{ song.sName }}</span>

            </div>
          </li>
        </ul>
          </div>
          <div v-else-if="genre">
          <h2 class="mt-5" style="color: white;"><u>Search Result</u></h2>
            <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
              <li v-for="genre in searchResult" style="width: calc(100% / 6);height: auto; padding: 10px;">
              <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
              <div style="min-width: 200px; min-height: 200px; border-radius: 20px; background-color: #b8c0c5; display: flex; justify-content: center; align-items: center; text-align: center; margin-left: 8px; padding: 10px;">
                <button @click="getUrl('genre', genre.genre_id, genre.gName)" class="btn btn-info" style="color: #000000; text-decoration: none;">{{ genre.gName }}</button>
              </div>
          </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="allSong && allSong.length > 0">
        <h2 class="mt-5" style="color: white;"><u>All Songs</u></h2>
        <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
        <li v-for="(song, index) in allSong" v-if="!song.sFlag" :key="index" style="width: calc(100% / 6); padding: 10px;">
          <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
            <img :src="getStaticUrl(song.image_path)" alt="Song Image" class="img-fluid" style="width: 100%;" />
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;">
              <router-link :to="'/play/' + song.song_id" style="color: #ffffff; font-size: 18px; text-align: center; text-decoration: none;">{{ song.sName }}</router-link>
              </div>
              <span class="mt-5" style="color: white; font-size: 18px; text-align: center; text-decoration: none;">Name : {{ song.sName }}</span>
          </div>
        </li>
      </ul>
      </div>
      <div v-if="allSong && allSong.length > 0">
        <h2 class="mt-5" style="color: white;"><u>Recommended Tracks</u></h2>
        <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
          <li v-for="song in allSong" v-if="!song.sFlag && song.rating >= 3" style="width: calc(100% / 6); padding: 10px;">
            <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
              <img :src="getStaticUrl(song.image_path)" alt="Song Image" class="img-fluid" style="width: 100%;" />
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;">
              <router-link :to="'/play/' + song.song_id" style="color: #ffffff; font-size: 18px; text-align: center; text-decoration: none;">{{ song.sName }}</router-link>
              </div>
              <span class="mt-5" style="color: white;font-size: 18px; text-align: center; text-decoration: none;">Name : {{ song.sName }}</span>
            </div>
          </li>
        </ul>
        </div>
        <div v-if="allPlaylist && allPlaylist.length > 0">
          <h2 class="mt-5" style="color: white;"><u>Your Playlists</u></h2>
          <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
            <li v-for="playlist in allPlaylist" :key="playlist.playlist_id" style="width: calc(100% / 6); height: auto; padding: 10px;">
              <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
                <div style="min-width: 200px; min-height: 200px; border-radius: 20px; background-color: #b8c0c5; display: flex; justify-content: center; align-items: center; text-align: center; margin-left: 8px; padding: 10px;">
                  <button @click="getUrl('playlist', playlist.playlist_id, playlist.pName)" class="btn btn-info" style="color: #000000; font-size: 18px; text-align: center; text-decoration: none;">{{ playlist.pName }}</button>
                  <span  style ="padding-left: 10px;">
                  <button @click="deletePlaylist(playlist.pName)" class="btn btn-danger" style="color: #ffffff; font-size: 18px; text-align: center; text-decoration: none;">Delete</button></span>
                </div>
                
              </div>
            </li>
          </ul>
    </div>
        
        <div class="playlist">
          <button @click="getUrl('create_playlist')" class="btn btn-primary" style="color: #ffffff; text-decoration: none;">Create Playlist</button>
        </div>
        <div v-if="allAlbum && allAlbum.length > 0">
          <h2 class="mt-5" style="color: white;"><u>Albums</u></h2>
          <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
            <li v-for="album in allAlbum" :key="album.album_id" v-if="!album.aFlag" style="width: calc(100% / 6);height: auto; padding: 10px;">
              <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
                  <div style="min-width: 200px; min-height: 200px; border-radius: 20px; background-color: #b8c0c5; display: flex; justify-content: center; align-items: center; text-align: center; margin-left: 8px; padding: 10px;">
                  <button @click="getUrl('album', album.album_id, album.aName)" class="btn btn-info" style="color: #000000; font-size: 18px; text-align: center; text-decoration: none;">{{ album.aName }}</button>
                  </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="allGenre && allGenre.length > 0">
          <h2 class="mt-5" style="color: white;"><u>Genres</u></h2>
          <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap;">
            <li v-for="genre in allGenre" style="width: calc(100% / 6);height: auto; padding: 10px;">
              <div style="position: relative; width: 100%; height: auto; overflow: hidden; border-radius: 10px;">
                  <div style="min-width: 200px; min-height: 200px; border-radius: 20px; background-color: #b8c0c5; display: flex; justify-content: center; align-items: center; text-align: center; margin-left: 8px; padding: 10px;">
                    <button @click="getUrl('genre', genre.genre_id, genre.gName)" class="btn btn-info" style="color: #000000; font-size: 18px; text-align: center; text-decoration: none;">{{ genre.gName }}</button>
                  </div>
              </div>
            </li>
          </ul>
      </div>
      </div>
    </div>
  `,
  data() {
    return {
      allSong: [],
      allAlbum: [],
      allGenre: [],
      allPlaylist: [],
      searchResult: [],
      search: false,
      song: false,
      genre: false,
      album: false,
      token: localStorage.getItem('auth-token'),
    };
  },
  methods: {
    async searchresult() {
      const searchQuery = this.$route.query.q;
      // If searchQuery exists, filter the allSong array based on the query
      console.log(searchQuery);
      if (searchQuery) {
        this.search = true;
        const searchResult_song = this.allSong.filter(song => song.sName.includes(searchQuery));
        const searchResult_artistname = this.allSong.filter(song => song.artistname.includes(searchQuery));
        const searchResult_album = this.allAlbum.filter(album => album.aName.includes(searchQuery));
        const searchResult_genre = this.allGenre.filter(genre => genre.gName.includes(searchQuery));
        this.searchResult = [...searchResult_song, ...searchResult_album, ...searchResult_genre,...searchResult_artistname];
        if (searchResult_song.length > 0) {
          this.song = true;
          this.album = false;
          this.genre = false;
        }
        if (searchResult_artistname.length > 0) {
          this.song = true;
          this.album = false;
          this.genre = false;
        }
        if (searchResult_album.length > 0) {
          this.album = true;
          this.song = false;
          this.genre = false;
        }
        if (searchResult_genre.length > 0) {
          this.genre = true;
          this.song = false;
          this.album = false;
        }
      } else {
        this.search = false;
        this.searchResult = [];
        this.song = false;
        this.album = false;
        this.genre = false;
      }
    },
    

    getUrl(type, id, name) {
      if (type === 'create_playlist') {
        return this.$router.push({ path: '/playlist' });
      }
      if (type === 'playlist') {
        return this.$router.push({ path: '/show/' + type + '/' + name });
      }
      if (type === 'album') {
        return this.$router.push({ path: '/show/' + type + '/' + name });
      }
      if (type === 'genre') {
        return this.$router.push({ path: '/show/' + type + '/' + name });
      }
      
    },
    getStaticUrl(filename) {
      // Implement your static URL generation logic here
      return `/static/${filename}`;
    },
    async deletePlaylist(name) {
      // Handle delete Playlist action
      if (name) {
          const res = await fetch(`/api/delete/playlist/${name}`, {
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
      const [songRes, albumRes, genreRes,playlistRes] = await Promise.all([
        fetch('/api/all_song', { headers: { 'Authentication-Token': this.token } }),
        fetch('/api/all_album', { headers: { 'Authentication-Token': this.token } }),
        fetch('/api/all_genre', { headers: { 'Authentication-Token': this.token } }),
        fetch('/api/playlist', { headers: { 'Authentication-Token': this.token } }),
      ]);
      
      const [songData, albumData, genreData,playlistData] = await Promise.all([
        songRes.json(),
        albumRes.json(),
        genreRes.json(),
        playlistRes.json(),
      ]);
  
      if (songRes.ok) {
        this.allSong = songData;
        console.log('allSong data:', this.allSong);
      } else {
        console.error('Error fetching song data:', songData);
        alert(songData.message || 'Failed to fetch song data');
      }
  
      if (albumRes.ok) {
        this.allAlbum = albumData;
        console.log("album",this.allAlbum);
      } else {
        console.error('Error fetching album data:', albumData);
        alert(albumData.message || 'Failed to fetch album data');
      }
  
      if (genreRes.ok) {
        this.allGenre = genreData;
      } else {
        console.error('Error fetching genre data:', genreData);
        alert(genreData.message || 'Failed to fetch genre data');
      }
      if (playlistRes.ok) {
        this.allPlaylist = playlistData;
        console.log(this.allPlaylist);
      } else {
        console.error('Error fetching genre data:', genreData);
        alert(genreData.message || 'Failed to fetch genre data');
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      this.error = 'An error occurred while fetching data.';
    }
  },
  watch: {
    '$route.query.q': {
      handler: 'searchresult',
      immediate: true,
    },
  },
  
};
