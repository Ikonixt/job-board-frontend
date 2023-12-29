<template>
  <div class="wrapper">
    <ul>
      <li style="float: left; font-weight: bold">
        <router-link class="navElement" to="/">Job Dashboard</router-link>
      </li>
      <!-- Display login and signup only if user is logged out -->
      <!-- And display logout only if user is logged in -->
      <li>
        <router-link class="navElement" v-if="loginStatus===true" to="/logOut">Log out</router-link>
      </li>
      <li>
        <router-link class="navElement"  v-if="loginStatus===false" to="/logIn">Log in</router-link>
      </li>
      <li>
        <router-link class="navElement"  v-if="loginStatus===false" to="/signUp">Sign Up</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["loginStatus"]
};
</script>

<style scoped>
/* Navbar modified from https://www.w3schools.com/css/css_navbar.asp */

ul {
  background-color: #181d31;
  border-radius: 5px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style-type: none;
}

li {
  float: right;
}

li .navElement {
  font-size: 25;
  font-family: Helvetica;
  display: block;
  color: #faf9f6;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li .navElement:hover {
  background-color: black;
}

.wrapper {
  margin-top: 0;
  padding-bottom: 0px;
}
</style>
