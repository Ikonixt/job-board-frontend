<template>
  <nav-bar :loginStatus="this.loginStatus"></nav-bar>
  <div class="pageContainer">

      <!-- Landing page for unauthorized access -->
    <div class="headerContainer">
      <h1 id="msg">You are not authorized</h1>
    </div>

      <router-link class="returnButton" to="/main">Return</router-link>
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
    };
  },
}
</script>


<style scoped>
.returnButton {
    margin-top: 2%;
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

.returnButton:hover {
  background-color: #5ea9ff;
  color: white;
}

.headerContainer {
  font-family: Helvetica;
  text-align: center;
}

.pageContainer {
  padding-top: 140px;
  padding-bottom: 200px;
}

#msg {
  font-size: 55px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>