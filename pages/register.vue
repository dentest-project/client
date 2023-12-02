<template>
  <el-main>
    <h1>Register</h1>
    <RegisterForm @submit="onSubmit" />
    <div class="register-switch-to-login">
      <NuxtLink :to="$routes.login()">
        Already have an account? Log in instead ;)
      </NuxtLink>
    </div>
  </el-main>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { Register } from '~/types'

const { $api, $router } = useNuxtApp()
const { signIn } = useAuth()

useHead({
  title: 'Register | Dentest'
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const onSubmit = async (data: Register): Promise<void> => {
  try {
    await $api.register(data)
    await signIn( {
      username: data.username,
      password: data.password
    }, { callbackUrl: '/' })

    ElNotification({
      title: 'Hey!',
      message: 'Welcome on Dentest!',
      type: 'success',
    })

    setTimeout(() => { $router.push('/') }, 2000)
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'Already taken',
        message: 'This email or username is already existing. Try to login instead',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while attempting to register',
        type: 'error',
      })
    }
  }
}
</script>

<style scoped>
.register-switch-to-login {
  margin-top: 2rem;
}
</style>
