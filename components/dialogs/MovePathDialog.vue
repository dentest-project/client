<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">Move folder</v-card-title>
      <v-card-text>
        <paths-tree v-if="tree.length > 0" :default="parent" :tree="tree" @input="onNewParentChanged" />
      </v-card-text>
      <v-card-actions v-if="tree.length > 0">
        <v-divider />
        <v-btn @click.prevent="onSubmit">Confirm move</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import PathsTree from '~/components/PathsTree.vue';
import { Path } from '~/types';

interface Element {
  id: string,
  name: string,
  disabled: boolean,
  children: Array<Element>
}

export default Vue.extend({
  components: {
    PathsTree
  },
  model: {
    prop: 'value'
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    path: {
      type: Object,
      required: true
    } as PropOptions<Path>,
    parent: {
      type: Object,
      required: true
    } as PropOptions<Path>
  },
  data() {
    return {
      rootPath: null as null|Path,
      newParent: null as string|null
    }
  },
  methods: {
    buildTree(path: Path, disabled: boolean): Element {
      return {
        id: path.id,
        name: path.path,
        children: path.children.map(child => this.buildTree(child, disabled || path.id === this.path.id)),
        disabled: disabled || path.id === this.path.id
      };
    },
    async onDialogStatusChanged(e) {
      this.$emit('input', e);
    },
    onNewParentChanged(newParent: string) {
      this.newParent = newParent;
    },
    onSubmit() {
      this.$emit('submit', { id: this.path.id, newParentId: this.newParent });
    }
  },
  computed: {
    tree() {
      if (!(this as any).rootPath) {
        return [];
      }

      let root = (this as any).buildTree((this as any).rootPath, false);

      return [root];
    }
  },
  watch: {
    async value(v) {
      if (v && !this.rootPath) {
        this.rootPath = await (this as any).$api.getPathRoot((this as any).path.id, (this as any).$axios);
      }
    }
  }
});
</script>
