<template>
  <form @submit.prevent="onSubmit">
    <el-input
      v-model="username"
      maxlength="50"
      placeholder="Username"
      required
    />
    <el-input
      v-model="email"
      type="email"
      maxlength="255"
      placeholder="Email"
      required
    />
    <el-input
      v-model="password"
      type="password"
      placeholder="Password"
      minlength="8"
      maxlength="64"
      show-word-limit
      show-password
    />

    <el-row :gutter="20">
      <el-col :span="12">
        <el-input type="submit" value="Update profile" />
      </el-col>
      <el-col :span="12">
        <el-popconfirm
          title="Are you sure that you want to delete your account? All of your information will be deleted. Which means this action is irreversible"
          :icon="WarningFilled"
          icon-color="#f56c6c"
          :width="300"
          @confirm="onDeleteButtonClicked"
        >
          <template #reference>
            <el-button type="danger">Delete my account</el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
  </form>
</template>

<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue'
import type { UpdateMyPersonalInformationParams } from '~/api/ketal'
import { loggedInUser } from '~/helpers/auth'

const { data } = useAuth()

const username = ref(loggedInUser(data.value).username)
const email = ref(loggedInUser(data.value).email)
const password = ref('')

const emit = defineEmits<{
  (event: 'delete'): void
  (event: 'submit', value: UpdateMyPersonalInformationParams): void
}>()

const onDeleteButtonClicked = () => {
  emit('delete')
}

const onSubmit = () => {
  const value: UpdateMyPersonalInformationParams = {
    username: username.value,
    email: email.value,
    ...(password.value.length ? { password: password.value } : {}),
  }

  emit('submit', value)
}
</script>

<style scoped>
form .el-input,
form .el-button {
  margin: 0.5rem;
  width: 100%;
}

.el-popover.el-popper {
  word-break: normal;
}
</style>
