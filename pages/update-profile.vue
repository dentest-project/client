<template>
  <v-main>
    <h1>Update profile</h1>
    <update-me-form @submit="onSubmit" @delete="onDeleteRequest" />
    <delete-me-dialog
      v-model="deleteDialogOpened"
      @close="deleteDialogOpened = false"
      @deleted="onDeleted"
      @errored="onDeleteError"
    />
    <v-snackbar
      v-model="updatedSnackbarOpened"
      :color="$colors.success"
    >
      Profile updated
    </v-snackbar>
    <v-snackbar
      v-model="deletedSnackbarOpened"
      :color="$colors.success"
    >
      Your account has been deleted
    </v-snackbar>
    <v-snackbar
      v-model="updateConflictErrorSnackbarOpened"
      :color="$colors.error"
    >
      This email or username is already existing.
    </v-snackbar>
    <v-snackbar
      v-model="updateErrorSnackbarOpened"
      :color="$colors.error"
    >
      An error occurred while updating your profile
    </v-snackbar>
    <v-snackbar
      v-model="deleteErrorSnackbarOpened"
      :color="$colors.error"
    >
      An error occurred while deleting your account
    </v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import DeleteMeDialog from '~/components/dialogs/DeleteMeDialog.vue';
import UpdateMeForm from '~/components/UpdateMeForm.vue';
import { UpdateMe } from '~/types'

export default Vue.extend({
  components: { DeleteMeDialog, UpdateMeForm },
  data: function () {
    return {
      deleteDialogOpened: false,
      deletedSnackbarOpened: false,
      deleteErrorSnackbarOpened: false,
      updatedSnackbarOpened: false,
      updateErrorSnackbarOpened: false,
      updateConflictErrorSnackbarOpened: false,
    }
  },
  methods: {
    onDeleted(): void {
      this.deleteDialogOpened = false;
      this.deletedSnackbarOpened = true;
      this.$auth.logout()
      window.setTimeout(() => {
        this.$router.push(this.$routes.home())
      }, 2000)
    },
    onDeleteError(): void {
      this.deleteDialogOpened = false;
      this.deleteErrorSnackbarOpened = true;
    },
    onDeleteRequest(): void {
      this.deleteDialogOpened = true;
    },
    async onSubmit(data: UpdateMe): Promise<void> {
      try {
        await this.$api.updateMe(data, this.$axios)
        this.updatedSnackbarOpened = true
      } catch (error) {
        if (error.response.status === 409) {
          this.updateConflictErrorSnackbarOpened = true
        } else {
          this.updateErrorSnackbarOpened = true
        }
      }
    },
  },
})
</script>
