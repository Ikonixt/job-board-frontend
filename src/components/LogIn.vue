<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>
  <div class="pageContainer">

    <div class="headerContainer">
      <h1 id="helloMsg">Hello!</h1>
      <p id="loginWelcomeMsg">Log in to your account</p>
      <!-- Display error message if login input is invalid -->
      <h5 class="loginErrorMsg" v-if="invalidLogin">
        Wrong password or account does not exist
      </h5>
    </div>
    
    <!-- Form for input submission -->
    <form class="loginContainer" @submit.prevent="submitForm">
      <p>
        <input
          class="inputField"
          id="email"
          v-model="email"
          placeholder="Email"
          required
        />
      </p>

      <p>
        <input
          class="inputField"
          type="password"
          id="password"
          placeholder="Password"
          v-model="password"
          required
        />
      </p>

      <button class="loginButton">Login</button>
    </form>
  </div>
</template>

<script>
import { app } from "../main.js";
import AxiosService from "../services/AxiosService.js";
import NavBar from "./NavBar.vue";

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      loginStatus: app.config.globalProperties.$authenticated,
      email: "",
      password: "",
      invalidLogin: false,
    };
  },
  methods: {
    submitForm() {
      // Post login information to firebase for verification
      AxiosService.postLogin({
        email: this.email,
        password: this.password,
        returnSecureToken: true,
      })
        .then((firebaseResponse) => {
          console.log(firebaseResponse.data);
          // Handle the case that an error is responded back
          if (firebaseResponse.error != null) {
            console.log(firebaseResponse.data.error);
          } else {
            // Set global variables and hide error message
            this.invalidLogin = false;

            app.config.globalProperties.$idToken =
              firebaseResponse.data.idToken;
            app.config.globalProperties.$expiresIn =
              firebaseResponse.data.expiresIn;
            app.config.globalProperties.$authenticated = true;
            app.config.globalProperties.$userIdent =
              firebaseResponse.data.displayName;

            // Get account type and account name from database
            AxiosService.getUserAccount()
              .then((response) => {
                const data = response.data;
                for (const objectId in data) {
                  if (objectId === app.config.globalProperties.$userIdent) {
                    app.config.globalProperties.$userAccountType =
                      data[objectId].accountType;
                    app.config.globalProperties.$accountName =
                      data[objectId].name;
                  }
                }
                this.$router.push("/main");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          this.invalidLogin = true;
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.loginContainer {
  align-content: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 10px;
}

.loginErrorMsg {
  font-family: Helvetica;
  font-weight: lighter;
  margin: 0px;
  padding: 0px;
  color: red;
}

.loginButton {
  width: 150px;
  border: none;
  background-color: #4090eb;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.2s;
  color: white;
}

.loginButton:hover {
  background-color: #5ea9ff;
  color: white;
}

.headerContainer {
  font-family: Helvetica;
  text-align: center;
}

.pageContainer {
  padding-top: 80px;
  padding-bottom: 190px;
}

#loginWelcomeMsg {
  font-size: 15px;
  margin-top: 0px;
  padding-top: 0px;
  margin-bottom: 20px;
}

#helloMsg {
  font-size: 55px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}

</style>
