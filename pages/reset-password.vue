<template>
  <el-main>
    <h1 v-if="isRequest">Password forgotten</h1>
    <h1 v-else>Reset password</h1>

    <ResetPasswordRequestForm v-if="isRequest" @submit="onRequestSubmit" />
    <ResetPasswordForm v-else @submit="onSubmit" />
  </el-main>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { ResetPasswordRequest } from '~/types'

interface ResetPasswordFormOutput {
  password: string
}

const { query } = useRoute()
const { $api, $router } = useNuxtApp()

useHead({
  title: 'Password forgotten | Dentest',
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const code = typeof query.code === 'string' ? query.code : ''
const isRequest: boolean = !code

const onRequestSubmit = async (data: ResetPasswordRequest): Promise<void> => {
  try {
    await $api.resetPasswordRequest(data)
    ElNotification({
      title: 'Request sent',
      message: 'We sent you a link to reset your password. Check your emails.',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while attempting to request a password reset',
      type: 'error',
    })
  }
}

const onSubmit = async (data: ResetPasswordFormOutput): Promise<void> => {
  try {
    await $api.resetPassword({
      code,
      newPassword: data.password,
    })
    ElNotification({
      title: 'Password reset!',
      message: 'Your password was successfully reset',
      type: 'success',
    })
    setTimeout(() => { $router.push('/login') }, 2000)
  } catch (error) {
    if (error.statusCode === 404) {
      ElNotification({
        title: 'We couldn\'t reset your password',
        message: 'It seems the link you used was not valid',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while attempting to reset your password',
        type: 'error',
      })
    }
  }
}
</script>
