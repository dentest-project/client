<template>
  <NuxtLink :to="to" class="DomainFixtureCard-link">
    <el-card shadow="hover" class="DomainFixtureCard-card">
      <div class="DomainFixtureCard-header">
        <el-icon><Document /></el-icon>
        <span class="DomainFixtureCard-title">{{ title }}</span>
      </div>
      <table v-if="hasSummaries" class="DomainFixtureCard-table">
        <tbody>
          <tr v-if="propertySummaries.length > 0" class="DomainFixtureCard-sectionRow">
            <th colspan="2">Properties</th>
          </tr>
          <tr
            v-for="propertySummary in propertySummaries"
            :key="`property-${propertySummary.label}`"
            class="DomainFixtureCard-tableRow"
          >
            <th class="DomainFixtureCard-tableLabel" scope="row">{{ propertySummary.label }}</th>
            <td class="DomainFixtureCard-tableValue">{{ propertySummary.value }}</td>
          </tr>
          <tr v-if="associationSummaries.length > 0" class="DomainFixtureCard-sectionRow">
            <th colspan="2">Associations</th>
          </tr>
          <tr
            v-for="associationSummary in associationSummaries"
            :key="`association-${associationSummary.label}`"
            class="DomainFixtureCard-tableRow"
          >
            <th class="DomainFixtureCard-tableLabel" scope="row">{{ associationSummary.label }}</th>
            <td class="DomainFixtureCard-tableValue">{{ associationSummary.value }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="DomainFixtureCard-empty">
        No values yet.
      </div>
    </el-card>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import type { DomainFixture, DomainFixturePropertyValue } from '~/types'

const props = defineProps<{
  fixture: DomainFixture,
  to: string
}>()

const title = computed(() => props.fixture.name.trim().length > 0 ? props.fixture.name : 'Untitled fixture')
const hasSummaries = computed(() => propertySummaries.value.length > 0 || associationSummaries.value.length > 0)

const propertySummaries = computed(() => props.fixture.propertyValues.map(propertyValue => ({
  label: propertyValue.property.name,
  value: formatPropertyValue(propertyValue)
})))

const associationSummaries = computed(() => {
  const groupedAssociations = props.fixture.associationValues.reduce((groups, associationValue) => {
    const key = associationValue.association.id

    if (!groups[key]) {
      groups[key] = {
        label: associationValue.association.sourceName,
        values: []
      }
    }

    groups[key].values.push(associationValue.targetFixture.name)

    return groups
  }, {} as Record<string, { label: string, values: string[] }>)

  return Object.values(groupedAssociations).map((association) => ({
    label: association.label,
    value: association.values.join(', ')
  }))
})

const formatPropertyValue = (propertyValue: DomainFixturePropertyValue): string => {
  if (typeof propertyValue.booleanValue === 'boolean') {
    return propertyValue.booleanValue ? 'True' : 'False'
  }

  if (typeof propertyValue.integerValue === 'number') {
    return propertyValue.integerValue.toString()
  }

  if (propertyValue.decimalValue !== undefined && propertyValue.decimalValue !== null) {
    return propertyValue.decimalValue
  }

  if (propertyValue.stringValue !== undefined && propertyValue.stringValue !== null && propertyValue.stringValue.length > 0) {
    return propertyValue.stringValue
  }

  return 'Empty'
}
</script>

<style scoped>
.DomainFixtureCard-card {
  height: 100%;
}

.DomainFixtureCard-empty {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.DomainFixtureCard-header {
  align-items: center;
  display: flex;
  margin-bottom: 0.85rem;
}

.DomainFixtureCard-link {
  color: inherit;
  display: block;
  text-decoration: none;
}

.DomainFixtureCard-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-left: 0.75rem;
}

.DomainFixtureCard-table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

.DomainFixtureCard-tableLabel,
.DomainFixtureCard-tableValue {
  border-top: 1px solid var(--el-border-color-lighter);
  line-height: 1.45;
  padding: 0.45rem 0;
  vertical-align: top;
}

.DomainFixtureCard-tableLabel {
  color: var(--el-text-color-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  padding-right: 0.75rem;
  text-align: left;
  width: 42%;
}

.DomainFixtureCard-tableValue {
  overflow-wrap: anywhere;
}

.DomainFixtureCard-sectionRow th {
  color: var(--el-text-color-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.6rem 0 0.35rem;
  text-align: left;
  text-transform: uppercase;
}

.DomainFixtureCard-sectionRow:first-child th {
  padding-top: 0;
}
</style>
