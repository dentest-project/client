<template>
  <el-main>
    <h1>Update profile</h1>
    <UpdateMeForm @submit="onSubmit" @delete="onDelete" />
  </el-main>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import {
  UpdateMyPersonalInformationErrorCode,
  isKetalJsonRpcError,
} from '~/api/ketal'
import type { UpdateMyPersonalInformationParams } from '~/api/ketal'

const { $api, $ketal } = useNuxtApp()
const { getSession, signOut, token } = useAuth()

useHead({
  title: 'Update profile | Dentest',
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

const onSubmit = async (
  data: UpdateMyPersonalInformationParams,
): Promise<void> => {
  try {
    if (!token.value) {
      throw new Error('Authentication token is missing')
    }

    await $ketal.updateMyPersonalInformation(data, {
      authorization: token.value,
    })
    await getSession()

    ElNotification({
      title: 'Account updated',
      message: 'Your account has been successfully updated',
      type: 'success',
    })
  } catch (error) {
    if (
      isKetalJsonRpcError(error) &&
      error.code === UpdateMyPersonalInformationErrorCode.UserAlreadyExists
    ) {
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
