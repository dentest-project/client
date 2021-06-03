<template>
  <section class="home-timeline">
    <h2>How does it work?</h2>
    <div class="home-timeline-wrapper">
      <v-timeline
        class="home-timeline-timeline"
        align-top
        :dense="$vuetify.breakpoint.smAndDown"
      >
        <v-timeline-item
          v-for="(item, i) in items"
          :key="i"
          :color="item.color"
          :icon="item.icon"
          fill-dot
        >
          <v-card :color="item.color" dark>
            <v-card-title class="home-timeline-card-title">
              {{ item.title }}
            </v-card-title>
            <v-card-text class="white text--primary">
              <p>{{ item.content }}</p>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  data: () => ({
    items: [
      {
        color: 'red lighten-2',
        icon: 'mdi-lead-pencil',
        title: 'Product owners write the specs',
        content:
          'By using a handy interface, you can specify all your features and respect the Gherkin syntax. With a bank of reusable steps and a clear presentation, you will avoid encountering the main Gherkin pain points',
      },
      {
        color: 'purple darken-1',
        icon: 'mdi-download',
        title: 'Developers pull the features',
        content:
          'By using Dentest CLI, developers will be able to retrieve the features, formatted as Gherkin files.',
      },
      {
        color: 'green lighten-1',
        icon: 'mdi-share-variant',
        title: 'Everyone reads the documentation',
        content:
          'By writing your features as clearly as possible, they will act as a perfect documentation that you will share with everybody',
      },
      {
        color: 'orange darken-1',
        icon: 'mdi-checkbox-marked-outline',
        title: 'CI or quality engineers run the tests',
        content:
          'As Gherkin features behave as tests, they can be incorporated in your CI. But you can also run the tests straight from this interface (to come)',
      },
    ],
  }),
}
</script>

<style scoped>
.home-timeline {
  background-color: #aaaaaa;
}

.home-timeline h2 {
  text-align: center;
}

.home-timeline-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-timeline-wrapper .home-timeline-timeline {
  width: 640px;
  max-width: 75%;
}

.home-timeline-card-title {
  word-break: keep-all;
}
</style>
