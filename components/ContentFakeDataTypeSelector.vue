<template>
  <client-only>
    <el-select
      :model-value="modelValue"
      size="small"
      placeholder="Data type"
      style="width: 100%"
      filterable
      @update:model-value="onUpdate"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </client-only>
</template>

<script setup lang="ts">
import { FakeDataType } from '~/types'

export interface Props {
  modelValue?: FakeDataType | null
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const options = computed(() => Object.entries({
  [FakeDataType.FirstName]: 'First name',
  [FakeDataType.LastName]: 'Last name',
  [FakeDataType.FullName]: 'Full name',
  [FakeDataType.JobTitle]: 'Job title',
  [FakeDataType.Email]: 'Email',
  [FakeDataType.Phone]: 'Phone number',
  [FakeDataType.Number]: 'Number',
  [FakeDataType.UUID]: 'UUID',
  [FakeDataType.StreetAddress]: 'Street address',
  [FakeDataType.City]: 'City',
  [FakeDataType.ZipCode]: 'Zipcode',
  [FakeDataType.Country]: 'Country',
  [FakeDataType.Latitude]: 'Latitude',
  [FakeDataType.Longitude]: 'Longitude',
  [FakeDataType.Url]: 'URL',
}).map(([ value, label ]) => ({
  value,
  label
})))

const onUpdate = (newValue: FakeDataType | null) => {
  emit('update:modelValue', newValue)
}
</script>
