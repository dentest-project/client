<template>
  <section class="home-hero">
    <h2>A Behavior Driven Development platform</h2>

    <div class="home-hero-badges">
      <home-badge
        title="Specify"
        description="Write your specifications online"
      />
      <home-badge
        title="Code"
        description="Pull them as Gherkin features and start coding"
      />
      <home-badge
        title="Validate"
        description="They are now acting as automated tests"
      />
      <home-badge
        title="Document"
        description="Then, after release, as online documentation"
      />
    </div>

    <div class="home-hero-hints">
      <home-hint
        image="/cucumber-logo.png"
        alt="Gherkin"
        content="Uses Gherkin to adapt to any project"
      />
      <home-hint
        image="/jetbrains-logo.png"
        alt="Jetbrains"
        content="JetBrains IDEs integration"
      />
    </div>
  </section>
</template>

<script>
import CucumberLogo from '~/components/logos/CucumberLogo.vue'
import HomeBadge from '~/components/HomeBadge.vue';
import Logo from '~/components/logos/Logo'
import HomeHint from '~/components/HomeHint.vue';

export default {
  components: {HomeHint, CucumberLogo, HomeBadge, Logo },
}
</script>

<style scoped>
.home-hero {
  color: #000000;
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
  font-size: 2.5rem;
}

.home-hero h4 {
  text-align: center;
}

.home-hero .home-hero-badges {
  display: flex;
  margin-top: 2rem;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.home-hero .home-hero-badges .home-badge {
  flex: 1;
}

.home-badge + .home-badge {
  border-left: 1px #4834d4 solid;
}

.home-hero .home-hero-hints {
  display: flex;
  width: 100%;
  margin-top: 4rem;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
}

.home-hero .home-hero-hints .home-hint {
  flex: 1;
}

@media screen and (max-width: 640px) {
  .home-hero .home-hero-badges, .home-hero .home-hero-hints {
    display: none;
  }
}
</style>
