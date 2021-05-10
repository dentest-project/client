<template>
  <v-navigation-drawer hide-overlay fixed floating temporary right v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Steps</v-list-item-title>
        <v-list-item-subtitle>
          Drag'n'drop your steps
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list>
      <v-list-group v-for="group in steps" v-model="group.active" :key="group.title" :prepend-icon="group.icon">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="group.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item v-for="step in group.steps" :key="step.id" link draggable="true" @dragstart="addToStore(step)" @dragend="removeFromStore" dense>
          <v-list-item-icon>
            <v-icon color="#CCCCCC">{{ group.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="step-drawer-step">
              <span v-for="part in step.parts" :key="part.id" :class="`step-drawer-step-type--${part.type}`">{{ part.content }}</span>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { mapMutations } from 'vuex';
import translateStepType from '~/helpers/translateType';
import { Project, Step, StepType } from '~/types';

interface DisplayableStepsGroup {
  title: string,
  icon: string,
  active: boolean,
  steps: Array<Step>
}

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
    const steps = await this.$api.getProjectSteps(this.project.id, this.$axios);

    this.steps = [
      ['Givens', 'mdi-ray-start', StepType.Given],
      ['Whens', 'mdi-ray-vertex', StepType.When],
      ['Thens', 'mdi-ray-end', StepType.Then]
    ].map(([title, icon, type]) => ({
      title,
      icon,
      steps: steps.filter((step: Step) => step.type === type),
      active: false
    }));
  },
  data() {
    return {
      steps: [] as Array<DisplayableStepsGroup>
    };
  },
  methods: {
    translateStepType(type: StepType): string {
      return translateStepType(type);
    },
    ...mapMutations({
      addToStore: 'stepsDrawer/dragStep',
      removeFromStore: 'stepsDrawer/clearDraggedStep'
    })
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
.step-drawer-step {
  font-style: italic;
  font-size: 0.9rem;
}

.step-drawer-step-type--param:before {
  content: " :";
}

.step-drawer-step-type--param:after {
  content: " ";
}

.step-drawer-step-type--param {
  color: #2814B4;
  font-weight: bold;
}
</style>
