export default {
  template: `
    <body>
      <div v-if="start" class="app" style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); background-image: url('https://w0.peakpx.com/wallpaper/469/723/HD-wallpaper-music-color-nice-text-word.jpg');">
        <div class="main" style="text-align: center;">
          <div class="banner-area" style="color: white;">
            <div class="banner-text">
              <h1 style="color: red; text-shadow: 0 0 5px aliceblue;"><b>WELCOME</b></h1>
              <h1 style="color: aliceblue; text-shadow: 0 0 5px aliceblue;"><b>TO</b></h1>
              <h1 style="color: #6d44b8;"><u><b>SoundScape</b></u></h1>
              <br /><br />
              <button @click="start = !start" style="width: 350px; height: 50px; margin: 10px auto; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; margin-top: 20px; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;">Start</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div style="background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div v-if="showLogin" class="text-center" style="color: #fff;">
            <h2 style="color: #fff;"><b><u>Log In</u></b></h2><br/><br/>
            <div class="mb-3 p-5 bg-light" style="max-width: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
              <div class="text-danger">*</div>
              <label for="user-email" class="form-label" style="color: #000;"><b><u>Email address</u></b></label>
              <input type="email" class="form-control" id="user-email" placeholder="name@example.com" required v-model="cred.email" style="margin-bottom: 10px;">
              <label for="user-password" class="form-label" style="color: #000;"><b><u>Password</u></b></label>
              <input type="password" class="form-control" id="user-password" v-model="cred.password" required style="margin-bottom: 15px;">
              <button @click="login" style="width: 300px; height: 50px; margin: 10px auto; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; margin-top: 20px; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;">Login</button>

              <button class="btn btn-secondary mt-3" @click="showLogin = !showLogin">Sign Up</button>
            </div> 
          </div> 
          <div v-else class="text-center" style="color: #fff;">
            <h2 style="color: #fff;"><b><u>Sign Up</u></b></h2><br/><br/>
            <div class="mb-3 p-5 bg-light" style="max-width: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
              <label for="user-name" class="form-label" style="color: #000;"><b><u>User Name</u></b></label>
              <input type="text" class="form-control" id="user-name" placeholder="User name" required v-model="cred.Username" style="margin-bottom: 10px;">
              <label for="user-email" class="form-label" style="color: #000;"><b><u>Email address</u></b></label>
              <input type="email" class="form-control" id="user-email" placeholder="name@example.com" required v-model="cred.email" style="margin-bottom: 10px;">
              <label for="user-password" class="form-label" style="color: #000;"><b><u>Password</u></b></label>
              <input type="password" class="form-control" id="user-password" v-model="cred.password" required style="margin-bottom: 15px;">
              <button @click="signup" style="width: 300px; height: 50px; margin: 10px auto; color: #fff; background: #573b8a; font-size: 1em; font-weight: bold; margin-top: 20px; outline: none; border: none; border-radius: 5px; transition: .2s ease-in; cursor: pointer;">Sign Up</button>

              <button class="btn btn-secondary mt-3" @click="showLogin = !showLogin">Log In</button>
            </div> 
          </div>
        </div>
      </div>
    </body>
  `,
  data() {
    return {
      start: true,
      showLogin: true,
      cred: {
        email: null,
        password: null,
        Username: null
      },
    }
  },
  methods: {
    async login() {
      const res = await fetch('/user-login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(this.cred),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('role', data.role)
        this.$router.push({ path: '/' })
      } else {
        alert( data.message)
      }
    },
    async signup() {
      const res = await fetch('/user-signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(this.cred),
      })
      const data = await res.json()
      if (res.ok) {
        this.login()
      } else {
        alert( data.message)
      }
    },
  },
}
