<template>
  <v-autocomplete
    :value="value"
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
    @input="onInput"
    @keydown="onKeyDown"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        :color="data.item.color"
        :text-color="oppositeColor(data.item.color)"
      >
        {{ data.item.name }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import blackOrWhite from '~/helpers/blackOrWhite'
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
    } as PropOptions<Array<Tag>>,
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      model: [],
      search: '',
    }
  },
  methods: {
    oppositeColor(color: string): string {
      return blackOrWhite(color)
    },
    onChange() {
      this.search = ''
    },
    onInput(v: Array<Tag>) {
      this.$emit('input', v)
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'Enter') {
        this.$emit('new', this.search)
      }
    },
  },
})
</script>
