<template>
  <section :id="anchorId" class="DomainFixtureGroup-anchor">
    <div class="DomainFixtureGroup-header">
      <NuxtLink :to="entityLink" class="DomainFixtureGroup-entity">{{ entity.name }}</NuxtLink>
      <AddFixtureButton v-if="canWrite" :to="createLink" size="small" class="DomainFixtureGroup-action" />
      <div class="DomainFixtureGroup-count">
        {{ fixtureCountLabel }}
      </div>
    </div>
    <div class="DomainFixtureGroup-body">
      <div v-if="fixtures.length > 0" class="DomainFixtureGroup-grid">
        <DomainFixtureCard
          v-for="fixture in fixtures"
          :key="fixture.id"
          :fixture="fixture"
          :to="fixtureLink(fixture.id as string)"
        />
      </div>
      <Panel v-else type="info">
        No fixtures yet.
      </Panel>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DomainEntity, DomainFixtureList } from '~/types'

const props = defineProps<{
  anchorId: string,
  canWrite: boolean,
  createLink: string,
  entity: DomainEntity,
  entityLink: string,
  fixtureLink: (fixtureId: string) => string,
  fixtures: DomainFixtureList
}>()

const fixtureCountLabel = computed(() => `${props.fixtures.length} ${props.fixtures.length === 1 ? 'fixture' : 'fixtures'}`)
</script>

<style scoped>
.DomainFixtureGroup-anchor {
  min-width: 0;
  scroll-margin-top: 6rem;
}

.DomainFixtureGroup-body {
  margin-top: 1rem;
}

.DomainFixtureGroup-count {
  color: var(--el-text-color-secondary);
  grid-area: count;
}

.DomainFixtureGroup-entity {
  color: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  grid-area: entity;
  text-decoration: none;
}

.DomainFixtureGroup-entity:hover {
  color: var(--el-color-primary);
}

.DomainFixtureGroup-action {
  grid-area: action;
  justify-self: start;
}

.DomainFixtureGroup-header {
  align-items: start;
  border-bottom: 1px solid var(--el-border-color-lighter);
  column-gap: 1rem;
  display: grid;
  grid-template-areas:
    'entity'
    'count'
    'action';
  grid-template-columns: minmax(0, 1fr);
  min-height: 3.5rem;
  padding-bottom: 0.85rem;
  row-gap: 0.6rem;
}

.DomainFixtureGroup-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}

@media (max-width: 767px) {
  .DomainFixtureGroup-header {
    grid-template-areas:
      'entity'
      'count'
      'action';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
