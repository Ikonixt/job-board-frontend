<template>
  <!-- Main application, used for routing -->
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: "Jobbr",
    };
  },
  watch: {
    // For changing the website title
    // Referenced from Stackoverflow https://stackoverflow.com/questions/36612847/how-can-i-bind-the-html-title-content-in-vuejs
    // Since I'm not sure how to change routed website title
    title: {
      immediate: true,
      handler() {
        document.title = this.title;
      },
    },
  },
};
</script>

<style scoped>
div {
  border-radius: 5px;
  background-color: #f5f5f5;
  border-radius: 10px;
}

#app {
  margin-top: 0px;
  padding: 0px;
}
</style>
