import { faker } from '@faker-js/faker'

import { FakeDataType } from '~/types'

const mapDataTypeToFakeData: Record<FakeDataType, () => string> = {
  [FakeDataType.FirstName]: faker.person.firstName,
  [FakeDataType.LastName]: faker.person.lastName,
  [FakeDataType.FullName]: faker.person.fullName,
  [FakeDataType.JobTitle]: faker.person.jobTitle,
  [FakeDataType.Email]: faker.internet.email,
  [FakeDataType.Phone]: faker.phone.number,
  [FakeDataType.Number]: () => faker.number.int().toString(),
  [FakeDataType.UUID]: faker.string.uuid,
  [FakeDataType.StreetAddress]: faker.location.streetAddress,
  [FakeDataType.City]: faker.location.city,
  [FakeDataType.ZipCode]: faker.location.zipCode,
  [FakeDataType.Country]: faker.location.country,
  [FakeDataType.Latitude]: () => faker.location.latitude().toString(),
  [FakeDataType.Longitude]: () => faker.location.longitude().toString(),
  [FakeDataType.Url]: faker.internet.url,
}

export const fake = (dataType: FakeDataType): string => {
  return mapDataTypeToFakeData[dataType] ? mapDataTypeToFakeData[dataType]() : ''
}
