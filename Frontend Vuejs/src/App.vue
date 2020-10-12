<template>
  <div id="app">
    <game />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    Game: () => import('./components/Game')
  }
}
</script>

<style>
:root {
  --theme-color: 33, 224, 138;
  --gradient-color-base: 96, 139, 125;
  --gradient-color-1: 10, 36, 45;
  --gradient-color-2: 50, 80, 110;
  --gradient-color-3: 150, 250, 195;
}

html, body {
  height: 100vh;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
