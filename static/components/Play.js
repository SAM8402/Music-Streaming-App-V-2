export default {
  template: `
  <body style="display: flex; margin: 0; padding: 0; justify-content: space-between; font-family: 'Jost',align-items: center; min-height: 100vh; height: 100vh; sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);">
    <div class="container mt-5" style="display: flex; justify-content: space-between; align-items: center; min-height: 100vh; height: 100vh;">
        <div class="image-container" style="flex: 1;">
            <h1 style="color: #ffffff;">{{ song.title }}</h1>
            <img :src='imagesrc' alt="Song Image" class="img-fluid" style="width: 400px; height: 400px; object-fit: cover; border-radius: 10px;">
            <br><br>
            <h4 style="color: #ffffff;">Artist Name: {{song.artistname}}</h4>
        </div>
        <div class="info-container" style="flex: 1; background-color: #f0f0f0; border-radius: 10px; padding: 20px;">
            <h3 style="color: #000;">Audio:</h3>
            <audio controls :src="audiosrc" autoplay>
                <source :src="audiosrc" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <br><br>
            <h3 style="color: #000;">Lyrics:</h3>
            <p style="color: #000;">{{song.lyrics}}</p>

            <h3 style="color: #000;">Rate this song: <p v-if="userRating == 0">0/5</p><p v-if="userRating == 1">1/5</p><p v-if="userRating == 2">2/5</p><p v-if="userRating == 3">3/5</p><p v-if="userRating == 4">4/5</p><p v-if="userRating == 5">5/5</p></h3>
            <div class="slidecontainer">
              <input type="range" :min="0" :max="5" v-model="userRating" class="slider" id="myRange">
            </div>
            
            <button @click="rate" class="btn btn-success" style="color: #fff;">Rate</button> 
            <button @click="report" v-if="rpt" class="btn btn-danger" style="color: #fff;">Report</button>
            <button @click="report" v-if="!rpt" class="btn btn-warning" style="color: #fff;">Unreport</button>
        </div>
    </div>
  </body>
  `,
  data() {
    return {
      song: {},
      userRating: 0,
      role: localStorage.getItem('role'),
      authToken: localStorage.getItem('auth-token'),
      audiosrc: '',
      imagesrc: '',
      rpt:true, 
      
    }
  },
  methods: {
    
    async rate() {
      try {
        const res = await fetch(`/rating/${this.song.song_id}`, {
          method: 'POST',
          headers: {
            'Authentication-Token': this.authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: this.userRating
          }),
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          location.reload();
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('An error occurred while submitting the rating.');
      }
    },
    async report() {
      try {
        const res = await fetch(`/api/flag_song/${this.song.song_id}`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.authToken,
            'Content-Type': 'application/json', // Added Content-Type header
          },
          body: JSON.stringify({}), // Added empty body
        });
        const data = await res.json();
        if (res.ok) {
          if (this.rpt){
            this.rpt= false 
          }else{
            this.rpt= true 
          }
          alert(data.message);
          // You may want to refresh the song data after submitting the report
          this.fetchSongById(this.song.song_id);
        } else {
          alert(data.message);
        }
      } catch (error) {
        // alert('An error occurred while submitting the report.');
      }
    },
    
  },
  async mounted() {
    try {
      const songId = this.$route.params.id; // Assuming you're using Vue Router with a dynamic route parameter
      const res = await fetch(`/song/${songId}`, {
        headers: {
          'Authentication-Token': this.authToken,
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.song = data.song;
        this.audiosrc = `static${data.song.mp3_path}`;
        this.imagesrc = `static${data.song.image_path}`;
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching the song.');
    }
  },
}
