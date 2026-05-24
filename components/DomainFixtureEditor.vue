<template>
  <div class="DomainFixtureEditor">
    <section class="DomainFixtureEditor-hero">
      <div v-if="canWrite" class="DomainFixtureEditor-titleWrapper">
        <EditableTitle
          v-model="fixtureName"
          empty-label="Untitled fixture"
          label="Fixture name"
        />
      </div>
      <h1 v-else class="DomainFixtureEditor-title">{{ draft.name.trim().length > 0 ? draft.name : 'Untitled fixture' }}</h1>
      <div v-if="hasHeaderActions" class="DomainFixtureEditor-headerActions">
        <slot name="header-actions" />
      </div>
    </section>

    <section class="DomainFixtureEditor-section">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <label class="DomainFixtureEditor-label">Entity</label>
          <el-select
            v-if="canWrite && entitySelectable"
            :model-value="draft.entity.id"
            class="DomainFixtureEditor-fullWidth"
            filterable
            placeholder="Select entity"
            @update:model-value="onEntityUpdated"
          >
            <el-option
              v-for="entity in selectableEntities"
              :key="entity.id"
              :label="entity.name"
              :value="entity.id"
            />
          </el-select>
          <NuxtLink
            v-else-if="selectedEntity && entityLink"
            :to="entityLink(selectedEntity.id as string)"
            class="DomainFixtureEditor-entityLink"
          >
            {{ selectedEntity.name }}
          </NuxtLink>
          <div v-else class="DomainFixtureEditor-staticValue">
            {{ selectedEntity?.name ?? 'No entity selected.' }}
          </div>
        </el-col>
      </el-row>
    </section>

    <section class="DomainFixtureEditor-section">
      <div class="DomainFixtureEditor-sectionHeader">
        <div>
          <h2>Properties</h2>
          <p class="DomainFixtureEditor-sectionDescription">Values stored directly on the selected entity.</p>
        </div>
      </div>
      <Panel v-if="!selectedEntity" type="info">
        Select an entity to define fixture values.
      </Panel>
      <Panel v-else-if="selectedEntity.properties.length === 0" type="info">
        This entity has no properties.
      </Panel>
      <el-row v-else :gutter="20">
        <el-col
          v-for="property in selectedEntity.properties"
          :key="property.id"
          :xs="24"
          :lg="12"
          class="DomainFixtureEditor-cardColumn"
        >
          <DomainFixturePropertyField
            :can-write="canWrite"
            :model-value="propertyValueById[property.id as string]"
            :property="property"
            @set-title="onTitleValueSelected"
            @update:model-value="(value) => onPropertyValueUpdated(property.id as string, value)"
          />
        </el-col>
      </el-row>
    </section>

    <section class="DomainFixtureEditor-section">
      <div class="DomainFixtureEditor-sectionHeader">
        <div>
          <h2>Associations</h2>
          <p class="DomainFixtureEditor-sectionDescription">Link this fixture to other fixtures through the entity relationships.</p>
        </div>
      </div>
      <Panel v-if="!selectedEntity" type="info">
        Select an entity to configure associations.
      </Panel>
      <Panel v-else-if="selectedEntity.associations.length === 0" type="info">
        This entity has no outgoing associations.
      </Panel>
      <el-row v-else :gutter="20">
        <el-col
          v-for="association in selectedEntity.associations"
          :key="association.id"
          :xs="24"
          :lg="12"
          class="DomainFixtureEditor-cardColumn"
        >
          <DomainFixtureAssociationField
            :association="association"
            :association-values="associationValuesById[association.id as string] ?? []"
            :can-write="canWrite"
            :project-fixtures="associationTargetFixtures"
            @update:association-values="(values) => onAssociationValuesUpdated(association.id as string, values)"
          />
        </el-col>
      </el-row>
    </section>

    <Panel v-if="canWrite && validationErrors.length > 0" type="warning" class="DomainFixtureEditor-validation">
      <ul class="DomainFixtureEditor-errors">
        <li v-for="validationError in validationErrors" :key="validationError">{{ validationError }}</li>
      </ul>
    </Panel>

    <div v-if="canWrite" class="DomainFixtureEditor-actions">
      <el-button type="primary" :disabled="validationErrors.length > 0" @click="onSubmitClicked">
        <el-icon><Promotion /></el-icon>
        <span class="DomainFixtureEditor-buttonLabel">{{ saveLabel }}</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import {
  createSuggestedDomainFixtureName,
  getDomainEntityById,
  normalizeDomainFixtureDraft,
  validateDomainFixture
} from '~/helpers/domainFixtures'
import type {
  DomainEntity,
  DomainFixtureAssociationValue,
  DomainFixtureDraft,
  DomainFixtureList,
  DomainFixturePropertyValueDraft
} from '~/types'

const props = defineProps<{
  canWrite: boolean,
  entitySelectable: boolean,
  entityLink?: (entityId: string) => string,
  initialValue: DomainFixtureDraft,
  projectDomainModel: DomainEntity[],
  projectFixtures: DomainFixtureList,
  saveLabel: string
}>()

const emit = defineEmits(['submit'])
const slots = useSlots()

const draft = ref<DomainFixtureDraft>(normalizeDraft(props.initialValue, false))

watch(() => props.initialValue, (newInitialValue) => {
  draft.value = normalizeDraft(newInitialValue, false)
}, { deep: true })

const selectableEntities = computed(() => props.projectDomainModel.filter(entity => !!entity.id))
const selectedEntity = computed(() => getDomainEntityById(props.projectDomainModel, draft.value.entity.id))
const hasHeaderActions = computed(() => !!slots['header-actions'])
const fixtureName = computed({
  get: (): string => draft.value.name,
  set: (value: string) => {
    draft.value = {
      ...draft.value,
      name: value
    }
  }
})
const propertyValueById = computed(() => Object.fromEntries(draft.value.propertyValues.map(propertyValue => [propertyValue.property.id, propertyValue])))
const associationValuesById = computed<Record<string, DomainFixtureAssociationValue[]>>(() =>
  draft.value.associationValues.reduce((groups, associationValue) => {
    const associationId = associationValue.association.id

    if (!groups[associationId]) {
      groups[associationId] = []
    }

    groups[associationId].push(associationValue)

    return groups
  }, {} as Record<string, DomainFixtureAssociationValue[]>)
)
const associationTargetFixtures = computed(() => props.projectFixtures)
const validationErrors = computed(() => validateDomainFixture(draft.value, props.projectDomainModel, props.projectFixtures))

const onEntityUpdated = (entityId?: string) => {
  const previousEntity = selectedEntity.value
  const previousSuggestedName = previousEntity
    ? createSuggestedDomainFixtureName(previousEntity, props.projectFixtures, draft.value.id)
    : ''
  const nextDraft = normalizeDraft(
    {
      ...draft.value,
      entity: {
        id: entityId ?? ''
      }
    },
    true
  )
  const nextEntity = getDomainEntityById(props.projectDomainModel, entityId ?? '')

  if (
    nextEntity &&
    (
      draft.value.name.trim().length === 0 ||
      draft.value.name === previousSuggestedName
    )
  ) {
    nextDraft.name = createSuggestedDomainFixtureName(nextEntity, props.projectFixtures, draft.value.id)
  }

  draft.value = nextDraft
}

const onPropertyValueUpdated = (propertyId: string, propertyValue: DomainFixturePropertyValueDraft) => {
  draft.value = {
    ...draft.value,
    propertyValues: draft.value.propertyValues.map(currentPropertyValue =>
      currentPropertyValue.property.id === propertyId ? propertyValue : currentPropertyValue
    )
  }
}

const onTitleValueSelected = (value: string) => {
  draft.value = {
    ...draft.value,
    name: value
  }
}

const onAssociationValuesUpdated = (associationId: string, associationValues: DomainFixtureAssociationValue[]) => {
  draft.value = {
    ...draft.value,
    associationValues: [
      ...draft.value.associationValues.filter(associationValue => associationValue.association.id !== associationId),
      ...associationValues
    ]
  }
}

const onSubmitClicked = () => {
  emit('submit', normalizeDraft(draft.value, false))
}

function normalizeDraft(value: DomainFixtureDraft, suggestMissingValues: boolean): DomainFixtureDraft {
  return normalizeDomainFixtureDraft(value, props.projectDomainModel, props.projectFixtures, suggestMissingValues)
}
</script>

<style scoped>
.DomainFixtureEditor {
  padding-bottom: 2rem;
}

.DomainFixtureEditor-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
}

.DomainFixtureEditor-buttonLabel {
  margin-left: 1rem;
}

.DomainFixtureEditor-cardColumn {
  margin-bottom: 1.25rem;
}

.DomainFixtureEditor-entityLink {
  color: var(--el-color-primary);
  display: inline-block;
  font-weight: 600;
  padding-top: 0.5rem;
  text-decoration: none;
}

.DomainFixtureEditor-entityLink:hover {
  text-decoration: underline;
}

.DomainFixtureEditor-errors {
  margin: 0;
  padding-left: 1rem;
}

.DomainFixtureEditor-fullWidth {
  width: 100%;
}

.DomainFixtureEditor-hero {
  margin-bottom: 1.5rem;
}

.DomainFixtureEditor-headerActions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.DomainFixtureEditor-label {
  color: var(--el-text-color-secondary);
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.DomainFixtureEditor-section + .DomainFixtureEditor-section {
  margin-top: 2.5rem;
}

.DomainFixtureEditor-sectionDescription {
  color: var(--el-text-color-secondary);
  margin: 0.25rem 0 0;
}

.DomainFixtureEditor-sectionHeader {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.DomainFixtureEditor-staticValue {
  color: var(--el-text-color-secondary);
  min-height: 2.5rem;
  padding-top: 0.5rem;
}

.DomainFixtureEditor-title {
  margin: 0;
}

.DomainFixtureEditor-titleWrapper :deep(.editable-title) {
  margin: 0;
}

.DomainFixtureEditor-titleWrapper :deep(.editable-title-input) {
  width: 100%;
}

.DomainFixtureEditor-titleWrapper :deep(.editable-title-input .el-input__wrapper) {
  padding: 0;
}

.DomainFixtureEditor-titleWrapper :deep(.editable-title-input input) {
  padding-left: 0;
}

.DomainFixtureEditor-validation {
  margin-top: 2rem;
}
</style>
