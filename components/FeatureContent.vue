<template>
  <form>
    <div class="description" :style="`background-color: ${$colors.lightPrimary}`">
      <editable-textarea :value="feature.description" label="Feature description" @input="onDescriptionChanged" />
    </div>
    <scenario-list :scenarios="feature.scenarios" @input="onScenariosChanged" />
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import EditableTextarea from '~/components/EditableTextarea.vue';
import ScenarioList from '~/components/ScenarioList.vue';
import { Feature, Scenario } from '~/types';

export default Vue.extend({
  components: {
    EditableTextarea,
    ScenarioList
  },
  model: {
    prop: 'feature'
  },
  props: {
    feature: {
      type: Object,
      required: true
    } as PropOptions<Feature>
  },
  methods: {
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
.description {
  border: 1px dashed #aaaaaa;
}
</style>
