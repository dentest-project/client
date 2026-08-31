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
import {
  RequestPasswordResetErrorCode,
  ResetPasswordErrorCode,
  isRequestPasswordResetTooEarlyError,
  isKetalJsonRpcError,
} from '~/api/ketal'
import type {
  RequestPasswordResetParams,
  ResetPasswordParams,
} from '~/api/ketal'

type ResetPasswordFormOutput = Pick<ResetPasswordParams, 'password'>

const { query } = useRoute()
const { $ketal, $router } = useNuxtApp()

useHead({
  title: 'Password forgotten | Dentest',
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const code = typeof query.code === 'string' ? query.code : ''
const isRequest: boolean = !code

const formatMinutes = (minutes: number): string =>
  `${minutes} minute${minutes > 1 ? 's' : ''}`

const onRequestSubmit = async (
  data: RequestPasswordResetParams,
): Promise<void> => {
  try {
    await $ketal.requestPasswordReset(data)
    ElNotification({
      title: 'Request sent',
      message: 'We sent you a link to reset your password. Check your emails.',
      type: 'success',
    })
  } catch (error) {
    if (
      isKetalJsonRpcError(error) &&
      error.code === RequestPasswordResetErrorCode.UserNotFound
    ) {
      ElNotification({
        title: 'Unknown account',
        message: 'No account matches this username or email',
        type: 'error',
      })
    } else if (isRequestPasswordResetTooEarlyError(error)) {
      ElNotification({
        title: 'Request already sent',
        message: `Please wait ${formatMinutes(error.data.remainingMinutes)} before requesting another reset link`,
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message:
          'An error occurred while attempting to request a password reset',
        type: 'error',
      })
    }
  }
}

const onSubmit = async (data: ResetPasswordFormOutput): Promise<void> => {
  try {
    await $ketal.resetPassword({
      code,
      password: data.password,
    })
    ElNotification({
      title: 'Password reset!',
      message: 'Your password was successfully reset',
      type: 'success',
    })
    setTimeout(() => {
      $router.push('/login')
    }, 2000)
  } catch (error) {
    if (
      isKetalJsonRpcError(error) &&
      error.code === ResetPasswordErrorCode.UserNotFound
    ) {
      ElNotification({
        title: "We couldn't reset your password",
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
