<template>
  <form>
    <v-sheet elevation="2" class="description" :style="`background-color: ${$colors.lightPrimary}`">
      <editable-textarea v-if="canWrite" :value="feature.description" label="Feature description" @input="onDescriptionChanged" />
      <p v-else class="feature-content-description">{{ feature.description }}</p>
    </v-sheet>
    <v-row v-if="canWrite" class="feature-content-drawer-row">
      <v-spacer />
      <steps-button @click.prevent="activateDrawer" />
    </v-row>
    <scenario-list :scenarios="feature.scenarios" :feature-root-project="feature.rootProject" :can-write="canWrite" @input="onScenariosChanged" />
    <steps-drawer v-if="canWrite" v-model="stepsDrawer" :project="feature.rootProject" />
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import EditableTextarea from '~/components/EditableTextarea.vue';
import ScenarioList from '~/components/ScenarioList.vue';
import StepsButton from '~/components/buttons/StepsButton.vue';
import StepsDrawer from '~/components/StepsDrawer.vue';
import { Feature, Scenario } from '~/types';

export default Vue.extend({
  components: {
    EditableTextarea,
    ScenarioList,
    StepsButton,
    StepsDrawer
  },
  props: {
    canWrite: {
      type: Boolean,
      required: true
    },
    feature: {
      type: Object,
      required: true
    } as PropOptions<Feature>
  },
  data() {
    return {
      stepsDrawer: false
    }
  },
  methods: {
    activateDrawer(): void {
      this.stepsDrawer = true;
    },
    onDescriptionChanged(description: string): void {
      this.$emit('input', {
        ...this.feature,
        description
      });
    },
    onScenariosChanged(scenarios: Array<Scenario>): void {
      this.$emit('input', {
        ...this.feature,
        scenarios
      })
    }
  }
});
</script>

<style scoped>
.feature-content-description {
  padding: 1rem;
  white-space: pre;
}

.feature-content-drawer-row {
  margin-right: 0;
  margin-left: 0;
}
</style>
