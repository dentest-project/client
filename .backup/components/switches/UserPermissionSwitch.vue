<template>
  <v-switch
    :input-value="value"
    :label="label"
    :messages="message"
    :disabled="disabled"
    dense
    @change="onStatusChanged"
  />
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { OrganizationPermission, ProjectPermission } from '~/types'

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
    permission: {
      type: String,
      required: true,
    } as PropOptions<OrganizationPermission | ProjectPermission>,
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onStatusChanged: function (e: Boolean) {
      this.$emit('change', {
        value: e,
        permission: this.permission,
      })
    },
  },
})
</script>
