<template>
  <div class="deletable-row">
    <slot />
    <delete-button @click="(e) => $emit('delete', e)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DeleteButton from '~/components/buttons/DeleteButton.vue'

export default Vue.extend({
  components: {
    DeleteButton,
  },
})
</script>

<style scoped>
.deletable-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2rem 0.5rem;
}

.deletable-row > * {
  margin: 0 0.5rem;
}
</style>
