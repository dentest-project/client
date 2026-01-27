<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <BarLogo />
    <el-menu-item index="0" class="title">
      <NuxtLink v-if="$route.path !== '/'" :to="$routes.home()">Dentest</NuxtLink>
      <h1 v-else>Dentest</h1>
    </el-menu-item>
    <div class="spacer" />
    <el-menu-item class="switch">
      <DarkModeSwitch :model-value="lightMode" @update:model-value="v => $emit('update:lightModeValue', v)" />
    </el-menu-item>
    <el-menu-item index="2">
      <a href="https://docs.dentest.tech" target="_blank">Docs</a>
    </el-menu-item>
    <el-menu-item v-if="loggedIn" index="3">
      <NuxtLink :to="toUpdateProfile">{{ username }}</NuxtLink>
    </el-menu-item>
    <el-menu-item v-if="loggedIn" index="4">
      <a class="menu-logout" href="#" @click.prevent="() => signOut({ callbackUrl: '/' })">Log out</a>
    </el-menu-item>
    <el-menu-item v-else index="3">
      <NuxtLink :to="$routes.login()">Log in</NuxtLink>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { isAuthenticated, loggedInUser } from '~/helpers/auth'

const { signOut, data, status } = useAuth()
const { $routes } = useNuxtApp()

const props = defineProps<{
  lightMode: 'light' | 'dark'
}>()

const username = computed(() => isAuthenticated(status.value, data.value) ? loggedInUser(data.value).username : '')

const loggedIn = computed(() => isAuthenticated(status.value, data.value))

const toUpdateProfile = computed(() => $routes.updateProfile())
</script>

<style scoped>
.spacer {
  flex-grow: 1;
}

a {
  text-decoration: none;
}

.title a {
  font-weight: bold;
}

.title h1 {
  font-size: var(--el-menu-item-font-size);
  padding: 0;
}

.switch {
  height: var(--el-menu-item-height);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
