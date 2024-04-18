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
              <input type="text" id="title" class="form-control" v-model="resource.sName" placeholder="Enter song title" required>
          </div><br/>
          <!-- Singer -->
          <div class="form-group">
              <label for="singer">Singer</label>
              <input type="text" id="singer" name="singer" class="form-control" v-model="resource.singer" placeholder="Enter singer name" required>
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
          <!-- MP3 File -->
          <div class="form-group">
              <label for="audio_file">Select Audio File (MP3)</label>
              <input type="file" id="audio_file" name="audio_file" class="form-control-file" @change="FileUpload" accept=".mp3" required>
          </div><br/>
          <!-- Thumbnail -->
          <div class="form-group">
              <label for="image_file">Thumbnail</label>
              <input type="file" id="image_file" name="image_file" class="form-control-file" @change="ImageUpload"  accept=".jpg, .jpeg, .png" required>
          </div><br/>

          <!-- Upload Button -->
          <button @click="createResource" style="width: 350px; height: 50px; margin: 10px auto; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; margin-top: 20px; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;" class="btn btn-success green-button">Upload</button>
  </div>
</body>


  `,

  data() {
    return {
      resource: {
        gName: null,
        aName: null,
        sName: null,
        singer: null,
        song_release: null,
        song_duration: null,
        lyrics: null,
      },
      audio_file: null,
      image_file: null,
      token: localStorage.getItem('auth-token'),
    }
  },

  methods: {
    FileUpload(event) {
      this.audio_file = event.target.files[0];
      console.log('Audio File:', this.audio_file);
    },

    ImageUpload(event) {
      this.image_file = event.target.files[0];
      console.log('Image File:', this.image_file);
    },

    

    async createResource() {
      try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(this.resource));
        
        if (this.audio_file) {
          formData.append('audio_file', this.audio_file);
        }
        if (this.image_file) {
          formData.append('image_file', this.image_file);
        }

        
        const res = await fetch('/api/song', {
          method: 'POST',
          headers: { 'Authentication-Token': this.token },
          body: formData,
        });
        console.log(res);

        const data = await res.json();
        console.log(data);

        if (res.ok) {
          alert(data.message);
          this.$router.push({ path: '/artist_dashboad' })
        } else {
          const errorData = await res.json();
          console.error('Server error:', errorData);
          alert('Error uploading song. Please try again.');
        }
      } catch (error) {
        console.error('error:', error);
        alert('Unexpected error occurred. Please try again.');
      }
    },
  },
}
