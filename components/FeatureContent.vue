<template>
  <form>
    <div class="description" :style="`background-color: ${$colors.lightPrimary}`">
      <editable-textarea :value="feature.description" label="Feature description" @input="onDescriptionChanged" />
    </div>
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import EditableTextarea from '~/components/EditableTextarea.vue';
import { Feature } from '~/types';

export default Vue.extend({
  components: {
    EditableTextarea
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
    }
  }
});
</script>

<style scoped>
.description {
  border: 1px dashed #aaaaaa;
}
</style>
