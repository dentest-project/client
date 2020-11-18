<template>
  <div class="breadcrumb" :style="`background: linear-gradient(0deg, ${$colors.lightPrimary} 0%, #ffffff 20%, #ffffff 100%)`">
    <v-breadcrumbs :items="items" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Breadcrumb } from '~/types';

export default Vue.extend({
  props: {
    items: {
      type: Array,
      required: true
    } as PropOptions<Breadcrumb>
  }
});
</script>
