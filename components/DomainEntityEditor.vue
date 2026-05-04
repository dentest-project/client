<template>
  <div class="DomainEntityEditor">
    <Panel v-if="!canWrite" type="info" bold>
      This project is read only for you. The domain model is visible, but editing is disabled.
    </Panel>
    <Panel v-if="canWrite && validationErrors.length > 0" type="warning">
      <ul class="DomainEntityEditor-errors">
        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
      </ul>
    </Panel>

    <section class="DomainEntityEditor-hero">
      <div v-if="canWrite" class="DomainEntityEditor-nameTitle">
        <EditableTitle v-model="draft.name" empty-label="Untitled entity" label="Entity name" />
      </div>
      <h1 v-else class="DomainEntityEditor-name">{{ entityTitle }}</h1>
      <Panel type="info">
        <EditableParagraph
          v-model="draft.description"
          :editable="canWrite"
          empty-label="No description yet."
          placeholder="Describe the role of this entity"
        />
      </Panel>
    </section>

    <section class="DomainEntityEditor-section">
      <div class="DomainEntityEditor-sectionHeader">
        <div>
          <h2>Properties</h2>
          <p class="DomainEntityEditor-sectionDescription">Fields stored directly on this entity.</p>
        </div>
        <el-button v-if="canWrite" plain @click="onPropertyAdded">
          <el-icon><Plus /></el-icon>
          <span class="DomainEntityEditor-buttonLabel">Add property</span>
        </el-button>
      </div>
      <Panel v-if="draft.properties.length === 0" type="info">
        No properties are defined yet.
      </Panel>
      <el-row v-else :gutter="20">
        <el-col
          v-for="(property, index) in draft.properties"
          :key="property.id ?? `property-${index}`"
          :xs="24"
          :lg="12"
          class="DomainEntityEditor-cardColumn"
        >
          <el-card class="DomainEntityEditor-card">
            <template #header>
              <div class="DomainEntityEditor-cardHeader">
                <div class="DomainEntityEditor-cardHeading">
                  <EditableSubtitle
                    v-if="canWrite"
                    v-model="property.name"
                    empty-label="Untitled property"
                    heading-tag="h3"
                    label="Property name"
                  />
                  <h3 v-else class="DomainEntityEditor-cardTitle">{{ getPropertyTitle(property) }}</h3>
                  <div class="DomainEntityEditor-cardMeta">
                    <el-tag effect="plain">{{ getDomainPropertyTypeLabel(property.type) }}</el-tag>
                    <el-tag :type="property.nullable ? 'warning' : 'success'" effect="plain">
                      {{ property.nullable ? 'Nullable' : 'Required' }}
                    </el-tag>
                  </div>
                </div>
                <div v-if="canWrite" class="DomainEntityEditor-cardActions">
                  <MoveUpButton :disabled="index === 0" @click="onPropertyMoved(index, -1)" />
                  <MoveDownButton :disabled="index === draft.properties.length - 1" @click="onPropertyMoved(index, 1)" />
                  <DeleteButton label="Delete" size="small" @deleted="onPropertyRemoved(index)" />
                </div>
              </div>
            </template>

            <label class="DomainEntityEditor-label">Description</label>
            <EditableParagraph
              v-model="property.description"
              :editable="canWrite"
              class="DomainEntityEditor-descriptionField"
              empty-label="No description yet."
              placeholder="Describe what this property stores"
            />

            <el-row v-if="canWrite" :gutter="20" class="DomainEntityEditor-formRow">
              <el-col :xs="24" :sm="12">
                <label class="DomainEntityEditor-label">Type</label>
                <el-select
                  v-model="property.type"
                  :disabled="!canWrite"
                  class="DomainEntityEditor-fullWidth"
                  @change="() => onPropertyTypeChanged(property)"
                >
                  <el-option
                    v-for="option in domainPropertyTypeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12">
                <label class="DomainEntityEditor-label">Presence</label>
                <div class="DomainEntityEditor-switchRow">
                  <el-switch
                    v-model="property.nullable"
                    :disabled="!canWrite"
                    active-text="Nullable"
                    inactive-text="Required"
                  />
                </div>
              </el-col>
            </el-row>

            <div class="DomainEntityEditor-constraints">
              <div class="DomainEntityEditor-sectionHeader DomainEntityEditor-subSectionHeader">
                <div>
                  <h3>Constraints</h3>
                  <p class="DomainEntityEditor-sectionDescription">Validation rules enforced on this property.</p>
                </div>
                <el-button
                  v-if="canWrite"
                  plain
                  size="small"
                  :disabled="availableConstraintKinds(property).length === property.constraints.length"
                  @click="onConstraintAdded(property)"
                >
                  <el-icon><Plus /></el-icon>
                  <span class="DomainEntityEditor-buttonLabel">Add constraint</span>
                </el-button>
              </div>
              <Panel v-if="property.constraints.length === 0" type="info">
                No constraints defined for this property.
              </Panel>
              <ul
                v-else-if="!canWrite"
                class="DomainEntityEditor-staticList"
              >
                <li
                  v-for="(constraint, constraintIndex) in property.constraints"
                  :key="constraint.id ?? `constraint-readonly-${index}-${constraintIndex}`"
                  class="DomainEntityEditor-staticListItem"
                >
                  <span class="DomainEntityEditor-staticListLabel">{{ getDomainPropertyConstraintLabel(constraint.kind) }}</span>
                  <span>{{ getConstraintValueLabel(property.type, constraint) }}</span>
                </li>
              </ul>
              <template v-else>
                <div
                  v-for="(constraint, constraintIndex) in property.constraints"
                  :key="constraint.id ?? `constraint-${index}-${constraintIndex}`"
                  class="DomainEntityEditor-constraintRow"
                >
                  <el-select
                    v-model="constraint.kind"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintKind"
                    @change="() => onConstraintKindChanged(property, constraint)"
                  >
                    <el-option
                      v-for="constraintKind in availableConstraintKinds(property)"
                      :key="constraintKind"
                      :disabled="constraintKindIsTaken(property, constraint, constraintKind)"
                      :label="getDomainPropertyConstraintLabel(constraintKind)"
                      :value="constraintKind"
                    />
                  </el-select>
                  <el-select
                    v-if="getDomainConstraintValueInput(property.type, constraint.kind) === 'format'"
                    v-model="constraint.format"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                  >
                    <el-option
                      v-for="formatOption in domainPropertyStringFormatOptions"
                      :key="formatOption.value"
                      :label="formatOption.label"
                      :value="formatOption.value"
                    />
                  </el-select>
                  <el-input-number
                    v-else-if="getDomainConstraintValueInput(property.type, constraint.kind) === 'integer'"
                    v-model="constraint.integerValue"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                    controls-position="right"
                  />
                  <el-input
                    v-else-if="getDomainConstraintValueInput(property.type, constraint.kind) === 'decimal'"
                    v-model="constraint.decimalValue"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                    placeholder="0.000000"
                  />
                  <el-input
                    v-else-if="getDomainConstraintValueInput(property.type, constraint.kind) === 'date'"
                    v-model="constraint.stringValue"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                    type="date"
                  />
                  <el-input
                    v-else-if="getDomainConstraintValueInput(property.type, constraint.kind) === 'datetime'"
                    v-model="constraint.stringValue"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                    type="datetime-local"
                  />
                  <el-input
                    v-else-if="getDomainConstraintValueInput(property.type, constraint.kind) === 'time'"
                    v-model="constraint.stringValue"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                    type="time"
                  />
                  <el-input
                    v-else
                    v-model="constraint.stringValue"
                    :disabled="!canWrite"
                    class="DomainEntityEditor-constraintValue"
                    placeholder="Constraint value"
                  />
                  <DeleteButton
                    label="Delete"
                    size="small"
                    :disabled="!canWrite"
                    @deleted="onConstraintRemoved(property, constraintIndex)"
                  />
                </div>
              </template>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="DomainEntityEditor-section">
      <div class="DomainEntityEditor-sectionHeader">
        <div>
          <h2>Outgoing associations</h2>
          <p class="DomainEntityEditor-sectionDescription">Relationships owned by this entity.</p>
        </div>
        <el-button v-if="canWrite" plain @click="onAssociationAdded">
          <el-icon><Plus /></el-icon>
          <span class="DomainEntityEditor-buttonLabel">Add association</span>
        </el-button>
      </div>
      <Panel v-if="draft.associations.length === 0" type="info">
        No outgoing associations are defined yet.
      </Panel>
      <el-row v-else :gutter="20">
        <el-col
          v-for="(association, index) in draft.associations"
          :key="association.id ?? `association-${index}`"
          :xs="24"
          :lg="12"
          class="DomainEntityEditor-cardColumn"
        >
          <el-card class="DomainEntityEditor-card">
            <template #header>
              <div class="DomainEntityEditor-cardHeader">
                <div class="DomainEntityEditor-cardHeading">
                  <EditableSubtitle
                    v-if="canWrite"
                    v-model="association.sourceName"
                    empty-label="Untitled association"
                    heading-tag="h3"
                    label="Name on this entity"
                  />
                  <h3 v-else class="DomainEntityEditor-cardTitle">{{ getAssociationTitle(association) }}</h3>
                  <div class="DomainEntityEditor-cardMeta DomainEntityEditor-cardMeta--association">
                    <el-tag effect="plain">{{ getDomainAssociationCardinalityLabel(association.sourceCardinality) }}</el-tag>
                    <span class="DomainEntityEditor-cardMetaText">to {{ getAssociationTargetSummary(association) }}</span>
                  </div>
                </div>
                <div v-if="canWrite" class="DomainEntityEditor-cardActions">
                  <MoveUpButton :disabled="index === 0" @click="onAssociationMoved(index, -1)" />
                  <MoveDownButton :disabled="index === draft.associations.length - 1" @click="onAssociationMoved(index, 1)" />
                  <DeleteButton label="Delete" size="small" @deleted="onAssociationRemoved(index)" />
                </div>
              </div>
            </template>

            <el-row v-if="canWrite" :gutter="20" class="DomainEntityEditor-associationForm">
              <el-col :xs="24" :sm="12">
                <label class="DomainEntityEditor-label">Target entity</label>
                <el-select
                  :model-value="association.targetEntity?.id"
                  :disabled="!canWrite"
                  class="DomainEntityEditor-fullWidth"
                  filterable
                  placeholder="Select a target entity"
                  @update:model-value="(entityId) => onAssociationTargetChanged(association, entityId as string)"
                >
                  <el-option
                    v-for="entity in selectableEntities"
                    :key="entity.id"
                    :label="entity.name"
                    :value="entity.id"
                  />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12">
                <label class="DomainEntityEditor-label">Name on target entity</label>
                <el-select
                  v-model="association.targetName"
                  :disabled="!canWrite || !association.targetEntity?.id"
                  class="DomainEntityEditor-fullWidth"
                  filterable
                  :placeholder="association.targetEntity?.id ? 'Select a name on the target entity' : 'Select a target entity first'"
                  :no-data-text="association.targetEntity?.id ? 'No properties or associations available' : 'Select a target entity first'"
                >
                  <el-option
                    v-for="nameOption in getTargetNameOptions(association)"
                    :key="nameOption.value"
                    :label="nameOption.label"
                    :value="nameOption.value"
                  />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12">
                <label class="DomainEntityEditor-label">Source cardinality</label>
                <el-select
                  v-model="association.sourceCardinality"
                  :disabled="!canWrite"
                  class="DomainEntityEditor-fullWidth"
                >
                  <el-option
                    v-for="option in domainAssociationCardinalityOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12">
                <label class="DomainEntityEditor-label">Target cardinality</label>
                <el-select
                  v-model="association.targetCardinality"
                  :disabled="!canWrite"
                  class="DomainEntityEditor-fullWidth"
                >
                  <el-option
                    v-for="option in domainAssociationCardinalityOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-col>
              <el-col :xs="24">
                <label class="DomainEntityEditor-label">Description</label>
                <EditableParagraph
                  v-model="association.description"
                  :editable="canWrite"
                  class="DomainEntityEditor-descriptionField"
                  empty-label="No description yet."
                  placeholder="Describe how this relationship is used"
                />
              </el-col>
            </el-row>
            <div v-else class="DomainEntityEditor-staticGrid">
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Target entity</label>
                <NuxtLink
                  v-if="association.targetEntity?.id"
                  :to="getEntityLink(association.targetEntity.id)"
                  class="DomainEntityEditor-entityLink"
                >
                  {{ association.targetEntity.name }}
                </NuxtLink>
                <div v-else class="DomainEntityEditor-staticValue">No target entity.</div>
              </div>
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Name on target entity</label>
                <div class="DomainEntityEditor-staticValue">{{ getTextOrFallback(association.targetName, 'No name on the target entity.') }}</div>
              </div>
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Source cardinality</label>
                <div class="DomainEntityEditor-staticValue">{{ getDomainAssociationCardinalityLabel(association.sourceCardinality) }}</div>
              </div>
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Target cardinality</label>
                <div class="DomainEntityEditor-staticValue">{{ getDomainAssociationCardinalityLabel(association.targetCardinality) }}</div>
              </div>
              <div class="DomainEntityEditor-staticField DomainEntityEditor-staticField--fullWidth">
                <label class="DomainEntityEditor-label">Description</label>
                <div class="DomainEntityEditor-staticValue">{{ getTextOrFallback(association.description, 'No description yet.') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="DomainEntityEditor-section">
      <div class="DomainEntityEditor-sectionHeader">
        <div>
          <h2>Incoming associations</h2>
          <p class="DomainEntityEditor-sectionDescription">Relationships managed from other entities and pointing here.</p>
        </div>
      </div>
      <Panel v-if="draft.targetAssociations.length === 0" type="info">
        No incoming associations point to this entity yet.
      </Panel>
      <el-row v-else :gutter="20">
        <el-col
          v-for="(association, index) in draft.targetAssociations"
          :key="association.id ?? `incoming-association-${index}`"
          :xs="24"
          :lg="12"
          class="DomainEntityEditor-cardColumn"
        >
          <el-card class="DomainEntityEditor-card">
            <template #header>
              <div class="DomainEntityEditor-cardHeader">
                <div class="DomainEntityEditor-cardHeading">
                  <h3 class="DomainEntityEditor-cardTitle">{{ getAssociationTitle(association) }}</h3>
                  <div class="DomainEntityEditor-cardMeta DomainEntityEditor-cardMeta--association">
                    <el-tag effect="plain">{{ getDomainAssociationCardinalityLabel(association.sourceCardinality) }}</el-tag>
                    <span class="DomainEntityEditor-cardMetaText">to {{ getTextOrFallback(association.targetName, entityTitle) }}</span>
                  </div>
                </div>
              </div>
            </template>

            <div class="DomainEntityEditor-staticGrid">
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Source entity</label>
                <NuxtLink
                  v-if="association.sourceEntity?.id"
                  :to="getEntityLink(association.sourceEntity.id)"
                  class="DomainEntityEditor-entityLink"
                >
                  {{ association.sourceEntity.name }}
                </NuxtLink>
                <div v-else class="DomainEntityEditor-staticValue">Unknown entity.</div>
              </div>
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Name on source entity</label>
                <div class="DomainEntityEditor-staticValue">{{ getTextOrFallback(association.sourceName, 'No name on the source entity.') }}</div>
              </div>
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Name on this entity</label>
                <div class="DomainEntityEditor-staticValue">{{ getTextOrFallback(association.targetName, 'No name on this entity.') }}</div>
              </div>
              <div class="DomainEntityEditor-staticField">
                <label class="DomainEntityEditor-label">Cardinality</label>
                <div class="DomainEntityEditor-staticValue">{{ getAssociationCardinalitySummary(association) }}</div>
              </div>
              <div class="DomainEntityEditor-staticField DomainEntityEditor-staticField--fullWidth">
                <label class="DomainEntityEditor-label">Description</label>
                <div class="DomainEntityEditor-staticValue">{{ getTextOrFallback(association.description, 'No description yet.') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <ActionsBar v-if="canWrite">
      <el-button type="primary" :disabled="validationErrors.length > 0" @click="onSubmitted">
        <el-icon><Promotion /></el-icon>
        <span class="DomainEntityEditor-buttonLabel">{{ saveLabel }}</span>
      </el-button>
    </ActionsBar>
  </div>
</template>

<script setup lang="ts">
import { Plus, Promotion } from '@element-plus/icons-vue'
import {
  createEmptyDomainAssociation,
  createEmptyDomainProperty,
  createEmptyDomainPropertyConstraint,
  domainAssociationCardinalityOptions,
  domainPropertyStringFormatOptions,
  domainPropertyTypeOptions,
  getAllowedConstraintKinds,
  getDomainAssociationCardinalityLabel,
  getDomainConstraintValueInput,
  getDomainPropertyConstraintLabel,
  getDomainPropertyTypeLabel,
  normalizeDomainEntityDraft,
  normalizeDomainPropertyConstraint,
  validateDomainEntity
} from '~/helpers/domainModel'
import {
  type DomainAssociation,
  type DomainEntity,
  type DomainEntityDraft,
  type DomainProperty,
  type DomainPropertyConstraint,
  type DomainPropertyConstraintKind,
  type DomainPropertyType
} from '~/types'

const props = defineProps<{
  entityLink: (entityId: string) => string,
  initialValue: DomainEntityDraft,
  projectDomainModel: DomainEntity[],
  canWrite: boolean,
  saveLabel: string
}>()

const emit = defineEmits<{
  submit: [value: DomainEntityDraft]
}>()

const cloneValue = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const draft = ref(normalizeDomainEntityDraft(cloneValue(props.initialValue)))

type DomainEntityNameOption = {
  label: string,
  value: string
}

watch(() => props.initialValue, (newValue) => {
  draft.value = normalizeDomainEntityDraft(cloneValue(newValue))
}, { deep: true })

const selectableEntities = computed(() => props.projectDomainModel.filter(entity => !!entity.id))

const validationErrors = computed(() => validateDomainEntity(normalizeDomainEntityDraft(cloneValue(draft.value)), props.projectDomainModel))

const entityTitle = computed(() => getTextOrFallback(draft.value.name, 'Untitled entity'))

const getTextOrFallback = (value: string | null | undefined, fallback: string): string => {
  const normalizedValue = value?.trim() ?? ''

  return normalizedValue.length > 0 ? normalizedValue : fallback
}

const getPropertyTitle = (property: DomainProperty): string => getTextOrFallback(property.name, 'Untitled property')

const getAssociationTitle = (association: DomainAssociation): string => getTextOrFallback(association.sourceName, 'Untitled association')

const getAssociationTargetSummary = (association: DomainAssociation): string => {
  const targetEntityName = association.targetEntity?.name?.trim() ?? ''
  const targetName = association.targetName.trim()

  if (targetEntityName.length === 0 && targetName.length === 0) {
    return 'no target selected'
  }

  if (targetEntityName.length === 0) {
    return targetName
  }

  if (targetName.length === 0) {
    return targetEntityName
  }

  return `${targetEntityName}.${targetName}`
}

const getAssociationCardinalitySummary = (association: DomainAssociation): string =>
  `${getDomainAssociationCardinalityLabel(association.sourceCardinality)} -> ${getDomainAssociationCardinalityLabel(association.targetCardinality)}`

const getEntityLink = (entityId: string): string => props.entityLink(entityId)

const getEntityById = (entityId?: string | null): DomainEntity | null => {
  if (!entityId) {
    return null
  }

  if (draft.value.id === entityId) {
    return draft.value as DomainEntity
  }

  return props.projectDomainModel.find(entity => entity.id === entityId) ?? null
}

const createNameOption = (name: string, typeLabel: string): DomainEntityNameOption | null => {
  const trimmedName = name.trim()

  if (trimmedName.length === 0) {
    return null
  }

  return {
    label: `${trimmedName} (${typeLabel})`,
    value: trimmedName
  }
}

const getTargetNameOptions = (association: DomainAssociation): DomainEntityNameOption[] => {
  const targetEntity = getEntityById(association.targetEntity?.id)

  if (!targetEntity) {
    return []
  }

  const names = [
    ...targetEntity.properties.map(property => createNameOption(property.name, 'Property')),
    ...targetEntity.associations.map(sourceAssociation => createNameOption(sourceAssociation.sourceName, 'Outgoing association')),
    ...targetEntity.targetAssociations.map(targetAssociation => createNameOption(targetAssociation.targetName, 'Incoming association'))
  ].filter((nameOption): nameOption is DomainEntityNameOption => nameOption !== null)

  const seen = new Set<string>()

  return names.filter((nameOption) => {
    const key = nameOption.value.toLocaleLowerCase()

    if (seen.has(key)) {
      return false
    }

    seen.add(key)

    return true
  })
}

const getConstraintValueLabel = (propertyType: DomainPropertyType, constraint: DomainPropertyConstraint): string => {
  switch (getDomainConstraintValueInput(propertyType, constraint.kind)) {
    case 'format':
      return domainPropertyStringFormatOptions.find(option => option.value === constraint.format)?.label ?? 'Not configured'
    case 'integer':
      return String(constraint.integerValue ?? 0)
    case 'decimal':
      return constraint.decimalValue ?? '0'
    case 'date':
    case 'datetime':
    case 'text':
    case 'time':
      return constraint.stringValue?.trim().length ? constraint.stringValue : 'Not configured'
    default:
      return 'Not configured'
  }
}

const availableConstraintKinds = (property: DomainProperty) => getAllowedConstraintKinds(property.type)

const constraintKindIsTaken = (
  property: DomainProperty,
  currentConstraint: DomainPropertyConstraint,
  constraintKind: DomainPropertyConstraintKind
) => property.constraints.some(constraint => constraint !== currentConstraint && constraint.kind === constraintKind)

const onPropertyAdded = () => {
  draft.value.properties.push(createEmptyDomainProperty())
}

const onPropertyMoved = (index: number, shift: number) => {
  const targetIndex = index + shift

  if (targetIndex < 0 || targetIndex >= draft.value.properties.length) {
    return
  }

  const currentProperty = draft.value.properties[index]

  draft.value.properties[index] = draft.value.properties[targetIndex]
  draft.value.properties[targetIndex] = currentProperty
}

const onPropertyRemoved = (index: number) => {
  draft.value.properties.splice(index, 1)
}

const onPropertyTypeChanged = (property: DomainProperty) => {
  property.constraints = property.constraints
    .filter(constraint => getAllowedConstraintKinds(property.type).includes(constraint.kind))
    .map(constraint => normalizeDomainPropertyConstraint(constraint, property.type))
}

const onConstraintAdded = (property: DomainProperty) => {
  const nextConstraintKind = availableConstraintKinds(property)
    .find(constraintKind => !property.constraints.some(constraint => constraint.kind === constraintKind))

  if (!nextConstraintKind) {
    return
  }

  property.constraints.push(
    normalizeDomainPropertyConstraint(
      createEmptyDomainPropertyConstraint(property.type),
      property.type
    )
  )
  property.constraints[property.constraints.length - 1].kind = nextConstraintKind
  property.constraints[property.constraints.length - 1] = normalizeDomainPropertyConstraint(property.constraints[property.constraints.length - 1], property.type)
}

const onConstraintKindChanged = (property: DomainProperty, constraint: DomainPropertyConstraint) => {
  Object.assign(constraint, normalizeDomainPropertyConstraint(constraint, property.type))
}

const onConstraintRemoved = (property: DomainProperty, index: number) => {
  property.constraints.splice(index, 1)
}

const onAssociationAdded = () => {
  draft.value.associations.push(createEmptyDomainAssociation())
}

const onAssociationMoved = (index: number, shift: number) => {
  const targetIndex = index + shift

  if (targetIndex < 0 || targetIndex >= draft.value.associations.length) {
    return
  }

  const currentAssociation = draft.value.associations[index]

  draft.value.associations[index] = draft.value.associations[targetIndex]
  draft.value.associations[targetIndex] = currentAssociation
}

const onAssociationRemoved = (index: number) => {
  draft.value.associations.splice(index, 1)
}

const onAssociationTargetChanged = (association: DomainAssociation, entityId: string) => {
  const entity = selectableEntities.value.find(candidate => candidate.id === entityId)

  association.targetEntity = entity
    ? {
        id: entity.id as string,
        name: entity.name
      }
    : null

  if (!getTargetNameOptions(association).some(nameOption => nameOption.value === association.targetName.trim())) {
    association.targetName = ''
  }
}

const onSubmitted = () => {
  emit('submit', normalizeDomainEntityDraft(cloneValue(draft.value)))
}
</script>

<style scoped>
.DomainEntityEditor {
  padding-bottom: 2rem;
}

.DomainEntityEditor-buttonLabel {
  display: inline-block;
  margin-left: 0.75rem;
}

.DomainEntityEditor-card {
  height: 100%;
}

.DomainEntityEditor-cardActions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.DomainEntityEditor-cardColumn {
  margin-bottom: 1.25rem;
}

.DomainEntityEditor-cardHeading {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.DomainEntityEditor-cardHeader {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.DomainEntityEditor-cardMeta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.DomainEntityEditor-cardMeta--association {
  gap: 0.75rem;
}

.DomainEntityEditor-cardMetaText {
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.DomainEntityEditor-cardTitle {
  margin: 0;
}

.DomainEntityEditor-constraintKind,
.DomainEntityEditor-constraintValue,
.DomainEntityEditor-fullWidth {
  width: 100%;
}

.DomainEntityEditor-constraintRow {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr) auto;
  margin-bottom: 0.75rem;
}

.DomainEntityEditor-constraints {
  margin-top: 1.5rem;
}

.DomainEntityEditor-entityLink {
  color: var(--el-color-primary);
  text-decoration: none;
}

.DomainEntityEditor-entityLink:hover {
  text-decoration: underline;
}

.DomainEntityEditor-errors {
  margin: 0;
  padding-left: 1.2rem;
}

.DomainEntityEditor-errors li + li {
  margin-top: 0.4rem;
}

.DomainEntityEditor-formRow {
  margin-top: 1rem;
}

.DomainEntityEditor-associationForm {
  margin-top: 1rem;
  row-gap: 0.75rem;
}

.DomainEntityEditor-hero {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.DomainEntityEditor-label {
  display: block;
  font-size: 0.95rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.DomainEntityEditor-name {
  margin: 0 0 1rem;
}

.DomainEntityEditor-nameTitle :deep(.editable-title) {
  margin: 0 0 1rem;
}

.DomainEntityEditor-nameTitle :deep(.editable-title-input) {
  width: 100%;
}

.DomainEntityEditor-nameTitle :deep(.editable-title-input .el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.DomainEntityEditor-nameTitle :deep(.editable-title-input input) {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  padding: 0 0 0.5rem;
}

.DomainEntityEditor-staticField {
  min-width: 0;
}

.DomainEntityEditor-staticField--fullWidth {
  grid-column: 1 / -1;
}

.DomainEntityEditor-staticGrid {
  display: grid;
  gap: 1rem 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.DomainEntityEditor-staticList {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.DomainEntityEditor-staticListItem {
  align-items: center;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.DomainEntityEditor-staticListLabel,
.DomainEntityEditor-staticValue {
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.DomainEntityEditor-staticListLabel {
  font-weight: 600;
}

.DomainEntityEditor-staticValue {
  white-space: pre-line;
}

.DomainEntityEditor-descriptionField :deep(.EditableParagraph),
.DomainEntityEditor-descriptionField :deep(.EditableParagraph-textarea textarea) {
  padding-left: 0;
  padding-right: 0;
}

.DomainEntityEditor-cardHeading :deep(.editableSubtitle) {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.DomainEntityEditor-cardHeading :deep(.editableSubtitle-input) {
  width: 100%;
}

.DomainEntityEditor-cardHeading :deep(.editableSubtitle-input .el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.DomainEntityEditor-cardHeading :deep(.editableSubtitle-input input) {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0;
  width: 100%;
}

.DomainEntityEditor-section + .DomainEntityEditor-section {
  margin-top: 2rem;
}

.DomainEntityEditor-sectionDescription {
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  margin: 0.35rem 0 0;
}

.DomainEntityEditor-sectionHeader {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.DomainEntityEditor-subSectionHeader {
  margin-top: 1rem;
}

.DomainEntityEditor-switchRow {
  align-items: center;
  display: flex;
  min-height: 40px;
}

@media (max-width: 767px) {
  .DomainEntityEditor-cardHeader,
  .DomainEntityEditor-sectionHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .DomainEntityEditor-constraintRow {
    grid-template-columns: 1fr;
  }

  .DomainEntityEditor-staticGrid {
    grid-template-columns: 1fr;
  }

  .DomainEntityEditor-nameTitle :deep(.editable-title-input input) {
    font-size: 1.6rem;
  }
}
</style>
