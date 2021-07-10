<template>
  <div class="tagsList">
    <tag-chip class="tagsList-tag" v-for="tag in tags" :key="tag.id" :tag="tag" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import TagChip from '~/components/chips/TagChip.vue';
import { Tag } from '~/types'

export default Vue.extend({
  components: { TagChip },
  props: {
    tags: {
      type: Array,
      required: true,
    } as PropOptions<Array<Tag>>
  }
})
</script>

<style scoped>
.tagsList-tag {
  margin: 1rem 0.5rem 1rem 0;
}
</style>
