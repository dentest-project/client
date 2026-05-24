<template>
  <el-card shadow="always" class="DomainFixtureTableOfContents-card">
    <template #header>
      <div class="DomainFixtureTableOfContents-header">
        <h2 class="DomainFixtureTableOfContents-title">Entities</h2>
      </div>
    </template>
    <nav aria-label="Fixtures entities">
      <ul class="DomainFixtureTableOfContents-list">
        <li
          v-for="item in items"
          :key="item.anchorId"
          class="DomainFixtureTableOfContents-item"
        >
          <a
            :href="`#${item.anchorId}`"
            class="DomainFixtureTableOfContents-link"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    anchorId: string,
    label: string
  }>
}>()
</script>

<style scoped>
.DomainFixtureTableOfContents-card {
  margin-bottom: 2rem;
}

.DomainFixtureTableOfContents-header {
  align-items: center;
  display: flex;
}

.DomainFixtureTableOfContents-item {
  display: flex;
}

.DomainFixtureTableOfContents-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.DomainFixtureTableOfContents-link {
  align-items: center;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  color: var(--el-color-primary);
  display: inline-flex;
  line-height: 1.5;
  min-height: 2.5rem;
  overflow-wrap: anywhere;
  padding: 0.45rem 0.75rem;
  text-decoration: none;
}

.DomainFixtureTableOfContents-link:hover {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
}

.DomainFixtureTableOfContents-title {
  font-size: 1rem;
  margin: 0;
}
</style>
