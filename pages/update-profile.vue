<template>
  <el-main>
    <h1>Update profile</h1>
    <UpdateMeForm @submit="onSubmit" @delete="onDelete" />
  </el-main>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { UpdateMe } from '~/types'

const { $api } = useNuxtApp()
const { signOut } = useAuth()

useHead({
  title: 'Update profile | Dentest'
})

const onDelete = async () => {
  try {
    await $api.deleteMe()

    ElNotification({
      title: 'Account deleted',
      message: 'Your account has been successfully deleted',
      type: 'success',
    })

    await signOut({ callbackUrl: '/' })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while deleting your account',
      type: 'error',
    })
  }
}

const onSubmit = async (data: UpdateMe) => {
  try {
    await $api.updateMe(data)

    ElNotification({
      title: 'Account updated',
      message: 'Your account has been successfully updated',
      type: 'success',
    })
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'Already taken',
        message: 'This email or username is already existing.',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while updating your profile.',
        type: 'error',
      })
    }
  }
}
</script>
