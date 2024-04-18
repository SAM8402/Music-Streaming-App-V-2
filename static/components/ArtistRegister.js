export default {
    template: `
        <body style="margin: 0; padding: 0; font-family: 'Jost', sans-serif; background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);">
            <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; height: 80vh;">
                <div class="rounded-square" style="width: 800px; height: 800px; border-radius: 20px; background-color: #b8c0c5; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <h1>Kickstart Your Creators Journey</h1>
                    <h1>Start with Uploading Songs</h1>
                    <button @click="ChangeRole" class="btn btn-success circular-button" style="width: 350px; height: 350px; background-color: #573b8a; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #fff; text-decoration: none; font-weight: bold;">Start Uploading</button>
                </div>
            </div>
        </body>
    `,
    data() {
        return {
          role: localStorage.getItem('role'),
          token: localStorage.getItem('auth-token'),
        };
      },
    methods: {
        async ChangeRole() {
            try {
                const response = await fetch('/change_role/artist', {
                    headers: {
                        'Authentication-Token': this.token,  
                    },
                });
                const data = await response.json().catch((e) => {});
                // Handle response data as needed
                if (response.ok) {
                    alert(data.message);
                    localStorage.setItem('role', 'artist');
                    this.$router.push({ path: '/artist_dashboad' })
                    console.log(this.role);
                }else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error starting uploading:', error);
            }
        }
    }
}
