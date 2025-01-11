<template>
  <img alt="Vue logo" src="./assets/logo.jpeg" />
  <h1></h1>
  <router-view></router-view>
</template>

<script>
import HomePage from "./screens/homePage.vue";

export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
