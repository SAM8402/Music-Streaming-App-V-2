export default {
  template: `
  <div>
    <body style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); height: 100vh; display: flex; flex-direction: column; align-items: center;">

      <div class="unit">
        <div class="left-half">
          <div class="container">
            <div class="rounded-square">
              <div class="top-half">
                <div class="left-content">
                  <h3 style="text-align: left; color: white;"><u>Normal Users : {{total_user}}</u></h3>
                </div>
                <div class="right-content">
                  <h3 style="text-align: right; color: white;"><u>Artists : {{total_artist}}</u></h3>
                </div>
              
            </div>
            </div>
          </div>
        </div>
        
        <div class="right-half">
          <div class="container">
          <div class="top-half">
          </div>
          <div class="roundedSquare">
          <div class="top-half">
          <div class="image-container">
          <img :src="userArtistGraph" alt="Graph between Number of Users, Artists" style="width: 750px;">
          
          <h2 style="text-align: left; color: white;"><u>     Graph between Number of Users, Artists</u></h2><br>
          </div>
          </div>
          <h3 style="text-align: left; color: white;"><u>Total Songs : {{total_song}}</u></h3>
          <h3 style="text-align: left; color: white;"><u>Avg Rating : {{avg_rating}}</u></h3>
          <div v-if="role === 'artist'" v-for="(count, artist) in flagged_songs_count" :key="artist">
                <h3 style="text-align: left; color: white;"><u>Flagged songs count for {{ artist }} : {{ count }}</u></h3>
          </div>
              
              <div class="bottom-half">
                <div class="image-container">
                <img :src="songRatingGraph" alt="Graph between Songs and their Rating" style="width: 750px;">

                  <h2 style="text-align: center; color: white;"><u>Graph between Songs and their Rating</u></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </div>
  `,
  data() {
    return {
      total_user: 0,
      total_artist: 0,
      total_song: 0,
      avg_rating:0,
      flagged_songs_count:0,
      userArtistGraph: '', 
      songRatingGraph: '',
      role: localStorage.getItem('role'),
      token: localStorage.getItem('auth-token'),
    };
  },
  async mounted() {
    try {
      const response = await fetch('/graph', { headers: { 'Authentication-Token': this.token } });
      const data = await response.json();
      // console.log(this.$route.path);
      if (response.ok) {
        this.total_user = data.total_user;
        this.total_artist = data.total_artist;
        this.avg_rating = data.avg_rating;
        this.total_song = data.total_songs;
        this.flagged_songs_count = data.flagged_songs_count;

        this.userArtistGraph = 'static/user_artist_graph.png';
        this.songRatingGraph = 'static/Song_rating_graph.png';
      } else {
        alert(data.message || 'Failed to fetch data from the server.');
      }
    } catch (error) {
      alert('An error occurred while fetching data.');
    }
  },
};
