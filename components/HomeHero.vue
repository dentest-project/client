<template>
  <section class="home-hero">
    <h2>A Behavior Driven Development platform</h2>
    <h4>Specify, validate and document at the same place</h4>
    <div class="home-hero-extra">
      <cucumber-logo />
      <span>Uses Gherkin to adapt to any project</span>
    </div>
  </section>
</template>

<script>
import CucumberLogo from '~/components/logos/CucumberLogo.vue'
import Logo from '~/components/logos/Logo'

export default {
  components: { CucumberLogo, Logo },
}
</script>

<style scoped>
.home-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('/home_bg.jpg') #333333 center center;
  background-size: cover;
  color: #ffffff;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.home-hero h2 {
  text-align: center;
}

.home-hero h4 {
  text-align: center;
}

.home-hero .home-hero-extra {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
