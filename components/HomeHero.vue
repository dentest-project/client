<template>
  <main class="home-hero">
    <h1>Entest</h1>
    <h2>Automated testing for humans.</h2>
  </main>
</template>

<style scoped>
.home-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/home_bg.jpg') #333333 center center;
  background-size: cover;
  color: #ffffff;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
<script>
import Logo from '~/components/Logo';

export default {
  components: { Logo }
}
</script>
