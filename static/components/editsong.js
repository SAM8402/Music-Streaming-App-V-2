export default {
  template: `
  <body style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); color: #ffffff; height: 100vh; width: 100vw;">
  <div class="container center-content">
    <br/><h1 style="color: #ffffff;"><u>Upload a New Song</u></h1><br />
    <!-- Genre Dropdown -->
    <div class="form-group">
        <label for="genre">Genre</label>
        <input type="text" id="genre" class="form-control" v-model="resource.gName" placeholder="Enter genre">
    </div><br/>

    <!-- Album Dropdown -->
    <div class="form-group">
        <label for="album">Album Title</label>
        <input type="text" id="album" class="form-control" v-model="resource.aName" placeholder="Enter album title">
    </div><br/>

    <!-- Title -->
    <div class="form-group">
        <label for="title">Song Title</label>
        <input type="text" id="title" class="form-control" v-model="resource.title" placeholder="Enter song title" required>
    </div><br/>

    <!-- Singer -->
    <div class="form-group">
        <label for="singer">Singer</label>
        <input type="text" id="singer" name="singer" class="form-control" v-model="resource.artistname" placeholder="Enter singer name" required>
    </div><br/>

    <!-- Release Date -->
    <div class="form-group">
        <label for="date">Release Date</label>
        <input type="date" id="date" name="date" class="form-control" v-model="resource.song_release" required>
    </div><br/>

    <!-- Duration -->
    <div class="form-group">
        <label for="time">Duration</label>
        <input type="number" placeholder="in minutes" id="time" name="time" max="1000" step="0.01" class="form-control" v-model="resource.song_duration" required>
    </div><br/>

    <!-- Lyrics -->
    <div class="form-group">
        <label for="lyrics">Lyrics</label>
        <textarea id="lyrics" name="lyrics" rows="3" class="form-control" v-model="resource.lyrics" placeholder="Enter lyrics" ></textarea>
    </div><br/>

    <!-- Update Button -->
    <button @click="update" style="width: 350px; height: 50px; margin: 10px auto; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; margin-top: 20px; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;" class="btn btn-success green-button">Update</button>
  </div>
</body>
  `,

  data() {
    return {
      song: {},
      resource: {
        gName: '',
        aName: '',
        title: '',
        artistname: '',
        song_release: '',
        song_duration: '',
        lyrics: '',
      },
      token: localStorage.getItem('auth-token'),
    }
  },

  methods: {
    async update() {
      try {
        const res = await fetch(`/api/update/song/${this.song.song_id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authentication-Token': this.token 
          },
          body: JSON.stringify(this.resource),
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          this.$router.push({ path: '/artist_dashboad' })
        } else {
          console.error('Server error:', data);
          alert('Error updating song. Please try again.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred. Please try again.');
      }
    },
  },
  
  async mounted() {
    try {
      const songId = this.$route.params.id; 
      const res = await fetch(`/song/${songId}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.song = data.song;
        // Set initial values for the resource based on the fetched song data
        this.resource = { ...this.song };
        console.log(this.resource );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching the song.');
    }
  },
}
