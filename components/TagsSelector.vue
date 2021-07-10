<template>
  <div>
    <tags-autocomplete
      :project="project"
      :items="items"
      :value="value"
      @new="onNewTagRequested"
      @input="onInput"
    />
    <create-tag-dialog
      :project="project"
      :initial-name="initialTagName"
      :value="createTagDialogOpened"
      @created="onTagCreated"
      @errored="onTagCreationErrored"
    />
    <v-snackbar v-model="createdTagSnackbarOpened" :color="$colors.success">
      Tag created
    </v-snackbar>
    <v-snackbar v-model="creationTagErrorSnackbarOpened" :color="$colors.error">
      An error occurred while creating the tag
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import CreateTagDialog from '~/components/dialogs/CreateTagDialog.vue'
import TagsAutocomplete from '~/components/TagsAutocomplete.vue'
import { Project, Tag } from '~/types'

interface Data {
  createTagDialogOpened: boolean
  createdTagSnackbarOpened: boolean
  creationTagErrorSnackbarOpened: boolean
  initialTagName: string
  items: Array<Tag>
}

export default Vue.extend({
  components: {
    CreateTagDialog,
    TagsAutocomplete,
  },
  props: {
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
    value: {
      type: Array,
      required: true
    } as PropOptions<Array<Tag>>
  },
  data: function (): Data {
    return {
      createTagDialogOpened: false,
      createdTagSnackbarOpened: false,
      creationTagErrorSnackbarOpened: false,
      initialTagName: '',
      items: [],
    }
  },
  async created() {
    await this.loadItems()
  },
  methods: {
    activateCreateTagDialog(): void {
      this.createTagDialogOpened = true
    },
    deactivateCreateTagDialog(): void {
      this.createTagDialogOpened = false
    },
    async loadItems(): Promise<void> {
      this.items = await this.$api.getTags(this.project.id, this.$axios)
    },
    onNewTagRequested(name: string): void {
      this.initialTagName = name
      this.activateCreateTagDialog()
    },
    onTagCreated(): void {
      this.deactivateCreateTagDialog()
      this.createdTagSnackbarOpened = true
      this.loadItems()
    },
    onTagCreationErrored(): void {
      this.deactivateCreateTagDialog()
      this.creationTagErrorSnackbarOpened = true
    },
    onInput(v: Array<Tag>): void {
      this.$emit('input', v)
    }
  },
})
</script>
