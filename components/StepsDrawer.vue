<template>
  <v-navigation-drawer hide-overlay absolute temporary right v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Steps</v-list-item-title>
        <v-list-item-subtitle>
          Drag'n'drop your steps
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list
      dense
      nav
    >
      <v-list-item v-for="step in steps" :key="step.id" link>
        <v-list-item-content>
          <v-list-item-title>{{ translateStepType(step.type) }}</v-list-item-title>
          <span v-for="part in step.parts" :key="part.id" :class="`step-drawer-step-type--${part.type}`">{{ part.content }}</span>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import translateStepType from '~/helpers/translateType';
import { Project, Step, StepType } from '~/types';

export default Vue.extend({
  model: {
    prop: 'value'
  },
  props: {
    project: {
      type: Object,
      required: true
    } as PropOptions<Project>,
    value: {
      type: Boolean,
      required: true
    }
  },
  async beforeMount() {
    this.steps = await this.$api.getProjectSteps(this.project.id, this.$axios);
  },
  data() {
    return {
      steps: [] as Step[]
    };
  },
  methods: {
    translateStepType(type: StepType): string {
      return translateStepType(type);
    }
  },
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('input', value);
      }
    }
  }
});
</script>

<style scoped>
.step-drawer-step-type--param:before {
  content: ":";
}

.step-drawer-step-type--param {
  color: #eb4d4b;
  font-weight: bold;
}
</style>
