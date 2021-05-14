<template>
  <v-treeview :items="tree" activatable hoverable open-all selection-type="independent" :active.sync="active" @update:active="onChange">
    <template v-slot:prepend="{ open }">
      <v-icon>{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
    </template>
  </v-treeview>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Path } from '~/types';
import { TreeElement } from '~/types/component-types';

export default Vue.extend({
  props: {
    tree: {
      type: Array,
      required: true
    } as PropOptions<Array<TreeElement>>,
    default: {
      type: Object,
      required: true
    } as PropOptions<Path>
  },
  data() {
    return {
      active: [] as Array<string>
    }
  },
  mounted() {
    this.active = [this.default.id]
  },
  methods: {
    onChange(e: Array<string>) {
      if (e.length === 0) {
        return;
      }

      this.$emit('input', e[0]);
    }
  }
});
</script>
