<template>
  <el-card class="DomainFixtureAssociationField-card">
    <template #header>
      <div class="DomainFixtureAssociationField-header">
        <div>
          <h3 class="DomainFixtureAssociationField-title">{{ association.sourceName }}</h3>
          <div class="DomainFixtureAssociationField-meta">
            <span>{{ sourceCardinalityLabel }}</span>
            <span>to {{ association.targetEntity?.name ?? 'Unknown entity' }}</span>
            <span>{{ targetCardinalityLabel }}</span>
          </div>
        </div>
      </div>
    </template>
    <p class="DomainFixtureAssociationField-description">
      {{ association.description?.trim().length ? association.description : 'No description yet.' }}
    </p>
    <div v-if="canWrite && targetFixtures.length === 0" class="DomainFixtureAssociationField-emptyState">
      No compatible target fixture is available yet.
    </div>
    <el-select
      v-else-if="canWrite && association.sourceCardinality !== DomainAssociationCardinality.Many"
      :clearable="association.sourceCardinality === DomainAssociationCardinality.EventuallyOne"
      :model-value="selectedFixtureId"
      class="DomainFixtureAssociationField-fullWidth"
      filterable
      placeholder="Select fixture"
      @update:model-value="onSingleSelectionUpdated"
    >
      <el-option
        v-for="fixture in targetFixtures"
        :key="fixture.id"
        :label="fixture.name"
        :value="fixture.id"
      />
    </el-select>
    <el-select
      v-else-if="canWrite"
      :model-value="selectedFixtureIds"
      class="DomainFixtureAssociationField-fullWidth"
      collapse-tags
      collapse-tags-tooltip
      filterable
      multiple
      placeholder="Select fixtures"
      @update:model-value="onMultipleSelectionUpdated"
    >
      <el-option
        v-for="fixture in targetFixtures"
        :key="fixture.id"
        :label="fixture.name"
        :value="fixture.id"
      />
    </el-select>
    <div v-else-if="associationValues.length > 0" class="DomainFixtureAssociationField-selection">
      <el-tag
        v-for="associationValue in associationValues"
        :key="associationValue.targetFixture.id"
        effect="plain"
      >
        {{ associationValue.targetFixture.name }}
      </el-tag>
    </div>
    <div v-else class="DomainFixtureAssociationField-emptyState">
      {{ canWrite ? 'No target fixture selected.' : 'No target fixture.' }}
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {
  DomainAssociationCardinality,
  type DomainAssociation,
  type DomainFixtureAssociationValue,
  type DomainFixtureList
} from '~/types'
import { getDomainAssociationCardinalityLabel } from '~/helpers/domainModel'

const props = defineProps<{
  association: DomainAssociation,
  associationValues: DomainFixtureAssociationValue[],
  canWrite: boolean,
  projectFixtures: DomainFixtureList
}>()

const emit = defineEmits(['update:associationValues'])

const sourceCardinalityLabel = computed(() => `From ${getDomainAssociationCardinalityLabel(props.association.sourceCardinality)}`)
const targetCardinalityLabel = computed(() => `Target ${getDomainAssociationCardinalityLabel(props.association.targetCardinality)}`)
const targetFixtures = computed(() => props.projectFixtures
  .filter(fixture => fixture.entity.id === props.association.targetEntity?.id)
  .sort((left, right) => left.name.localeCompare(right.name)))
const selectedFixtureId = computed(() => props.associationValues[0]?.targetFixture.id)
const selectedFixtureIds = computed(() => props.associationValues.map(associationValue => associationValue.targetFixture.id))

const onSingleSelectionUpdated = (fixtureId?: string | null) => {
  if (!fixtureId) {
    emit('update:associationValues', [])
    return
  }

  emit('update:associationValues', [createAssociationValue(fixtureId)])
}

const onMultipleSelectionUpdated = (fixtureIds: string[]) => {
  emit('update:associationValues', fixtureIds.map(createAssociationValue))
}

const createAssociationValue = (fixtureId: string): DomainFixtureAssociationValue => {
  const existingValue = props.associationValues.find(associationValue => associationValue.targetFixture.id === fixtureId)

  if (existingValue) {
    return cloneAssociationValue(existingValue)
  }

  const targetFixture = props.projectFixtures.find(candidate => candidate.id === fixtureId)

  return {
    id: null,
    association: {
      id: props.association.id as string,
      sourceName: props.association.sourceName,
      targetName: props.association.targetName,
      targetEntity: props.association.targetEntity
        ? {
            id: props.association.targetEntity.id,
            name: props.association.targetEntity.name
          }
        : null
    },
    targetFixture: {
      id: fixtureId,
      name: targetFixture?.name ?? 'Unknown fixture',
      entity: targetFixture?.entity
        ? {
            id: targetFixture.entity.id,
            name: targetFixture.entity.name
          }
        : undefined
    }
  }
}

const cloneAssociationValue = (associationValue: DomainFixtureAssociationValue): DomainFixtureAssociationValue => ({
  id: associationValue.id ?? null,
  association: {
    id: associationValue.association.id,
    sourceName: associationValue.association.sourceName,
    targetName: associationValue.association.targetName,
    targetEntity: associationValue.association.targetEntity
      ? {
          id: associationValue.association.targetEntity.id,
          name: associationValue.association.targetEntity.name
        }
      : null
  },
  targetFixture: {
    id: associationValue.targetFixture.id,
    name: associationValue.targetFixture.name,
    entity: associationValue.targetFixture.entity
      ? {
          id: associationValue.targetFixture.entity.id,
          name: associationValue.targetFixture.entity.name
        }
      : undefined
  }
})
</script>

<style scoped>
.DomainFixtureAssociationField-card {
  height: 100%;
}

.DomainFixtureAssociationField-description {
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  margin: 0 0 1rem;
  white-space: pre-line;
}

.DomainFixtureAssociationField-emptyState {
  color: var(--el-text-color-secondary);
  min-height: 2.5rem;
}

.DomainFixtureAssociationField-fullWidth {
  width: 100%;
}

.DomainFixtureAssociationField-meta {
  color: var(--el-text-color-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.35rem;
}

.DomainFixtureAssociationField-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.DomainFixtureAssociationField-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
}
</style>
