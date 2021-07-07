<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    hide-selected
    hide-no-data
    item-text="name"
    item-value="id"
    label="Tags"
    placeholder="Start typing to search tags"
    hint="Press CTRL+Enter to add a new tag"
    return-object
    multiple
    small-chips
    @change="onChange"
    @keydown="onKeyDown"
  />
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Project, Tag } from '~/types'

export default Vue.extend({
  props: {
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
    items: {
      type: Array,
      required: true,
    } as PropOptions<Tag>,
  },
  data() {
    return {
      isLoading: false,
      model: [],
      search: '',
    }
  },
  methods: {
    onChange() {
      this.search = ''
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'Enter') {
        this.$emit('new', this.search)
      }
    },
  },
})
</script>
