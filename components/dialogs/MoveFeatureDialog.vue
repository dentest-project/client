<template>
  <v-dialog width="480" :value="value" @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">Move feature</v-card-title>
      <v-card-text>
        <paths-tree
          v-if="tree.length > 0"
          :default="path"
          :tree="tree"
          @input="onNewParentChanged"
        />
      </v-card-text>
      <v-card-actions v-if="tree.length > 0">
        <v-divider />
        <v-btn @click.prevent="onSubmit">Confirm move</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import PathsTree from '~/components/PathsTree.vue'
import buildTree from '~/helpers/buildTree'
import { Feature, Path } from '~/types'

export default Vue.extend({
  components: {
    PathsTree,
  },
  model: {
    prop: 'value',
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    feature: {
      type: Object,
      required: true,
    } as PropOptions<Feature>,
    path: {
      type: Object,
      required: true,
    } as PropOptions<Path>,
  },
  data() {
    return {
      rootPath: null as null | Path,
      newParent: null as null | string,
    }
  },
  methods: {
    async onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
    onNewParentChanged(newParent: string) {
      this.newParent = newParent
    },
    onSubmit() {
      this.$emit('submit', { id: this.feature.id, newParentId: this.newParent })
    },
  },
  computed: {
    tree() {
      if (!(this as any).rootPath) {
        return []
      }

      let root = buildTree((this as any).rootPath, false)

      return [root]
    },
  },
  watch: {
    async value(v) {
      if (v && !this.rootPath) {
        this.rootPath = await (this as any).$api.getPathRoot(
          (this as any).path.id,
          (this as any).$axios
        )
      }
    },
  },
})
</script>
