<template>
  <main class="home-hero">
    <h1>Dentest</h1>
    <h2>A Behavior Driven Development platform</h2>
    <h4>Specify, validate and document at the same place</h4>
  </main>
</template>

<script>
import Logo from '~/components/logos/Logo';

export default {
  components: { Logo }
}
</script>

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

.home-hero h2 {
  text-align: center;
}
</style>
