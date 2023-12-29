<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>
  <div class="pageContainer">

    <div class="headerContainer">
      <h1 v-if="logoutStatus === false" id="areYouSureMsg">
        Do you wish to log out?
      </h1>
      <h1 v-else>Logout successful!</h1>
    </div>

    <!-- Display button to log out if user is logged in -->
    <!-- And button to return to menu if already logged out -->
    <form @submit.prevent="logUserOut" v-if="!logoutStatus">
      <button class="logoutButton">Confirm Logout</button>
    </form>
    <router-link class="logoutButton" id="returnToMenu" v-else to="/main"
      >Return to main page</router-link
    >
  </div>
</template>

<script>
import { app } from "../main.js";
import NavBar from "./NavBar.vue";

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      loginStatus: app.config.globalProperties.$authenticated,
      logoutStatus: false,
    };
  },
  mounted() {
    this.checkCurrentStatus();
  },
  methods: {
    checkCurrentStatus() {
      // Check if user is currently logged out
      if (app.config.globalProperties.$authenticated === false) {
        this.logoutStatus = true;
      } else {
        this.logoutStatus = false;
      }
    },
    logUserOut() {
      // Reset all global variables
      app.config.globalProperties.$idToken = "";
      app.config.globalProperties.$expiresIn = "";
      app.config.globalProperties.$authenticated = false;

      app.config.globalProperties.$userAccountType = "Guest";
      app.config.globalProperties.$userIdent = "1";
      app.config.globalProperties.$accountName = "";
      this.checkCurrentStatus();
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 15px;
}

.logoutButton {
  width: 150px;
  border: none;
  background-color: #d43b3b;
  border-radius: 5px;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.2s;
  color: white;
}

.logoutButton:hover {
  background-color: #ff6962;
  color: white;
}

.pageContainer {
  padding-top: 150px;
  padding-bottom: 250px;
  font-family: Helvetica;
  text-align: center;
}

#returnToMenu {
  background-color: #4090eb;
}

#returnToMenu:hover {
  background-color: #5ea9ff;
  color: white;
}
</style>
