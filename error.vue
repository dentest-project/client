<template>
  <NuxtLayout name="default">
    <el-main>
      <h1>{{ error.statusCode }} {{ errorTitle }}</h1>
      <p>{{ errorDescription }}</p>
    </el-main>
  </NuxtLayout>
</template>

<script setup>
const error = useError();

const errorTitleMap = {
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  500: 'Server error'
}

const errorDescriptionMap = {
  401: 'You must be authenticated to be here',
  403: 'You do not have the permission to be here',
  404: 'What you are requesting could not be found',
  409: 'What you are trying to create already exists here',
  500: 'Something wrong happened.'
}

const errorTitle = computed(() => errorTitleMap[error.value.statusCode] ?? '')
const errorDescription = computed(() => errorDescriptionMap[error.value.statusCode] ?? '')

useHead({
  title: `${error.value.statusCode} ${errorTitle.value} | Dentest`
})
</script>
