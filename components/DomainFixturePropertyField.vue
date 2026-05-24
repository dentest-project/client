<template>
  <el-card class="DomainFixturePropertyField-card">
    <template #header>
      <div class="DomainFixturePropertyField-header">
        <div class="DomainFixturePropertyField-heading">
          <h3 class="DomainFixturePropertyField-title">{{ property.name }}</h3>
          <div class="DomainFixturePropertyField-meta">
            <span>{{ propertyTypeLabel }}</span>
            <span>{{ property.nullable ? 'Nullable' : 'Required' }}</span>
          </div>
        </div>
        <div v-if="canWrite" class="DomainFixturePropertyField-actions">
          <el-switch
            v-if="property.nullable"
            :model-value="modelValue.enabled"
            inline-prompt
            active-text="Set"
            inactive-text="Null"
            @update:model-value="onEnabledUpdated"
          />
          <el-button
            plain
            size="small"
            :disabled="!modelValue.enabled"
            @click="onRegenerateClicked"
          >
            <el-icon><RefreshRight /></el-icon>
            <span class="DomainFixturePropertyField-buttonLabel">Suggest</span>
          </el-button>
          <el-button
            v-if="canSetAsTitle"
            plain
            size="small"
            @click="onSetAsTitleClicked"
          >
            <el-icon><EditPen /></el-icon>
            <span class="DomainFixturePropertyField-buttonLabel">Set as title</span>
          </el-button>
        </div>
      </div>
    </template>
    <p class="DomainFixturePropertyField-description">
      {{ property.description.trim().length > 0 ? property.description : 'No description yet.' }}
    </p>
    <div v-if="constraintLabels.length > 0" class="DomainFixturePropertyField-constraints">
      <el-tag
        v-for="constraintLabel in constraintLabels"
        :key="constraintLabel"
        effect="plain"
        size="small"
      >
        {{ constraintLabel }}
      </el-tag>
    </div>
    <div v-if="modelValue.enabled && canWrite" class="DomainFixturePropertyField-input">
      <el-switch
        v-if="property.type === DomainPropertyType.Boolean"
        :model-value="modelValue.booleanValue ?? false"
        @update:model-value="onBooleanValueUpdated"
      />
      <el-date-picker
        v-else-if="property.type === DomainPropertyType.Date"
        :model-value="modelValue.stringValue ?? ''"
        class="DomainFixturePropertyField-fullWidth"
        type="date"
        value-format="YYYY-MM-DD"
        @update:model-value="onStringValueUpdated"
      />
      <el-date-picker
        v-else-if="property.type === DomainPropertyType.Datetime"
        :model-value="modelValue.stringValue ?? ''"
        class="DomainFixturePropertyField-fullWidth"
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm:ss"
        @update:model-value="onStringValueUpdated"
      />
      <el-input-number
        v-else-if="property.type === DomainPropertyType.Integer"
        :model-value="modelValue.integerValue ?? undefined"
        class="DomainFixturePropertyField-fullWidth"
        controls-position="right"
        @update:model-value="onIntegerValueUpdated"
      />
      <el-input
        v-else-if="property.type === DomainPropertyType.Decimal"
        :model-value="modelValue.decimalValue ?? ''"
        class="DomainFixturePropertyField-fullWidth"
        inputmode="decimal"
        @update:model-value="onDecimalValueUpdated"
      />
      <el-time-picker
        v-else-if="property.type === DomainPropertyType.Time"
        :model-value="modelValue.stringValue ?? ''"
        class="DomainFixturePropertyField-fullWidth"
        format="HH:mm:ss"
        value-format="HH:mm:ss"
        @update:model-value="onStringValueUpdated"
      />
      <el-input
        v-else-if="property.type === DomainPropertyType.Text"
        :model-value="modelValue.stringValue ?? ''"
        :autosize="{ minRows: 4 }"
        class="DomainFixturePropertyField-fullWidth"
        :maxlength="stringMaxLength"
        :show-word-limit="!!stringMaxLength"
        type="textarea"
        @update:model-value="onStringValueUpdated"
      />
      <el-input
        v-else
        :model-value="modelValue.stringValue ?? ''"
        :maxlength="stringMaxLength"
        class="DomainFixturePropertyField-fullWidth"
        :show-word-limit="!!stringMaxLength"
        @update:model-value="onStringValueUpdated"
      />
    </div>
    <div v-else-if="modelValue.enabled" class="DomainFixturePropertyField-staticValue">
      {{ displayValue }}
    </div>
    <div v-else class="DomainFixturePropertyField-nullState">
      Null
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { EditPen, RefreshRight } from '@element-plus/icons-vue'
import {
  DomainPropertyConstraintKind,
  DomainPropertyType,
  type DomainFixturePropertyValueDraft,
  type DomainProperty
} from '~/types'
import {
  regenerateDomainFixturePropertyValue
} from '~/helpers/domainFixtures'
import {
  getDomainPropertyConstraintLabel,
  getDomainPropertyTypeLabel
} from '~/helpers/domainModel'

const props = defineProps<{
  canWrite: boolean,
  modelValue: DomainFixturePropertyValueDraft,
  property: DomainProperty
}>()

const emit = defineEmits<{
  'set-title': [value: string],
  'update:modelValue': [value: DomainFixturePropertyValueDraft]
}>()

const propertyTypeLabel = computed(() => getDomainPropertyTypeLabel(props.property.type))
const stringMaxLength = computed(() =>
  props.property.constraints.find(constraint => constraint.kind === DomainPropertyConstraintKind.MaxLength)?.integerValue
)
const titleValue = computed(() => normalizeTitleValue(props.modelValue.stringValue ?? ''))
const canSetAsTitle = computed(() =>
  props.canWrite &&
  props.modelValue.enabled &&
  [DomainPropertyType.String, DomainPropertyType.Text].includes(props.property.type) &&
  titleValue.value.length > 0
)
const displayValue = computed(() => {
  switch (props.property.type) {
    case DomainPropertyType.Boolean:
      return props.modelValue.booleanValue ? 'True' : 'False'
    case DomainPropertyType.Integer:
      return props.modelValue.integerValue?.toString() ?? '0'
    case DomainPropertyType.Decimal:
      return props.modelValue.decimalValue ?? ''
    default:
      return props.modelValue.stringValue?.length ? props.modelValue.stringValue : 'Empty value'
  }
})
const constraintLabels = computed(() => props.property.constraints.map((constraint) => {
  const baseLabel = getDomainPropertyConstraintLabel(constraint.kind)

  switch (constraint.kind) {
    case DomainPropertyConstraintKind.Format:
      return constraint.format ? `${baseLabel}: ${constraint.format}` : baseLabel
    case DomainPropertyConstraintKind.Max:
    case DomainPropertyConstraintKind.Min:
      return `${baseLabel}: ${constraint.decimalValue ?? constraint.integerValue ?? constraint.stringValue ?? ''}`.trim()
    case DomainPropertyConstraintKind.MaxLength:
    case DomainPropertyConstraintKind.MinLength:
    case DomainPropertyConstraintKind.Precision:
    case DomainPropertyConstraintKind.Scale:
      return `${baseLabel}: ${constraint.integerValue ?? ''}`.trim()
    case DomainPropertyConstraintKind.Pattern:
      return `${baseLabel}: ${constraint.stringValue ?? ''}`.trim()
  }
}))

const onEnabledUpdated = (enabled: boolean) => {
  const nextValue = clonePropertyValue(props.modelValue)

  nextValue.enabled = enabled

  if (enabled) {
    Object.assign(nextValue, regenerateDomainFixturePropertyValue(nextValue, props.property))
  } else {
    clearTypedValues(nextValue)
  }

  emit('update:modelValue', nextValue)
}

const onRegenerateClicked = () => {
  emit('update:modelValue', regenerateDomainFixturePropertyValue(props.modelValue, props.property))
}

const onSetAsTitleClicked = () => {
  if (titleValue.value.length > 0) {
    emit('set-title', titleValue.value)
  }
}

const onBooleanValueUpdated = (value: boolean) => updateValue((nextValue) => {
  nextValue.booleanValue = value
})

const onDecimalValueUpdated = (value: string) => updateValue((nextValue) => {
  nextValue.decimalValue = value
})

const onIntegerValueUpdated = (value?: number) => updateValue((nextValue) => {
  nextValue.integerValue = value ?? null
})

const onStringValueUpdated = (value?: string | null) => updateValue((nextValue) => {
  nextValue.stringValue = value ?? ''
})

const updateValue = (updater: (nextValue: DomainFixturePropertyValueDraft) => void) => {
  const nextValue = clonePropertyValue(props.modelValue)

  nextValue.enabled = true
  clearTypedValues(nextValue)
  updater(nextValue)
  emit('update:modelValue', nextValue)
}

const clonePropertyValue = (propertyValue: DomainFixturePropertyValueDraft): DomainFixturePropertyValueDraft => ({
  id: propertyValue.id ?? null,
  property: {
    id: propertyValue.property.id
  },
  enabled: propertyValue.enabled,
  stringValue: propertyValue.stringValue ?? null,
  integerValue: propertyValue.integerValue ?? null,
  decimalValue: propertyValue.decimalValue ?? null,
  booleanValue: propertyValue.booleanValue ?? null
})

const clearTypedValues = (propertyValue: DomainFixturePropertyValueDraft) => {
  propertyValue.stringValue = null
  propertyValue.integerValue = null
  propertyValue.decimalValue = null
  propertyValue.booleanValue = null
}

const normalizeTitleValue = (value: string): string => value.trim().replace(/\s+/g, ' ')
</script>

<style scoped>
.DomainFixturePropertyField-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.DomainFixturePropertyField-buttonLabel {
  margin-left: 0.5rem;
}

.DomainFixturePropertyField-card {
  height: 100%;
}

.DomainFixturePropertyField-constraints {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.DomainFixturePropertyField-description {
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  margin: 0 0 1rem;
  white-space: pre-line;
}

.DomainFixturePropertyField-fullWidth {
  width: 100%;
}

.DomainFixturePropertyField-header {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.DomainFixturePropertyField-heading {
  min-width: 0;
}

.DomainFixturePropertyField-input {
  align-items: center;
  display: flex;
  min-height: 2.5rem;
}

.DomainFixturePropertyField-meta {
  color: var(--el-text-color-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.35rem;
}

.DomainFixturePropertyField-nullState {
  color: var(--el-text-color-secondary);
  min-height: 2.5rem;
}

.DomainFixturePropertyField-staticValue {
  min-height: 2.5rem;
  white-space: pre-line;
}

.DomainFixturePropertyField-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 767px) {
  .DomainFixturePropertyField-header {
    flex-direction: column;
  }
}
</style>
