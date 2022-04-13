<template>
  <v-main>
    <breadcrumb :items="breadcrumbItems" />
    <editable-title
      v-if="canWrite"
      label="Feature title"
      v-model="feature.title"
      @input="onTitleChanged"
    />
    <h1 v-else>{{ feature.title }}</h1>
    <actions-bar>
      <feature-status-chip
        :feature="feature"
        :can-select="canWrite"
        @selected="onFeatureStatusSelected"
      />
      <save-button v-if="canWrite && isFeatureInDraftMode" :enabled="saveEnabled" @click="save" />
      <v-spacer />
      <delete-button v-if="canWrite" @click.stop="activateDeleteDialog" />
    </actions-bar>
    <feature-content
      :feature="feature"
      :can-write="canWrite && isFeatureInDraftMode"
      @input="onChanged"
    />
    <delete-feature-dialog
      v-model="deleteDialog"
      :feature="feature"
      @close="deactivateDeleteDialog"
      @deleted="onDeleted"
      @errored="onDeleteErrored"
    />
    <v-snackbar v-model="deletedSnackbarOpened" :color="$colors.success">Feature deleted</v-snackbar>
    <v-snackbar v-model="deleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the feature</v-snackbar>
    <v-snackbar v-model="savedSnackbarOpened" :color="$colors.success">Feature saved</v-snackbar>
    <v-snackbar v-model="saveErrorSnackbarOpened" :color="$colors.error">An error occurred while saving the feature</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ActionsBar from '~/components/ActionsBar.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import DeleteButton from '~/components/buttons/DeleteButton.vue'
import DeleteFeatureDialog from '~/components/dialogs/DeleteFeatureDialog.vue'
import EditableTitle from '~/components/EditableTitle.vue'
import FeatureContent from '~/components/FeatureContent.vue'
import FeatureStatusChip from '~/components/chips/FeatureStatusChip.vue'
import SaveButton from '~/components/buttons/SaveButton.vue'
import {
  Breadcrumb as BreadcrumbType,
  Feature,
  FeatureStatus,
  OrganizationPermission,
  ProjectPermission,
  UpdateFeature,
} from '~/types'

interface Data {
  deleteDialog: boolean
  deletedSnackbarOpened: boolean
  deleteErrorSnackbarOpened: boolean
  saveEnabled: boolean
  savedSnackbarOpened: boolean
  saveErrorSnackbarOpened: boolean
}

export default Vue.extend({
  components: {
    SaveButton,
    ActionsBar,
    Breadcrumb,
    DeleteButton,
    DeleteFeatureDialog,
    EditableTitle,
    FeatureContent,
    FeatureStatusChip,
  },
  props: {
    feature: {
      type: Object,
      required: true,
    } as PropOptions<Feature>,
  },
  data: function (): Data {
    return {
      deleteDialog: false,
      deletedSnackbarOpened: false,
      deleteErrorSnackbarOpened: false,
      saveEnabled: false,
      savedSnackbarOpened: false,
      saveErrorSnackbarOpened: false,
    }
  },
  methods: {
    activateDeleteDialog(): void {
      this.deleteDialog = true
    },
    deactivateDeleteDialog(): void {
      this.deleteDialog = false
    },
    formatFeatureForSave(): UpdateFeature {
      return {
        ...this.feature,
        path: {
          id: this.feature.path.id,
        },
      }
    },
    onChanged(feature: Feature): void {
      this.saveEnabled = true
      this.$emit('needUpdate', feature)
    },
    onDeleted(): void {
      this.deactivateDeleteDialog()
      this.deletedSnackbarOpened = true
      setTimeout(
        () => this.$router.push(this.$routes.path(this.feature.path)),
        2000
      )
    },
    onDeleteErrored(): void {
      this.deactivateDeleteDialog()
      this.deleteErrorSnackbarOpened = true
    },
    async onFeatureStatusSelected(status: FeatureStatus): Promise<void> {
      try {
        await this.$api.updateFeatureStatus(
          {
            id: this.feature.id,
            status,
          },
          this.$axios
        )
        this.feature.status = status
        this.savedSnackbarOpened = true
      } catch (error) {
        this.onSaveErrored()
      }
    },
    onSaved(): void {
      this.savedSnackbarOpened = true
      this.saveEnabled = false
    },
    onSaveErrored(): void {
      this.saveErrorSnackbarOpened = true
    },
    onTitleChanged(title: string): void {
      this.onChanged({ ...this.feature, title })
    },
    async save(): Promise<void> {
      try {
        const feature = await this.$api.saveFeature(
          this.formatFeatureForSave(),
          this.$axios
        )

        this.onSaved()
        this.$emit('saved', feature)

        if (feature.slug !== this.$route.params.feature_slug) {
          await this.$router.push(this.$routes.feature(feature.path, feature))
        }
      } catch (error) {
        this.onSaveErrored()
      }
    },
  },
  computed: {
    breadcrumbItems(): BreadcrumbType {
      const out = [
        {
          text: (this as any).feature.title,
          href: (this as any).id,
          disabled: true,
        },
      ] as BreadcrumbType
      let path = (this as any).feature.path

      while (path !== undefined) {
        out.push({
          text: path.project ? path.project.title : path.path,
          href: (this as any).$routes.path(path),
          disabled: false,
        })

        if (path.project && path.project.organization) {
          out.push({
            text: path.project.organization.name,
            href: (this as any).$routes.organization(
              path.project.organization.slug
            ),
            disabled: false,
          })
        }

        path = path.parent
      }

      return out.reverse()
    },
    isFeatureInDraftMode: function (): boolean {
      return (this as any).feature.status === FeatureStatus.Draft
    },
    canWrite: function (): boolean {
      const rootProject = ((this as any).feature as Feature).rootProject

      if (!(this as any).$auth.loggedIn) {
        return false
      }

      if (!rootProject) {
        return false
      }

      if (
        typeof rootProject.permissions.find(
          (p) => p === ProjectPermission.Admin || p === ProjectPermission.Write
        ) !== 'undefined'
      ) {
        return true
      }
      if (!rootProject.organization) {
        return false
      }

      return (
        typeof rootProject.organization.permissions.find(
          (p) =>
            p === OrganizationPermission.Admin ||
            p === OrganizationPermission.ProjectWrite
        ) !== 'undefined'
      )
    },
  },
})
</script>
