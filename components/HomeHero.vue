<template>
  <section class="home-hero">
    <h2>A Behavior Driven Development solution</h2>

    <div class="home-hero-badges">
      <HomeBadge
        title="Specify"
        description="Write your specifications online"
      />
      <HomeBadge
        title="Code"
        description="Pull them as Gherkin features and start coding"
      />
      <HomeBadge
        title="Validate"
        description="They are now acting as automated tests"
      />
      <HomeBadge
        title="Document"
        description="Then, after release, as online documentation"
      />
    </div>

    <div class="home-hero-hints">
      <HomeHint
        image="/cucumber-logo.png"
        alt="Gherkin"
        content="Uses Gherkin to adapt to any project"
      />
      <HomeHint
        image="/jetbrains-logo.png"
        alt="Jetbrains"
        content="JetBrains IDEs integration"
      />
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  width: 100%;
  height: 80vh;
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
