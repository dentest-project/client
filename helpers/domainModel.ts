import {
  DomainAssociationCardinality,
  DomainPropertyConstraintKind,
  DomainPropertyStringFormat,
  DomainPropertyType,
  type DomainAssociation,
  type DomainEntity,
  type DomainEntityDraft,
  type DomainEntitySummary,
  type DomainProperty,
  type DomainPropertyConstraint,
  type CreateDomainEntityRequest,
  type UpdateDomainEntityRequest
} from '~/types'

type DomainConstraintValueInput = 'date' | 'datetime' | 'decimal' | 'format' | 'integer' | 'text' | 'time'

const domainAssociationCardinalityOptions = [
  {
    label: 'One (1)',
    value: DomainAssociationCardinality.One
  },
  {
    label: 'Maybe one (0..1)',
    value: DomainAssociationCardinality.EventuallyOne
  },
  {
    label: 'Many (*)',
    value: DomainAssociationCardinality.Many
  }
]

const domainPropertyTypeOptions = [
  {
    label: 'Boolean',
    value: DomainPropertyType.Boolean
  },
  {
    label: 'Date',
    value: DomainPropertyType.Date
  },
  {
    label: 'Datetime',
    value: DomainPropertyType.Datetime
  },
  {
    label: 'Decimal',
    value: DomainPropertyType.Decimal
  },
  {
    label: 'Integer',
    value: DomainPropertyType.Integer
  },
  {
    label: 'String',
    value: DomainPropertyType.String
  },
  {
    label: 'Text',
    value: DomainPropertyType.Text
  },
  {
    label: 'Time',
    value: DomainPropertyType.Time
  },
  {
    label: 'UUID',
    value: DomainPropertyType.UUID
  }
]

const domainPropertyStringFormatOptions = [
  {
    label: 'Country code',
    value: DomainPropertyStringFormat.CountryCode
  },
  {
    label: 'Email',
    value: DomainPropertyStringFormat.Email
  },
  {
    label: 'IPv4',
    value: DomainPropertyStringFormat.Ipv4
  },
  {
    label: 'IPv6',
    value: DomainPropertyStringFormat.Ipv6
  },
  {
    label: 'Phone',
    value: DomainPropertyStringFormat.Phone
  },
  {
    label: 'Slug',
    value: DomainPropertyStringFormat.Slug
  },
  {
    label: 'URI',
    value: DomainPropertyStringFormat.Uri
  },
  {
    label: 'URL',
    value: DomainPropertyStringFormat.Url
  },
  {
    label: 'UUID',
    value: DomainPropertyStringFormat.UUID
  }
]

const allowedConstraintKindsByPropertyType = {
  [DomainPropertyType.Boolean]: [],
  [DomainPropertyType.Date]: [DomainPropertyConstraintKind.Min, DomainPropertyConstraintKind.Max],
  [DomainPropertyType.Datetime]: [DomainPropertyConstraintKind.Min, DomainPropertyConstraintKind.Max],
  [DomainPropertyType.Decimal]: [
    DomainPropertyConstraintKind.Min,
    DomainPropertyConstraintKind.Max,
    DomainPropertyConstraintKind.Precision,
    DomainPropertyConstraintKind.Scale
  ],
  [DomainPropertyType.Integer]: [DomainPropertyConstraintKind.Min, DomainPropertyConstraintKind.Max],
  [DomainPropertyType.String]: [
    DomainPropertyConstraintKind.Format,
    DomainPropertyConstraintKind.MaxLength,
    DomainPropertyConstraintKind.MinLength,
    DomainPropertyConstraintKind.Pattern
  ],
  [DomainPropertyType.Text]: [
    DomainPropertyConstraintKind.Format,
    DomainPropertyConstraintKind.MaxLength,
    DomainPropertyConstraintKind.MinLength,
    DomainPropertyConstraintKind.Pattern
  ],
  [DomainPropertyType.Time]: [DomainPropertyConstraintKind.Min, DomainPropertyConstraintKind.Max],
  [DomainPropertyType.UUID]: []
} satisfies Record<DomainPropertyType, DomainPropertyConstraintKind[]>

const createEmptyDomainEntityDraft = (projectId: string): DomainEntityDraft => ({
  name: '',
  description: '',
  project: {
    id: projectId
  },
  properties: [],
  associations: [],
  targetAssociations: []
})

const createEmptyDomainProperty = (): DomainProperty => ({
  name: '',
  description: '',
  position: 0,
  type: DomainPropertyType.String,
  nullable: false,
  constraints: []
})

const createEmptyDomainAssociation = (): DomainAssociation => ({
  sourceName: '',
  sourceCardinality: DomainAssociationCardinality.One,
  sourcePosition: 0,
  targetName: '',
  targetCardinality: DomainAssociationCardinality.Many,
  targetPosition: 0,
  description: '',
  sourceEntity: null,
  targetEntity: null
})

const createEmptyDomainPropertyConstraint = (propertyType: DomainPropertyType): DomainPropertyConstraint => {
  const allowedKinds = getAllowedConstraintKinds(propertyType)
  const firstKind = allowedKinds[0]!

  return normalizeDomainPropertyConstraint(
    {
      kind: firstKind,
      stringValue: null,
      integerValue: null,
      decimalValue: null,
      format: null
    },
    propertyType
  )
}

const getAllowedConstraintKinds = (propertyType: DomainPropertyType): DomainPropertyConstraintKind[] =>
  allowedConstraintKindsByPropertyType[propertyType]

const getDomainPropertyTypeLabel = (propertyType: DomainPropertyType): string =>
  domainPropertyTypeOptions.find(option => option.value === propertyType)?.label ?? propertyType

const getDomainAssociationCardinalityLabel = (cardinality: DomainAssociationCardinality): string =>
  domainAssociationCardinalityOptions.find(option => option.value === cardinality)?.label ?? cardinality

const getDomainPropertyConstraintLabel = (constraintKind: DomainPropertyConstraintKind): string => ({
  [DomainPropertyConstraintKind.Format]: 'Format',
  [DomainPropertyConstraintKind.Max]: 'Max',
  [DomainPropertyConstraintKind.MaxLength]: 'Max length',
  [DomainPropertyConstraintKind.Min]: 'Min',
  [DomainPropertyConstraintKind.MinLength]: 'Min length',
  [DomainPropertyConstraintKind.Pattern]: 'Pattern',
  [DomainPropertyConstraintKind.Precision]: 'Precision',
  [DomainPropertyConstraintKind.Scale]: 'Scale'
}[constraintKind])

const getDomainConstraintValueInput = (
  propertyType: DomainPropertyType,
  constraintKind: DomainPropertyConstraintKind
): DomainConstraintValueInput | null => {
  switch (constraintKind) {
    case DomainPropertyConstraintKind.Format:
      return 'format'
    case DomainPropertyConstraintKind.MaxLength:
    case DomainPropertyConstraintKind.MinLength:
    case DomainPropertyConstraintKind.Precision:
    case DomainPropertyConstraintKind.Scale:
      return 'integer'
    case DomainPropertyConstraintKind.Pattern:
      return 'text'
    case DomainPropertyConstraintKind.Min:
    case DomainPropertyConstraintKind.Max:
      switch (propertyType) {
        case DomainPropertyType.Date:
          return 'date'
        case DomainPropertyType.Datetime:
          return 'datetime'
        case DomainPropertyType.Decimal:
          return 'decimal'
        case DomainPropertyType.Integer:
          return 'integer'
        case DomainPropertyType.Time:
          return 'time'
        default:
          return null
      }
    default:
      return null
  }
}

const normalizeDomainPropertyConstraint = (
  propertyConstraint: Partial<DomainPropertyConstraint>,
  propertyType: DomainPropertyType
): DomainPropertyConstraint => {
  const allowedKinds = getAllowedConstraintKinds(propertyType)
  const constraintKind = propertyConstraint.kind && allowedKinds.includes(propertyConstraint.kind)
    ? propertyConstraint.kind
    : allowedKinds[0]!
  const valueInput = constraintKind ? getDomainConstraintValueInput(propertyType, constraintKind) : null

  return {
    id: propertyConstraint.id ?? null,
    kind: constraintKind,
    stringValue: ['date', 'datetime', 'text', 'time'].includes(valueInput ?? '')
      ? propertyConstraint.stringValue ?? ''
      : null,
    integerValue: valueInput === 'integer'
      ? (propertyConstraint.integerValue ?? 0)
      : null,
    decimalValue: valueInput === 'decimal'
      ? (propertyConstraint.decimalValue ?? '0')
      : null,
    format: valueInput === 'format'
      ? (propertyConstraint.format ?? domainPropertyStringFormatOptions[0].value)
      : null
  }
}

const normalizeDomainProperty = (
  property: Partial<DomainProperty>,
  position: number
): DomainProperty => {
  const propertyType = property.type ?? DomainPropertyType.String

  return {
    id: property.id ?? null,
    name: property.name ?? '',
    description: property.description ?? '',
    position,
    type: propertyType,
    nullable: property.nullable ?? false,
    constraints: (property.constraints ?? [])
      .filter((constraint): constraint is DomainPropertyConstraint =>
        !!constraint.kind && getAllowedConstraintKinds(propertyType).includes(constraint.kind)
      )
      .map(constraint => normalizeDomainPropertyConstraint(constraint, propertyType))
  }
}

const normalizeDomainAssociation = (
  association: Partial<DomainAssociation>,
  position: number
): DomainAssociation => ({
  id: association.id ?? null,
  sourceName: association.sourceName ?? '',
  sourceCardinality: association.sourceCardinality ?? DomainAssociationCardinality.One,
  sourcePosition: position,
  targetName: association.targetName ?? '',
  targetCardinality: association.targetCardinality ?? DomainAssociationCardinality.Many,
  targetPosition: association.targetPosition ?? position,
  description: association.description ?? '',
  sourceEntity: normalizeDomainEntitySummary(association.sourceEntity),
  targetEntity: normalizeDomainEntitySummary(association.targetEntity)
})

const normalizeDomainEntitySummary = (entity?: DomainEntitySummary | null): DomainEntitySummary | null => {
  if (!entity) {
    return null
  }

  if (!entity.id) {
    return null
  }

  return {
    id: entity.id,
    name: entity.name ?? ''
  }
}

const normalizeDomainEntityDraft = <T extends DomainEntityDraft>(domainEntity: T): T => ({
  ...domainEntity,
  name: domainEntity.name ?? '',
  description: domainEntity.description ?? '',
  properties: (domainEntity.properties ?? []).map((property, index) => normalizeDomainProperty(property, index)),
  associations: (domainEntity.associations ?? []).map((association, index) => normalizeDomainAssociation(association, index)),
  targetAssociations: (domainEntity.targetAssociations ?? []).map((association, index) => normalizeDomainAssociation(association, index))
})

const createDomainEntityDraft = (domainEntity: DomainEntity, projectId: string): DomainEntityDraft => normalizeDomainEntityDraft({
  ...domainEntity,
  project: {
    id: projectId
  }
})

const toCreateDomainEntityRequest = (domainEntity: DomainEntityDraft): CreateDomainEntityRequest => ({
  name: domainEntity.name,
  description: domainEntity.description,
  project: {
    id: domainEntity.project.id
  },
  properties: domainEntity.properties.map(property => ({
    ...property
  })),
  associations: domainEntity.associations.map((association) => {
    if (!association.targetEntity?.id) {
      throw new Error(`Association "${association.sourceName || 'Unnamed association'}" is missing a target entity.`)
    }

    const { sourceEntity: _sourceEntity, targetEntity, ...requestAssociation } = association

    return {
      ...requestAssociation,
      targetEntity: {
        id: targetEntity.id
      }
    }
  })
})

const toUpdateDomainEntityRequest = (domainEntity: DomainEntityDraft): UpdateDomainEntityRequest => {
  if (!domainEntity.id) {
    throw new Error('Cannot update an entity without an id.')
  }

  return {
    ...toCreateDomainEntityRequest(domainEntity),
    id: domainEntity.id
  }
}

const validateDomainEntity = (
  domainEntity: DomainEntityDraft,
  projectDomainModel: DomainEntity[]
): string[] => {
  const errors = [] as string[]
  const entityName = domainEntity.name.trim()
  const usedNames = new Map<string, string>()

  if (entityName.length === 0) {
    errors.push('Entity name is required.')
  }

  const duplicateEntity = projectDomainModel.find(entity =>
    entity.id !== domainEntity.id &&
    entity.name.trim().toLocaleLowerCase() === entityName.toLocaleLowerCase()
  )

  if (entityName.length > 0 && duplicateEntity) {
    errors.push(`Another entity already uses the name "${entityName}".`)
  }

  const registerUsedName = (name: string, label: string) => {
    const normalizedName = name.trim()

    if (normalizedName.length === 0) {
      errors.push(`${label} is required.`)
      return
    }

    const key = normalizedName.toLocaleLowerCase()

    if (usedNames.has(key)) {
      errors.push(`${label} duplicates ${usedNames.get(key)}.`)
      return
    }

    usedNames.set(key, label)
  }

  domainEntity.properties.forEach((property, index) => {
    const propertyLabel = getDomainPropertyLabel(property, index)

    registerUsedName(property.name, propertyLabel)
    validateDomainProperty(property, propertyLabel, errors)
  })

  domainEntity.associations.forEach((association, index) => {
    const associationLabel = getDomainAssociationLabel(association, index)

    registerUsedName(association.sourceName, associationLabel)

    if (association.targetName.trim().length === 0) {
      errors.push(`${associationLabel} target name is required.`)
    }

    if (!association.targetEntity?.id) {
      errors.push(`${associationLabel} target entity is required.`)
    }
  })

  return errors
}

const validateDomainProperty = (property: DomainProperty, propertyLabel: string, errors: string[]) => {
  const constraintsByKind = new Map<DomainPropertyConstraintKind, DomainPropertyConstraint>()

  property.constraints.forEach((constraint) => {
    if (constraintsByKind.has(constraint.kind)) {
      errors.push(`${propertyLabel} uses the "${getDomainPropertyConstraintLabel(constraint.kind)}" constraint more than once.`)
      return
    }

    if (!getAllowedConstraintKinds(property.type).includes(constraint.kind)) {
      errors.push(`${propertyLabel} cannot use the "${getDomainPropertyConstraintLabel(constraint.kind)}" constraint with the ${getDomainPropertyTypeLabel(property.type)} type.`)
      return
    }

    constraintsByKind.set(constraint.kind, constraint)

    switch (getDomainConstraintValueInput(property.type, constraint.kind)) {
      case 'date':
        if (!isExactDate(constraint.stringValue ?? '')) {
          errors.push(`${propertyLabel} has an invalid date boundary.`)
        }
        break
      case 'datetime':
        if (!constraint.stringValue || Number.isNaN(Date.parse(constraint.stringValue))) {
          errors.push(`${propertyLabel} has an invalid datetime boundary.`)
        }
        break
      case 'decimal':
        if (
          constraint.decimalValue === null ||
          constraint.decimalValue === undefined ||
          constraint.decimalValue.trim().length === 0 ||
          Number.isNaN(Number(constraint.decimalValue))
        ) {
          errors.push(`${propertyLabel} has an invalid decimal constraint value.`)
        }
        break
      case 'format':
        if (!constraint.format) {
          errors.push(`${propertyLabel} is missing a string format value.`)
        }
        break
      case 'integer':
        if (constraint.integerValue === null || constraint.integerValue === undefined || Number.isNaN(Number(constraint.integerValue))) {
          errors.push(`${propertyLabel} has an invalid integer constraint value.`)
        }
        break
      case 'text':
        if ((constraint.stringValue ?? '').trim().length === 0) {
          errors.push(`${propertyLabel} has an empty text constraint value.`)
        }
        break
      case 'time':
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(constraint.stringValue ?? '')) {
          errors.push(`${propertyLabel} has an invalid time boundary.`)
        }
        break
    }
  })

  const minLength = constraintsByKind.get(DomainPropertyConstraintKind.MinLength)?.integerValue
  const maxLength = constraintsByKind.get(DomainPropertyConstraintKind.MaxLength)?.integerValue

  if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
    errors.push(`${propertyLabel} has inconsistent length constraints.`)
  }

  const precision = constraintsByKind.get(DomainPropertyConstraintKind.Precision)?.integerValue
  const scale = constraintsByKind.get(DomainPropertyConstraintKind.Scale)?.integerValue

  if (precision !== undefined && scale !== undefined && scale > precision) {
    errors.push(`${propertyLabel} has an invalid precision/scale combination.`)
  }

  validateMinMaxConsistency(property.type, constraintsByKind, propertyLabel, errors)
}

const getDomainPropertyLabel = (property: DomainProperty, index: number): string => {
  const propertyName = property.name.trim()

  return propertyName.length > 0 ? `Property "${propertyName}"` : `Property ${index + 1}`
}

const getDomainAssociationLabel = (association: DomainAssociation, index: number): string => {
  const associationName = association.sourceName.trim()

  return associationName.length > 0 ? `Association "${associationName}"` : `Association ${index + 1}`
}

const validateMinMaxConsistency = (
  propertyType: DomainPropertyType,
  constraintsByKind: Map<DomainPropertyConstraintKind, DomainPropertyConstraint>,
  propertyLabel: string,
  errors: string[]
) => {
  const minConstraint = constraintsByKind.get(DomainPropertyConstraintKind.Min)
  const maxConstraint = constraintsByKind.get(DomainPropertyConstraintKind.Max)

  if (!minConstraint || !maxConstraint) {
    return
  }

  let isValid = true

  switch (propertyType) {
    case DomainPropertyType.Integer:
      isValid = (minConstraint.integerValue ?? 0) <= (maxConstraint.integerValue ?? 0)
      break
    case DomainPropertyType.Decimal:
      isValid = Number(minConstraint.decimalValue ?? 0) <= Number(maxConstraint.decimalValue ?? 0)
      break
    case DomainPropertyType.Date:
    case DomainPropertyType.Time:
      isValid = (minConstraint.stringValue ?? '') <= (maxConstraint.stringValue ?? '')
      break
    case DomainPropertyType.Datetime:
      isValid = Date.parse(minConstraint.stringValue ?? '') <= Date.parse(maxConstraint.stringValue ?? '')
      break
    default:
      isValid = true
  }

  if (!isValid) {
    errors.push(`${propertyLabel} has inconsistent min/max constraints.`)
  }
}

const formatApiErrorMessage = (error: any, fallback: string): string => {
  const violations = error?.response?.data?.violations

  if (Array.isArray(violations) && violations.length > 0) {
    return violations
      .map((violation) => violation.message ?? violation.title ?? violation.propertyPath)
      .filter(Boolean)
      .join(' ')
  }

  return error?.response?.data?.detail ?? error?.message ?? fallback
}

const isExactDate = (value: string): boolean => {
  const date = new Date(value)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export {
  createEmptyDomainAssociation,
  createDomainEntityDraft,
  createEmptyDomainEntityDraft,
  createEmptyDomainProperty,
  createEmptyDomainPropertyConstraint,
  domainAssociationCardinalityOptions,
  domainPropertyStringFormatOptions,
  domainPropertyTypeOptions,
  formatApiErrorMessage,
  getAllowedConstraintKinds,
  getDomainAssociationCardinalityLabel,
  getDomainConstraintValueInput,
  getDomainPropertyConstraintLabel,
  getDomainPropertyTypeLabel,
  normalizeDomainEntityDraft,
  normalizeDomainPropertyConstraint,
  toCreateDomainEntityRequest,
  toUpdateDomainEntityRequest,
  validateDomainEntity
}
