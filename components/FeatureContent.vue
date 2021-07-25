<template>
  <form>
    <steps-button
      v-if="canWrite"
      class="feature-content-step-button"
      @click.prevent="activateDrawer"
    />
    <tags-selector
      v-if="canWrite"
      :project="feature.rootProject"
      :value="feature.tags"
      @input="onTagsChanged"
    />
    <tags-list v-else :tags="feature.tags" />
    <v-sheet
      class="description"
      :style="`background-color: ${$colors.lightPrimary}`"
    >
      <editable-textarea
        v-if="canWrite"
        :value="feature.description"
        label="Feature description"
        @input="onDescriptionChanged"
      />
      <paragraph v-else class="feature-content-description" :str="feature.description" />
    </v-sheet>
    <scenario-list
      :scenarios="feature.scenarios"
      :can-write="canWrite"
      :project="feature.rootProject"
      @input="onScenariosChanged"
    />
    <steps-drawer
      v-if="canWrite"
      v-model="stepsDrawer"
      :project="feature.rootProject"
    />
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import EditableTextarea from '~/components/EditableTextarea.vue'
import Paragraph from '~/components/Paragraph.vue';
import ScenarioList from '~/components/ScenarioList.vue'
import StepsButton from '~/components/buttons/StepsButton.vue'
import StepsDrawer from '~/components/StepsDrawer.vue'
import TagsList from '~/components/TagsList.vue'
import TagsSelector from '~/components/TagsSelector.vue'
import { Feature, Scenario, Tag } from '~/types'

export default Vue.extend({
  components: {
    Paragraph,
    TagsList,
    TagsSelector,
    EditableTextarea,
    ScenarioList,
    StepsButton,
    StepsDrawer,
  },
  props: {
    canWrite: {
      type: Boolean,
      required: true,
    },
    feature: {
      type: Object,
      required: true,
    } as PropOptions<Feature>,
  },
  data() {
    return {
      stepsDrawer: false,
    }
  },
  methods: {
    activateDrawer(): void {
      this.stepsDrawer = true
    },
    onDescriptionChanged(description: string): void {
      this.$emit('input', {
        ...this.feature,
        description,
      })
    },
    onScenariosChanged(scenarios: Array<Scenario>): void {
      this.$emit('input', {
        ...this.feature,
        scenarios,
      })
    },
    onTagsChanged(tags: Array<Tag>): void {
      this.$emit('input', {
        ...this.feature,
        tags,
      })
    },
  },
})
</script>

<style scoped>
.feature-content-description {
  padding: 1rem;
}

.feature-content-step-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
