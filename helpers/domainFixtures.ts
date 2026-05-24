import { faker } from '@faker-js/faker'

import {
  DomainAssociationCardinality,
  DomainPropertyConstraintKind,
  DomainPropertyStringFormat,
  DomainPropertyType,
  type CreateDomainFixtureRequest,
  type DomainAssociation,
  type DomainEntity,
  type DomainFixture,
  type DomainFixtureAssociationValue,
  type DomainFixtureAssociationValueRequest,
  type DomainFixtureDraft,
  type DomainFixtureList,
  type DomainFixturePropertyValueDraft,
  type DomainFixturePropertyValueRequest,
  type DomainProperty,
  type DomainPropertyConstraint,
  type UpdateDomainFixtureRequest
} from '~/types'

type DomainFixtureValueSlot = 'booleanValue' | 'decimalValue' | 'integerValue' | 'stringValue'

const createEmptyDomainFixtureDraft = (
  projectId: string,
  projectDomainModel: DomainEntity[],
  projectFixtures: DomainFixtureList,
  entityId?: string
): DomainFixtureDraft => {
  const selectedEntity = getDomainEntityById(projectDomainModel, entityId)

  return normalizeDomainFixtureDraft(
    {
      id: null,
      name: selectedEntity ? createSuggestedDomainFixtureName(selectedEntity, projectFixtures) : '',
      project: {
        id: projectId
      },
      entity: {
        id: selectedEntity?.id ?? entityId ?? ''
      },
      propertyValues: [],
      associationValues: []
    },
    projectDomainModel,
    projectFixtures,
    true
  )
}

const createDomainFixtureDraft = (
  fixture: DomainFixture,
  projectId: string,
  projectDomainModel: DomainEntity[],
  projectFixtures: DomainFixtureList
): DomainFixtureDraft => normalizeDomainFixtureDraft(
  {
    id: fixture.id ?? null,
    name: fixture.name,
    project: {
      id: projectId
    },
    entity: {
      id: fixture.entity.id
    },
    propertyValues: fixture.propertyValues.map(propertyValue => ({
      id: propertyValue.id ?? null,
      property: {
        id: propertyValue.property.id
      },
      enabled: true,
      stringValue: propertyValue.stringValue ?? null,
      integerValue: propertyValue.integerValue ?? null,
      decimalValue: propertyValue.decimalValue ?? null,
      booleanValue: propertyValue.booleanValue ?? null
    })),
    associationValues: fixture.associationValues.map(cloneDomainFixtureAssociationValue)
  },
  projectDomainModel,
  projectFixtures,
  false
)

const normalizeDomainFixtureDraft = (
  draft: DomainFixtureDraft,
  projectDomainModel: DomainEntity[],
  projectFixtures: DomainFixtureList,
  suggestMissingValues: boolean
): DomainFixtureDraft => {
  const selectedEntity = getDomainEntityById(projectDomainModel, draft.entity.id)
  const propertyValuesById = new Map(
    (draft.propertyValues ?? [])
      .filter((propertyValue): propertyValue is DomainFixturePropertyValueDraft => !!propertyValue.property?.id)
      .map(propertyValue => [propertyValue.property.id, propertyValue])
  )
  const allowedAssociationIds = new Set((selectedEntity?.associations ?? []).map(association => association.id).filter(Boolean))

  return {
    id: draft.id ?? null,
    name: draft.name ?? '',
    project: {
      id: draft.project.id
    },
    entity: {
      id: selectedEntity?.id ?? draft.entity.id ?? ''
    },
    propertyValues: (selectedEntity?.properties ?? []).map(property =>
      normalizeDomainFixturePropertyValueDraft(property, propertyValuesById.get(property.id ?? ''), suggestMissingValues)
    ),
    associationValues: (draft.associationValues ?? [])
      .filter(associationValue => !!associationValue.association?.id && allowedAssociationIds.has(associationValue.association.id))
      .map(cloneDomainFixtureAssociationValue)
  }
}

const regenerateDomainFixturePropertyValue = (
  propertyValue: DomainFixturePropertyValueDraft,
  property: DomainProperty
): DomainFixturePropertyValueDraft => {
  const suggestedValue = createSuggestedDomainFixturePropertyValue(property)

  return {
    ...createEmptyDraftPropertyValue(property),
    id: propertyValue.id ?? null,
    enabled: propertyValue.enabled,
    ...suggestedValue
  }
}

const toCreateDomainFixtureRequest = (
  domainFixture: DomainFixtureDraft,
  projectDomainModel: DomainEntity[]
): CreateDomainFixtureRequest => {
  const selectedEntity = getDomainEntityById(projectDomainModel, domainFixture.entity.id)

  if (!selectedEntity?.id) {
    throw new Error('A fixture entity is required.')
  }

  return {
    name: domainFixture.name,
    project: {
      id: domainFixture.project.id
    },
    entity: {
      id: selectedEntity.id
    },
    propertyValues: buildDomainFixturePropertyValueRequests(domainFixture, selectedEntity),
    associationValues: buildDomainFixtureAssociationValueRequests(domainFixture, selectedEntity)
  }
}

const toUpdateDomainFixtureRequest = (
  domainFixture: DomainFixtureDraft,
  projectDomainModel: DomainEntity[]
): UpdateDomainFixtureRequest => {
  if (!domainFixture.id) {
    throw new Error('Cannot update a fixture without an id.')
  }

  const selectedEntity = getDomainEntityById(projectDomainModel, domainFixture.entity.id)

  if (!selectedEntity?.id) {
    throw new Error('A fixture entity is required.')
  }

  return {
    ...toCreateDomainFixtureRequest(domainFixture, projectDomainModel),
    id: domainFixture.id
  }
}

const validateDomainFixture = (
  domainFixture: DomainFixtureDraft,
  projectDomainModel: DomainEntity[],
  projectFixtures: DomainFixtureList
): string[] => {
  const errors = [] as string[]
  const selectedEntity = getDomainEntityById(projectDomainModel, domainFixture.entity.id)
  const fixtureName = domainFixture.name.trim()

  if (!selectedEntity) {
    errors.push('Entity is required.')
    return errors
  }

  if (fixtureName.length === 0) {
    errors.push('Fixture name is required.')
  }

  const duplicateFixture = projectFixtures.find(fixture =>
    fixture.id !== domainFixture.id &&
    fixture.entity.id === selectedEntity.id &&
    fixture.name.trim().toLocaleLowerCase() === fixtureName.toLocaleLowerCase()
  )

  if (fixtureName.length > 0 && duplicateFixture) {
    errors.push(`Another "${selectedEntity.name}" fixture already uses the name "${fixtureName}".`)
  }

  const propertyValuesById = new Map(
    domainFixture.propertyValues
      .filter((propertyValue): propertyValue is DomainFixturePropertyValueDraft => !!propertyValue.property?.id)
      .map(propertyValue => [propertyValue.property.id, propertyValue])
  )

  selectedEntity.properties.forEach((property, index) => {
    const propertyValue = propertyValuesById.get(property.id ?? '')
    const propertyLabel = getDomainFixturePropertyLabel(property, index)

    validateDomainFixturePropertyValue(property, propertyValue, propertyLabel, errors)
  })

  const associationsById = new Map(
    selectedEntity.associations
      .filter((association): association is DomainAssociation & { id: string } => !!association.id)
      .map(association => [association.id, association])
  )
  const projectFixturesById = new Map(
    projectFixtures
      .filter((fixture): fixture is DomainFixture & { id: string } => !!fixture.id)
      .map(fixture => [fixture.id, fixture])
  )
  const associationCounts = new Map<string, number>()
  const associationTargetKeys = new Set<string>()
  const reverseCounts = buildReverseAssociationCounts(projectFixtures, domainFixture.id)

  domainFixture.associationValues.forEach((associationValue, index) => {
    const association = associationsById.get(associationValue.association.id)
    const label = getDomainFixtureAssociationLabel(associationValue, index, association)

    if (!association?.id) {
      errors.push(`${label} is not defined on the selected entity.`)
      return
    }

    const targetFixtureId = associationValue.targetFixture?.id
    const targetFixture = targetFixtureId ? projectFixturesById.get(targetFixtureId) : null

    if (!targetFixtureId || !targetFixture) {
      errors.push(`${label} must target an existing fixture.`)
      return
    }

    if (targetFixture.entity.id !== association.targetEntity?.id) {
      errors.push(`${label} can only target fixtures of "${association.targetEntity?.name ?? 'the expected entity'}".`)
      return
    }

    const associationTargetKey = `${association.id}:${targetFixture.id}`

    if (associationTargetKeys.has(associationTargetKey)) {
      errors.push(`${label} can only link the same target fixture once.`)
      return
    }

    associationTargetKeys.add(associationTargetKey)
    associationCounts.set(association.id, (associationCounts.get(association.id) ?? 0) + 1)

    if ([DomainAssociationCardinality.One, DomainAssociationCardinality.EventuallyOne].includes(association.targetCardinality)) {
      const reverseCountKey = `${association.id}:${targetFixture.id}`
      const totalReverseCount = (reverseCounts.get(reverseCountKey) ?? 0) + 1

      if (totalReverseCount > 1) {
        errors.push(
          `The "${association.sourceName}" association cannot link more than one source fixture to "${targetFixture.name}".`
        )
      }
    }
  })

  selectedEntity.associations.forEach((association, index) => {
    const associationId = association.id
    const associationLabel = association.sourceName.trim().length > 0
      ? `Association "${association.sourceName}"`
      : `Association ${index + 1}`
    const count = associationId ? (associationCounts.get(associationId) ?? 0) : 0

    switch (association.sourceCardinality) {
      case DomainAssociationCardinality.One:
        if (count !== 1) {
          errors.push(`${associationLabel} requires exactly one target fixture.`)
        }
        break
      case DomainAssociationCardinality.EventuallyOne:
        if (count > 1) {
          errors.push(`${associationLabel} can target at most one fixture.`)
        }
        break
      case DomainAssociationCardinality.Many:
        break
    }
  })

  return errors
}

const createSuggestedDomainFixtureName = (
  entity: DomainEntity,
  projectFixtures: DomainFixtureList,
  currentFixtureId?: string | null
): string => {
  const baseName = `Sample ${entity.name}`
  const normalizedNames = new Set(
    projectFixtures
      .filter(fixture => fixture.id !== currentFixtureId && fixture.entity.id === entity.id)
      .map(fixture => fixture.name.trim().toLocaleLowerCase())
  )

  if (!normalizedNames.has(baseName.toLocaleLowerCase())) {
    return baseName
  }

  let counter = 2

  while (normalizedNames.has(`${baseName} ${counter}`.toLocaleLowerCase())) {
    counter += 1
  }

  return `${baseName} ${counter}`
}

const getDomainEntityById = (
  projectDomainModel: DomainEntity[],
  entityId?: string | null
): DomainEntity | null => projectDomainModel.find(entity => entity.id === entityId) ?? null

const buildDomainFixturePropertyValueRequests = (
  domainFixture: DomainFixtureDraft,
  entity: DomainEntity
): DomainFixturePropertyValueRequest[] => {
  const propertyValuesById = new Map(
    domainFixture.propertyValues
      .filter((propertyValue): propertyValue is DomainFixturePropertyValueDraft => !!propertyValue.property?.id)
      .map(propertyValue => [propertyValue.property.id, propertyValue])
  )

  return entity.properties
    .map(property => {
      const propertyValue = propertyValuesById.get(property.id ?? '')

      if (!propertyValue?.enabled) {
        return null
      }

      return {
        id: propertyValue.id ?? null,
        property: {
          id: property.id as string
        },
        ...extractTypedRequestValue(propertyValue, property.type)
      }
    })
    .filter((propertyValue): propertyValue is DomainFixturePropertyValueRequest => propertyValue !== null)
}

const buildDomainFixtureAssociationValueRequests = (
  domainFixture: DomainFixtureDraft,
  entity: DomainEntity
): DomainFixtureAssociationValueRequest[] => {
  const allowedAssociationIds = new Set(entity.associations.map(association => association.id).filter(Boolean))

  return domainFixture.associationValues
    .filter(associationValue =>
      !!associationValue.association?.id &&
      allowedAssociationIds.has(associationValue.association.id) &&
      !!associationValue.targetFixture?.id
    )
    .map(associationValue => ({
      id: associationValue.id ?? null,
      association: {
        id: associationValue.association.id
      },
      targetFixture: {
        id: associationValue.targetFixture.id
      }
    }))
}

const normalizeDomainFixturePropertyValueDraft = (
  property: DomainProperty,
  existingValue?: DomainFixturePropertyValueDraft,
  suggestMissingValues = false
): DomainFixturePropertyValueDraft => {
  const normalizedValue = createEmptyDraftPropertyValue(property)

  if (existingValue) {
    normalizedValue.id = existingValue.id ?? null
    normalizedValue.enabled = existingValue.enabled
    applyTypedDraftValue(normalizedValue, property.type, existingValue)
  } else {
    normalizedValue.enabled = !property.nullable
  }

  if (normalizedValue.enabled && isDraftPropertyValueMissing(normalizedValue, property.type) && suggestMissingValues) {
    Object.assign(normalizedValue, createSuggestedDomainFixturePropertyValue(property))
  }

  if (!normalizedValue.enabled) {
    clearDraftPropertyValue(normalizedValue)
  }

  return normalizedValue
}

const createEmptyDraftPropertyValue = (property: DomainProperty): DomainFixturePropertyValueDraft => ({
  id: null,
  property: {
    id: property.id as string
  },
  enabled: false,
  stringValue: null,
  integerValue: null,
  decimalValue: null,
  booleanValue: null
})

const clearDraftPropertyValue = (propertyValue: DomainFixturePropertyValueDraft) => {
  propertyValue.stringValue = null
  propertyValue.integerValue = null
  propertyValue.decimalValue = null
  propertyValue.booleanValue = null
}

const applyTypedDraftValue = (
  propertyValue: DomainFixturePropertyValueDraft,
  propertyType: DomainPropertyType,
  sourceValue: Partial<DomainFixturePropertyValueDraft>
) => {
  clearDraftPropertyValue(propertyValue)

  switch (getValueSlot(propertyType)) {
    case 'booleanValue':
      propertyValue.booleanValue = sourceValue.booleanValue ?? false
      break
    case 'decimalValue':
      propertyValue.decimalValue = sourceValue.decimalValue ?? null
      break
    case 'integerValue':
      propertyValue.integerValue = sourceValue.integerValue ?? null
      break
    case 'stringValue':
      propertyValue.stringValue = normalizeDraftStringValue(propertyType, sourceValue.stringValue ?? null)
      break
  }
}

const extractTypedRequestValue = (
  propertyValue: DomainFixturePropertyValueDraft,
  propertyType: DomainPropertyType
): Pick<DomainFixturePropertyValueRequest, DomainFixtureValueSlot> => {
  switch (getValueSlot(propertyType)) {
    case 'booleanValue':
      return {
        booleanValue: propertyValue.booleanValue ?? null
      }
    case 'decimalValue':
      return {
        decimalValue: propertyValue.decimalValue ?? null
      }
    case 'integerValue':
      return {
        integerValue: propertyValue.integerValue ?? null
      }
    case 'stringValue':
      return {
        stringValue: propertyValue.stringValue ?? null
      }
  }
}

const createSuggestedDomainFixturePropertyValue = (
  property: DomainProperty
): Pick<DomainFixturePropertyValueDraft, DomainFixtureValueSlot> => {
  switch (property.type) {
    case DomainPropertyType.Boolean:
      return {
        booleanValue: faker.datatype.boolean()
      }
    case DomainPropertyType.Integer:
      return {
        integerValue: createSuggestedIntegerValue(property)
      }
    case DomainPropertyType.Decimal:
      return {
        decimalValue: createSuggestedDecimalValue(property)
      }
    case DomainPropertyType.Date:
      return {
        stringValue: createSuggestedDateValue(property)
      }
    case DomainPropertyType.Datetime:
      return {
        stringValue: createSuggestedDatetimeValue(property)
      }
    case DomainPropertyType.Time:
      return {
        stringValue: createSuggestedTimeValue(property)
      }
    case DomainPropertyType.UUID:
      return {
        stringValue: faker.string.uuid()
      }
    case DomainPropertyType.String:
    case DomainPropertyType.Text:
      return {
        stringValue: createSuggestedStringValue(property)
      }
  }
}

const createSuggestedIntegerValue = (property: DomainProperty): number => {
  const min = getIntegerConstraintValue(property, DomainPropertyConstraintKind.Min) ?? 0
  const max = getIntegerConstraintValue(property, DomainPropertyConstraintKind.Max) ?? Math.max(min + 25, 100)
  const lowerBound = Math.min(min, max)
  const upperBound = Math.max(min, max)

  return faker.number.int({
    min: lowerBound,
    max: upperBound
  })
}

const createSuggestedDecimalValue = (property: DomainProperty): string => {
  const minConstraint = getDecimalConstraintValue(property, DomainPropertyConstraintKind.Min)
  const maxConstraint = getDecimalConstraintValue(property, DomainPropertyConstraintKind.Max)
  const scale = getIntegerConstraintValue(property, DomainPropertyConstraintKind.Scale) ?? 2
  const precision = getIntegerConstraintValue(property, DomainPropertyConstraintKind.Precision)
  let lowerBound = Math.min(minConstraint ?? 0, maxConstraint ?? Math.max((minConstraint ?? 0) + 25, 100))
  let upperBound = Math.max(minConstraint ?? 0, maxConstraint ?? Math.max((minConstraint ?? 0) + 25, 100))

  if (precision !== undefined) {
    const maxIntegerDigits = Math.max(precision - scale, 0)
    const maxAbsoluteValue = maxIntegerDigits === 0
      ? (1 - 1 / Math.pow(10, scale))
      : Math.pow(10, maxIntegerDigits) - 1 / Math.pow(10, scale)

    lowerBound = Math.max(lowerBound, -maxAbsoluteValue)
    upperBound = Math.min(upperBound, maxAbsoluteValue)
  }

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidate = createRandomDecimalCandidate(lowerBound, upperBound, scale)

    if (isValidDecimalPrecision(candidate, precision) && isValidDecimalScale(candidate, scale)) {
      return candidate
    }
  }

  return createRandomDecimalCandidate(lowerBound, upperBound, scale)
}

const createSuggestedDateValue = (property: DomainProperty): string => {
  const min = getStringConstraintValue(property, DomainPropertyConstraintKind.Min)
  const max = getStringConstraintValue(property, DomainPropertyConstraintKind.Max)
  const from = parseDateBoundary(min) ?? new Date(Date.UTC(2020, 0, 1))
  const to = parseDateBoundary(max) ?? new Date(Date.UTC(2030, 11, 31))
  const candidate = randomDateBetween(from, to)

  return candidate.toISOString().slice(0, 10)
}

const createSuggestedDatetimeValue = (property: DomainProperty): string => {
  const min = parseDateTimeBoundary(getStringConstraintValue(property, DomainPropertyConstraintKind.Min)) ?? new Date('2020-01-01T00:00:00Z')
  const max = parseDateTimeBoundary(getStringConstraintValue(property, DomainPropertyConstraintKind.Max)) ?? new Date('2030-12-31T23:59:59Z')
  const candidate = randomDateBetween(min, max)

  return formatDateTimeForInput(candidate)
}

const createSuggestedTimeValue = (property: DomainProperty): string => {
  const min = parseTimeBoundary(getStringConstraintValue(property, DomainPropertyConstraintKind.Min)) ?? 0
  const max = parseTimeBoundary(getStringConstraintValue(property, DomainPropertyConstraintKind.Max)) ?? 86399
  const seconds = faker.number.int({
    min: Math.min(min, max),
    max: Math.max(min, max)
  })

  return formatSecondsAsTime(seconds)
}

const createSuggestedStringValue = (property: DomainProperty): string => {
  const minLength = getIntegerConstraintValue(property, DomainPropertyConstraintKind.MinLength)
  const maxLength = getIntegerConstraintValue(property, DomainPropertyConstraintKind.MaxLength)
  const patternConstraint = getStringConstraintValue(property, DomainPropertyConstraintKind.Pattern)
  const formatConstraint = getFormatConstraintValue(property)
  const formatCandidates = [
    formatConstraint
  ].filter((format): format is DomainPropertyStringFormat => !!format)
  const regex = patternConstraint ? createRegExp(patternConstraint) : null

  if (!formatConstraint && !patternConstraint && minLength === undefined && maxLength === undefined) {
    return ''
  }

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidate = createBaseStringCandidate(property, formatCandidates, regex, minLength, maxLength, attempt)

    if (validateStringCandidate(property, candidate)) {
      return candidate
    }
  }

  return createFallbackStringCandidate(minLength, maxLength)
}

const createBaseStringCandidate = (
  property: DomainProperty,
  formats: DomainPropertyStringFormat[],
  regex: RegExp | null,
  minLength?: number,
  maxLength?: number,
  attempt = 0
): string => {
  if (regex && attempt < 40) {
    try {
      return faker.helpers.fromRegExp(regex)
    } catch (_error) {
    }
  }

  for (const format of formats) {
    const candidate = createFormattedStringCandidate(format, minLength, maxLength)

    if (candidate !== null) {
      return candidate
    }
  }

  const lowerBound = minLength ?? 1
  const upperBound = maxLength ?? Math.max(lowerBound, property.type === DomainPropertyType.Text ? 160 : 32)
  const targetLength = faker.number.int({
    min: Math.max(lowerBound, 1),
    max: Math.max(Math.max(lowerBound, 1), upperBound)
  })
  const baseWord = property.type === DomainPropertyType.Text
    ? faker.lorem.sentence()
    : faker.lorem.words({ min: 1, max: 3 })

  return fitStringLength(baseWord, targetLength, upperBound)
}

const createFormattedStringCandidate = (
  format: DomainPropertyStringFormat,
  minLength?: number,
  maxLength?: number
): string | null => {
  switch (format) {
    case DomainPropertyStringFormat.CountryCode:
      return minLength !== undefined && minLength > 2 || maxLength !== undefined && maxLength < 2
        ? null
        : faker.helpers.arrayElement(['FR', 'US', 'DE', 'ES', 'GB', 'IT'])
    case DomainPropertyStringFormat.Email: {
      const minimumLength = Math.max(minLength ?? 6, 6)
      const maximumLength = Math.max(maxLength ?? minimumLength, minimumLength)
      const domain = 'a.co'
      const minimumLocalLength = Math.max(1, minimumLength - domain.length - 1)
      const maximumLocalLength = Math.max(1, maximumLength - domain.length - 1)

      if (maximumLocalLength < minimumLocalLength) {
        return null
      }

      const localLength = faker.number.int({
        min: minimumLocalLength,
        max: maximumLocalLength
      })

      return `${faker.string.alphanumeric(localLength).toLowerCase()}@${domain}`
    }
    case DomainPropertyStringFormat.Ipv4:
      return faker.internet.ipv4()
    case DomainPropertyStringFormat.Ipv6:
      return faker.internet.ipv6()
    case DomainPropertyStringFormat.Phone: {
      const desiredLength = clampLength(minLength ?? 10, maxLength ?? 18, 6, 30)
      const digits = faker.string.numeric(Math.max(desiredLength - 1, 5))

      return `+${digits}`.slice(0, Math.max(maxLength ?? desiredLength, 6))
    }
    case DomainPropertyStringFormat.Slug: {
      const lowerBound = Math.max(minLength ?? 3, 3)
      const upperBound = Math.max(maxLength ?? lowerBound, lowerBound)
      const words = faker.lorem.words({ min: 1, max: 4 }).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')
      const slug = words.trim().replace(/\s+/g, '-').replace(/-+/g, '-')

      return fitSlugLength(slug.length > 0 ? slug : 'sample', lowerBound, upperBound)
    }
    case DomainPropertyStringFormat.Uri:
    case DomainPropertyStringFormat.Url: {
      const minimumLength = Math.max(minLength ?? 12, 12)
      const maximumLength = Math.max(maxLength ?? minimumLength, minimumLength)
      const baseUrl = 'https://a.co'

      if (maximumLength < baseUrl.length) {
        return null
      }

      const remainingLength = Math.max(minimumLength - baseUrl.length, 0)
      const path = remainingLength > 0 ? `/${faker.string.alphanumeric(remainingLength - 1).toLowerCase()}` : ''
      const candidate = `${baseUrl}${path}`

      return candidate.length <= maximumLength ? candidate : null
    }
    case DomainPropertyStringFormat.UUID:
      return minLength !== undefined && minLength > 36 || maxLength !== undefined && maxLength < 36
        ? null
        : faker.string.uuid()
  }
}

const fitStringLength = (value: string, minLength: number, maxLength: number): string => {
  let candidate = value

  while (candidate.length < minLength) {
    candidate += ` ${faker.lorem.word()}`
  }

  if (candidate.length > maxLength) {
    candidate = candidate.slice(0, maxLength)
  }

  return candidate
}

const fitSlugLength = (value: string, minLength: number, maxLength: number): string => {
  let candidate = value

  while (candidate.length < minLength) {
    candidate = `${candidate}-${faker.lorem.word().toLowerCase().replace(/[^a-z0-9]/g, '') || 'item'}`
  }

  candidate = candidate.slice(0, maxLength).replace(/^-+|-+$/g, '')

  return candidate.length > 0 ? candidate : 'sample'
}

const createFallbackStringCandidate = (minLength?: number, maxLength?: number): string => {
  const lowerBound = Math.max(minLength ?? 1, 1)
  const upperBound = Math.max(maxLength ?? lowerBound, lowerBound)

  return fitStringLength(faker.lorem.words({ min: 1, max: 3 }), lowerBound, upperBound)
}

const validateDomainFixturePropertyValue = (
  property: DomainProperty,
  propertyValue: DomainFixturePropertyValueDraft | undefined,
  propertyLabel: string,
  errors: string[]
) => {
  if (!propertyValue?.enabled) {
    if (!property.nullable) {
      errors.push(`${propertyLabel} requires a value.`)
    }

    return
  }

  switch (getValueSlot(property.type)) {
    case 'booleanValue':
      if (propertyValue.booleanValue === null || propertyValue.booleanValue === undefined) {
        errors.push(`${propertyLabel} expects a boolean value.`)
        return
      }
      break
    case 'decimalValue':
      if (!isValidDecimal(propertyValue.decimalValue)) {
        errors.push(`${propertyLabel} must contain a valid decimal value.`)
        return
      }
      break
    case 'integerValue':
      if (!Number.isInteger(propertyValue.integerValue)) {
        errors.push(`${propertyLabel} must contain a valid integer value.`)
        return
      }
      break
    case 'stringValue':
      if (propertyValue.stringValue === null || propertyValue.stringValue === undefined) {
        errors.push(`${propertyLabel} expects a ${getReadablePropertyType(property.type)} value.`)
        return
      }
      break
  }

  validateTypedPropertyValue(property, propertyValue, propertyLabel, errors)

  property.constraints.forEach((constraint) => {
    validateDomainFixturePropertyConstraint(constraint, property, propertyValue, propertyLabel, errors)
  })
}

const validateTypedPropertyValue = (
  property: DomainProperty,
  propertyValue: DomainFixturePropertyValueDraft,
  propertyLabel: string,
  errors: string[]
) => {
  switch (property.type) {
    case DomainPropertyType.Date:
      if (!isExactDate(propertyValue.stringValue ?? '')) {
        errors.push(`${propertyLabel} must contain a valid date formatted as YYYY-MM-DD.`)
      }
      break
    case DomainPropertyType.Datetime:
      if (!isValidDateTime(propertyValue.stringValue ?? '')) {
        errors.push(`${propertyLabel} must contain a valid datetime value.`)
      }
      break
    case DomainPropertyType.Time:
      if (!isValidTime(propertyValue.stringValue ?? '')) {
        errors.push(`${propertyLabel} must contain a valid time value.`)
      }
      break
    case DomainPropertyType.UUID:
      if (!isValidUuid(propertyValue.stringValue ?? '')) {
        errors.push(`${propertyLabel} must contain a valid UUID.`)
      }
      break
    default:
      break
  }
}

const validateDomainFixturePropertyConstraint = (
  constraint: DomainPropertyConstraint,
  property: DomainProperty,
  propertyValue: DomainFixturePropertyValueDraft,
  propertyLabel: string,
  errors: string[]
) => {
  switch (constraint.kind) {
    case DomainPropertyConstraintKind.Format:
      if (constraint.format && !matchesStringFormat(constraint.format, propertyValue.stringValue ?? '')) {
        errors.push(`${propertyLabel} must match the "${constraint.format}" format.`)
      }
      break
    case DomainPropertyConstraintKind.MinLength:
      if (constraint.integerValue !== null && constraint.integerValue !== undefined && (propertyValue.stringValue ?? '').length < constraint.integerValue) {
        errors.push(`${propertyLabel} must contain at least ${constraint.integerValue} characters.`)
      }
      break
    case DomainPropertyConstraintKind.MaxLength:
      if (constraint.integerValue !== null && constraint.integerValue !== undefined && (propertyValue.stringValue ?? '').length > constraint.integerValue) {
        errors.push(`${propertyLabel} must contain at most ${constraint.integerValue} characters.`)
      }
      break
    case DomainPropertyConstraintKind.Pattern: {
      const regex = constraint.stringValue ? createRegExp(constraint.stringValue) : null

      if (regex && !regex.test(propertyValue.stringValue ?? '')) {
        errors.push(`${propertyLabel} must match the configured pattern.`)
      }
      break
    }
    case DomainPropertyConstraintKind.Min:
      if (!matchesBoundaryConstraint(property, constraint, propertyValue, false)) {
        errors.push(`${propertyLabel} is lower than the configured minimum.`)
      }
      break
    case DomainPropertyConstraintKind.Max:
      if (!matchesBoundaryConstraint(property, constraint, propertyValue, true)) {
        errors.push(`${propertyLabel} is higher than the configured maximum.`)
      }
      break
    case DomainPropertyConstraintKind.Precision:
      if (constraint.integerValue !== null && constraint.integerValue !== undefined && !isValidDecimalPrecision(propertyValue.decimalValue ?? '', constraint.integerValue)) {
        errors.push(`${propertyLabel} must contain at most ${constraint.integerValue} digits.`)
      }
      break
    case DomainPropertyConstraintKind.Scale:
      if (constraint.integerValue !== null && constraint.integerValue !== undefined && !isValidDecimalScale(propertyValue.decimalValue ?? '', constraint.integerValue)) {
        errors.push(`${propertyLabel} must contain at most ${constraint.integerValue} decimal places.`)
      }
      break
  }
}

const validateStringCandidate = (property: DomainProperty, candidate: string): boolean => {
  const propertyValue = createEmptyDraftPropertyValue(property)

  propertyValue.enabled = true
  propertyValue.stringValue = candidate

  return validatePropertyValueSilently(property, propertyValue)
}

const validatePropertyValueSilently = (
  property: DomainProperty,
  propertyValue: DomainFixturePropertyValueDraft
): boolean => {
  const errors = [] as string[]

  validateDomainFixturePropertyValue(property, propertyValue, 'Property', errors)

  return errors.length === 0
}

const buildReverseAssociationCounts = (
  projectFixtures: DomainFixtureList,
  currentFixtureId?: string | null
): Map<string, number> => {
  const reverseCounts = new Map<string, number>()

  projectFixtures
    .filter(fixture => fixture.id !== currentFixtureId)
    .forEach((fixture) => {
      fixture.associationValues.forEach((associationValue) => {
        if (!associationValue.association?.id || !associationValue.targetFixture?.id) {
          return
        }

        const key = `${associationValue.association.id}:${associationValue.targetFixture.id}`
        reverseCounts.set(key, (reverseCounts.get(key) ?? 0) + 1)
      })
    })

  return reverseCounts
}

const cloneDomainFixtureAssociationValue = (
  associationValue: DomainFixtureAssociationValue
): DomainFixtureAssociationValue => ({
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

const getValueSlot = (propertyType: DomainPropertyType): DomainFixtureValueSlot => {
  switch (propertyType) {
    case DomainPropertyType.Boolean:
      return 'booleanValue'
    case DomainPropertyType.Decimal:
      return 'decimalValue'
    case DomainPropertyType.Integer:
      return 'integerValue'
    default:
      return 'stringValue'
  }
}

const isDraftPropertyValueMissing = (
  propertyValue: DomainFixturePropertyValueDraft,
  propertyType: DomainPropertyType
): boolean => {
  switch (getValueSlot(propertyType)) {
    case 'booleanValue':
      return propertyValue.booleanValue === null || propertyValue.booleanValue === undefined
    case 'decimalValue':
      return propertyValue.decimalValue === null || propertyValue.decimalValue === undefined
    case 'integerValue':
      return propertyValue.integerValue === null || propertyValue.integerValue === undefined
    case 'stringValue':
      return propertyValue.stringValue === null || propertyValue.stringValue === undefined
  }
}

const getDomainFixturePropertyLabel = (property: DomainProperty, index: number): string =>
  property.name.trim().length > 0 ? `Property "${property.name}"` : `Property ${index + 1}`

const getDomainFixtureAssociationLabel = (
  associationValue: DomainFixtureAssociationValue,
  index: number,
  association?: DomainAssociation | null
): string => {
  const sourceName = association?.sourceName ?? associationValue.association.sourceName

  return sourceName.trim().length > 0 ? `Association "${sourceName}"` : `Association ${index + 1}`
}

const getReadablePropertyType = (propertyType: DomainPropertyType): string => ({
  [DomainPropertyType.Boolean]: 'boolean',
  [DomainPropertyType.Date]: 'date',
  [DomainPropertyType.Datetime]: 'datetime',
  [DomainPropertyType.Decimal]: 'decimal',
  [DomainPropertyType.Integer]: 'integer',
  [DomainPropertyType.String]: 'string',
  [DomainPropertyType.Text]: 'text',
  [DomainPropertyType.Time]: 'time',
  [DomainPropertyType.UUID]: 'UUID'
}[propertyType])

const getIntegerConstraintValue = (
  property: DomainProperty,
  constraintKind: DomainPropertyConstraintKind
): number | undefined => property.constraints.find(constraint => constraint.kind === constraintKind)?.integerValue ?? undefined

const getDecimalConstraintValue = (
  property: DomainProperty,
  constraintKind: DomainPropertyConstraintKind
): number | undefined => {
  const value = property.constraints.find(constraint => constraint.kind === constraintKind)?.decimalValue

  if (!value || Number.isNaN(Number(value))) {
    return undefined
  }

  return Number(value)
}

const getStringConstraintValue = (
  property: DomainProperty,
  constraintKind: DomainPropertyConstraintKind
): string | undefined => property.constraints.find(constraint => constraint.kind === constraintKind)?.stringValue ?? undefined

const getFormatConstraintValue = (property: DomainProperty): DomainPropertyStringFormat | undefined =>
  property.constraints.find(constraint => constraint.kind === DomainPropertyConstraintKind.Format)?.format ?? undefined

const matchesBoundaryConstraint = (
  property: DomainProperty,
  constraint: DomainPropertyConstraint,
  propertyValue: DomainFixturePropertyValueDraft,
  isMax: boolean
): boolean => {
  switch (property.type) {
    case DomainPropertyType.Integer:
      return constraint.integerValue === null || constraint.integerValue === undefined || propertyValue.integerValue === null || propertyValue.integerValue === undefined
        ? true
        : isMax
          ? propertyValue.integerValue <= constraint.integerValue
          : propertyValue.integerValue >= constraint.integerValue
    case DomainPropertyType.Decimal: {
      const constraintValue = constraint.decimalValue ? Number(constraint.decimalValue) : undefined
      const currentValue = propertyValue.decimalValue ? Number(propertyValue.decimalValue) : undefined

      return constraintValue === undefined || currentValue === undefined
        ? true
        : isMax
          ? currentValue <= constraintValue
          : currentValue >= constraintValue
    }
    case DomainPropertyType.Date:
    case DomainPropertyType.Time:
      return !constraint.stringValue || propertyValue.stringValue === null || propertyValue.stringValue === undefined
        ? true
        : isMax
          ? propertyValue.stringValue <= constraint.stringValue
          : propertyValue.stringValue >= constraint.stringValue
    case DomainPropertyType.Datetime: {
      const constraintDate = parseDateTimeBoundary(constraint.stringValue ?? undefined)
      const currentDate = parseDateTimeBoundary(propertyValue.stringValue ?? undefined)

      return !constraintDate || !currentDate
        ? true
        : isMax
          ? currentDate.getTime() <= constraintDate.getTime()
          : currentDate.getTime() >= constraintDate.getTime()
    }
    default:
      return true
  }
}

const matchesStringFormat = (format: DomainPropertyStringFormat, value: string): boolean => {
  switch (format) {
    case DomainPropertyStringFormat.CountryCode:
      return /^[A-Za-z]{2}$/.test(value)
    case DomainPropertyStringFormat.Email:
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    case DomainPropertyStringFormat.Ipv4:
      return /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(value)
    case DomainPropertyStringFormat.Ipv6:
      return isValidIpv6(value)
    case DomainPropertyStringFormat.Phone:
      return /^\+?[0-9().\-\s]{6,30}$/.test(value)
    case DomainPropertyStringFormat.Slug:
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    case DomainPropertyStringFormat.Uri:
    case DomainPropertyStringFormat.Url:
      return isValidUrl(value)
    case DomainPropertyStringFormat.UUID:
      return isValidUuid(value)
  }
}

const createRegExp = (pattern: string): RegExp | null => {
  if (pattern.length === 0) {
    return null
  }

  if (pattern.startsWith('/')) {
    const lastSlashIndex = pattern.lastIndexOf('/')

    if (lastSlashIndex > 0) {
      try {
        return new RegExp(pattern.slice(1, lastSlashIndex), pattern.slice(lastSlashIndex + 1))
      } catch (_error) {
        return null
      }
    }
  }

  try {
    return new RegExp(pattern)
  } catch (_error) {
    return null
  }
}

const parseDateBoundary = (value?: string): Date | null => {
  if (!value || !isExactDate(value)) {
    return null
  }

  return new Date(`${value}T12:00:00Z`)
}

const parseDateTimeBoundary = (value?: string): Date | null => {
  if (!value) {
    return null
  }

  const parsed = new Date(value)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeDraftStringValue = (
  propertyType: DomainPropertyType,
  value?: string | null
): string | null => {
  if (value === null || value === undefined) {
    return null
  }

  switch (propertyType) {
    case DomainPropertyType.Datetime:
      return normalizeDateTimeForInput(value)
    default:
      return value
  }
}

const normalizeDateTimeForInput = (value: string): string => {
  const normalizedMatch = value.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})/)

  if (normalizedMatch) {
    return `${normalizedMatch[1]}T${normalizedMatch[2]}`
  }

  const parsed = parseDateTimeBoundary(value)

  if (!parsed) {
    return value
  }

  return formatDateTimeForInput(parsed)
}

const formatDateTimeForInput = (value: Date): string => {
  const year = value.getUTCFullYear().toString().padStart(4, '0')
  const month = (value.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = value.getUTCDate().toString().padStart(2, '0')
  const hours = value.getUTCHours().toString().padStart(2, '0')
  const minutes = value.getUTCMinutes().toString().padStart(2, '0')
  const seconds = value.getUTCSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const parseTimeBoundary = (value?: string): number | null => {
  if (!value || !isValidTime(value)) {
    return null
  }

  const [hours, minutes, seconds = '00'] = value.split(':')

  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}

const randomDateBetween = (from: Date, to: Date): Date => {
  const fromTime = from.getTime()
  const toTime = to.getTime()
  const start = Math.min(fromTime, toTime)
  const end = Math.max(fromTime, toTime)

  return new Date(start + Math.floor(Math.random() * (end - start + 1)))
}

const formatSecondsAsTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.min(seconds, 86399))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60

  return [hours, minutes, secs].map(value => value.toString().padStart(2, '0')).join(':')
}

const createRandomDecimalCandidate = (min: number, max: number, scale: number): string => {
  const lowerBound = Number.isFinite(min) ? min : 0
  const upperBound = Number.isFinite(max) ? max : Math.max(lowerBound + 25, 100)
  const start = Math.min(lowerBound, upperBound)
  const end = Math.max(lowerBound, upperBound)
  const raw = start + Math.random() * (end - start)

  return raw.toFixed(Math.max(scale, 0)).replace(/\.?0+$/, '')
}

const isValidDecimal = (value?: string | null): boolean => !!value && /^-?\d+(?:\.\d+)?$/.test(value)

const isValidDecimalPrecision = (value: string, precision?: number): boolean => {
  if (precision === undefined) {
    return true
  }

  return value.replace('-', '').replace('.', '').length <= precision
}

const isValidDecimalScale = (value: string, scale?: number): boolean => {
  if (scale === undefined) {
    return true
  }

  return (value.split('.')[1] ?? '').length <= scale
}

const isExactDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const isValidDateTime = (value: string): boolean => !Number.isNaN(Date.parse(value))

const isValidTime = (value: string): boolean => {
  const match = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/)

  if (!match) {
    return false
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? '0')

  return hours <= 23 && minutes <= 59 && seconds <= 59
}

const isValidUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const isValidUrl = (value: string): boolean => {
  try {
    new URL(value)
    return true
  } catch (_error) {
    return false
  }
}

const isValidIpv6 = (value: string): boolean => {
  if (value.length === 0 || !/^[0-9a-f:.]+$/i.test(value) || value.includes(':::')) {
    return false
  }

  const doubleColonSegments = value.split('::')

  if (doubleColonSegments.length > 2) {
    return false
  }

  const head = doubleColonSegments[0]
  const tail = doubleColonSegments[1]
  const containsDoubleColon = doubleColonSegments.length === 2
  const headParts = head.length > 0 ? head.split(':') : []
  const tailParts = tail !== undefined && tail.length > 0 ? tail.split(':') : []
  const parts = [...headParts, ...tailParts]

  if (parts.some(part => part.length === 0)) {
    return false
  }

  let groupCount = 0

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]

    if (part.includes('.')) {
      if (index !== parts.length - 1 || !/^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(part)) {
        return false
      }

      groupCount += 2
      continue
    }

    if (!/^[0-9a-f]{1,4}$/i.test(part)) {
      return false
    }

    groupCount += 1
  }

  return containsDoubleColon ? groupCount < 8 : groupCount === 8
}

const clampLength = (value: number, maxLength: number, min: number, max: number): number =>
  Math.max(min, Math.min(Math.min(value, maxLength), max))

export {
  createDomainFixtureDraft,
  createEmptyDomainFixtureDraft,
  createSuggestedDomainFixtureName,
  getDomainEntityById,
  normalizeDomainFixtureDraft,
  regenerateDomainFixturePropertyValue,
  toCreateDomainFixtureRequest,
  toUpdateDomainFixtureRequest,
  validateDomainFixture
}
