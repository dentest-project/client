<template>
  <main>
    <el-main>
      <h1>Log in</h1>
      <LoginForm @submit="onSubmit" />
      <div class="login-switch-to-register">
        <NuxtLink :to="$routes.register()">Don't have an account yet? Register instead ;)</NuxtLink>
      </div>
      <div class="login-switch-to-reset-password">
        <NuxtLink :to="$routes.resetPassword()">Forgot your password?</NuxtLink>
      </div>
    </el-main>
  </main>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { Login } from '~/types'

const { signIn } = useAuth()

definePageMeta({
  title: 'Login | Dentest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const onSubmit = async (data: Login) => {
  try {
    await signIn(data, { callbackUrl: '/' })
    ElNotification({
      title: 'Hey!',
      message: 'Welcome back!',
      type: 'success',
    })
  } catch (error) {
    console.log({error})
    if (error.statusCode === 401) {
      ElNotification({
        title: 'Invalid credentials',
        message: 'This combination username/password does not exist',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while attempting to log in',
        type: 'error',
      })
    }
  }
}
</script>

<style scoped>
.login-switch-to-register {
  margin-top: 2rem;
}
</style>
