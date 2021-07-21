<template>
  <v-list-item>
    <tag-chip
      v-for="tag in tags"
      :key="tag.id"
      :tag="tag"
      :outlined="!isTagSelected(tag)"
      @click="onTagClicked"
    />
    <v-list-item-content v-if="tags.length === 0" class="no-tags">
      Add tags to your steps to filter them
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import TagChip from '~/components/chips/TagChip.vue'
import { Project, Tag } from '~/types'

export default Vue.extend({
  model: {
    prop: 'value',
  },
  components: {
    TagChip,
  },
  props: {
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
    value: {
      type: Array,
      required: true,
    } as PropOptions<Array<Tag>>,
  },
  async beforeMount() {
    await this.loadTags()
  },
  data() {
    return {
      tags: [] as Array<Tag>,
    }
  },
  methods: {
    isTagSelected(tag: Tag): boolean {
      return (
        this.selected.length === 0 ||
        !!this.selected.find((t: Tag) => t.id === tag.id)
      )
    },
    async loadTags(): Promise<void> {
      this.tags = await this.$api.getTags(this.project.id, this.$axios)
    },
    onTagClicked(tag: Tag): void {
      const existing = this.selected.findIndex((t: Tag) => t.id === tag.id)

      if (existing !== -1) {
        this.selected.splice(existing, 1)
      } else {
        this.selected.push(tag)
      }
    },
  },
  computed: {
    selected: {
      get(): Array<Tag> {
        return this.value
      },
      set(value: Array<Tag>) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style scoped>
.no-tags {
  font-size: 0.8rem;
  font-style: italic;
  color: #777777;
}
</style>
