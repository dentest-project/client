enum Delay {
  Instantly,
  Delayed
}

enum FeatureStatus {
  Draft = 'draft',
  ReadyToDev = 'ready_to_dev',
  Live = 'live'
}

enum IssueTracker {
  Jira = 'jira'
}

enum SaveStatus {
  Saved = 'saved',
  Saving = 'saving',
  NotSaved = 'not_saved'
}

enum Mode {
  View,
  Edit
}

enum Context {
  Project,
  Organization
}

enum DomainAssociationCardinality {
  EventuallyOne = 'eventually_one',
  Many = 'many',
  One = 'one'
}

enum DomainPropertyConstraintKind {
  Format = 'format',
  Max = 'max',
  MaxLength = 'max_length',
  Min = 'min',
  MinLength = 'min_length',
  Pattern = 'pattern',
  Precision = 'precision',
  Scale = 'scale'
}

enum DomainPropertyStringFormat {
  CountryCode = 'country_code',
  Email = 'email',
  Ipv4 = 'ipv4',
  Ipv6 = 'ipv6',
  Phone = 'phone',
  Slug = 'slug',
  Uri = 'uri',
  Url = 'url',
  UUID = 'uuid'
}

enum DomainPropertyType {
  Boolean = 'boolean',
  Date = 'date',
  Datetime = 'datetime',
  Decimal = 'decimal',
  Integer = 'integer',
  String = 'string',
  Text = 'text',
  Time = 'time',
  UUID = 'uuid'
}

enum OrganizationPermission {
  Admin = 'admin',
  ProjectCreate = 'project_create',
  ProjectWrite = 'project_write',
  Read = 'read'
}

enum ProjectPermission {
  Admin = 'admin',
  Write = 'write',
  Pull = 'pull',
  Read = 'read'
}

enum ProjectVisibility {
  Internal = 'internal',
  Private = 'private',
  Public = 'public'
}

enum ScenarioType {
  Background = 'background',
  Outline = 'outline',
  Regular = 'regular'
}

enum StepAdverb {
  Given = 'given',
  When = 'when',
  Then = 'then',
  And = 'and',
  But = 'but'
}

enum ContentStrategy {
  Free = 'free',
  Choices = 'choices',
  FakeData = 'fake_data',
  RowIndex = 'row_index'
}

enum FakeDataType {
  FirstName = 'first_name',
  LastName = 'last_name',
  FullName = 'full_name',
  JobTitle = 'job_title',
  Email = 'email',
  Phone = 'phone',
  Number = 'number',
  UUID = 'uuid',
  StreetAddress = 'street_address',
  City = 'city',
  ZipCode = 'zip_code',
  Country = 'country',
  Latitude = 'latitude',
  Longitude = 'longitude',
  Url = 'url'
}

enum StepParamType {
  Inline = 'inline',
  Multiline = 'multiline',
  Table = 'table',
  None = 'none'
}

enum StepPartType {
  Sentence = 'sentence',
  Param = 'param'
}

enum StepType {
  Given = 'given',
  When = 'when',
  Then = 'then'
}

interface BaseUser {
  id: string,
  username: string
}

interface BreadcrumbItem {
  text: string,
  disabled: boolean,
  href: string
}

interface CreateFeature {
  path: CreateFeaturePath,
  title: string
}

interface CreateFeaturePath {
  id: string
}

interface CreatePath {
  parent: CreatePathParent,
  path: string
}

interface CreatePathParent {
  id: string
}

interface DomainEntityBase {
  name: string,
  description: string,
  properties: Array<DomainProperty>,
  associations: Array<DomainAssociation>
}

interface CreateProject {
  title: string,
  visibility: ProjectVisibility,
  rootPath: CreateProjectRootPath,
  organization?: CreateProjectOrganization
}

interface CreateProjectOrganization {
  id: string
}

interface CreateProjectRootPath {
  path: string
}

interface CreateTag {
  name: string,
  color: string
}

interface DomainAssociationBase {
  id?: string | null,
  sourceName: string,
  sourceCardinality: DomainAssociationCardinality,
  sourcePosition: number,
  targetName: string,
  targetCardinality: DomainAssociationCardinality,
  targetPosition: number,
  description?: string | null
}

interface DomainAssociation extends DomainAssociationBase {
  sourceEntity?: DomainEntitySummary | null,
  targetEntity?: DomainEntitySummary | null
}

interface DomainEntity extends DomainEntityBase {
  id?: string | null,
  targetAssociations: Array<DomainAssociation>
}

interface DomainEntityDraft extends DomainEntity {
  project: DomainEntityProject
}

interface DomainAssociationRequest extends DomainAssociationBase {
  targetEntity: DomainEntityIdentifier
}

interface CreateDomainEntityRequest {
  name: string,
  description: string,
  project: DomainEntityProject,
  properties: Array<DomainProperty>,
  associations: Array<DomainAssociationRequest>
}

interface DomainEntityProject {
  id: string
}

interface DomainEntityIdentifier {
  id: string
}

interface DomainEntitySummary extends DomainEntityIdentifier {
  name: string
}

interface DomainProperty {
  id?: string | null,
  name: string,
  description: string,
  position: number,
  type: DomainPropertyType,
  nullable: boolean,
  constraints: Array<DomainPropertyConstraint>
}

interface DomainPropertyConstraint {
  id?: string | null,
  kind: DomainPropertyConstraintKind,
  stringValue?: string | null,
  integerValue?: number | null,
  decimalValue?: string | null,
  format?: DomainPropertyStringFormat | null
}

interface Feature {
  id: string,
  slug?: string,
  status: FeatureStatus,
  path: Path,
  title: string,
  description: string,
  summary?: string,
  scenarios: Array<Scenario>,
  rootProject?: Project,
  priority: number,
  tags: Array<Tag>
  issues: Array<Issue>
}

interface InlineStepParam extends StepParam {
  content: string,
  stepPart: StepPart
}

interface Issue {
  id?: string
  issueTracker: IssueTracker
  link: string
}

interface Login {
  username: string,
  password: string
}

interface LoginResponse {
  token: string
}

interface MultilineStepParam extends StepParam {
  content: string
}

interface Organization {
  id?: string,
  slug?: string,
  name: string,
  permissions: OrganizationPermission[]
  issueTrackerConfigurations: OrganizationIssueTrackerConfigurationEmbedded[]
}

interface OrganizationIssueTrackerConfigurationEmbedded {
  issueTracker: IssueTracker
  id: string
}

interface OrganizationIssueTrackerConfigurationDetailed extends OrganizationIssueTrackerConfigurationEmbedded {
  apiUrl: string
  userIdentifier: string
  accessToken: string
  organization: {
    id: string
  }
}

interface OrganizationUser {
  user: BaseUser,
  permissions: Array<OrganizationPermission>
}

interface Path extends ProjectRootPath {
  project?: PathProject,
  parent?: Path,
  path: string,
  summary?: string,
  children: PathList,
  features: Array<PathFeature>
}

interface PathFeature {
  id: string,
  title: string,
  status: FeatureStatus
}

interface PathProject {
  id: string,
  title: string,
  organization?: Organization
}

interface Project extends PathProject {
  rootPath: ProjectRootPath,
  organization?: Organization,
  permissions: Array<ProjectPermission>,
  slug: string,
  visibility: ProjectVisibility
}

interface ProjectRootPath {
  id: string,
  slug: string,
  rootProject?: Project
}

interface ProjectUser {
  user: BaseUser,
  permissions: Array<ProjectPermission>
}

interface PulledFeature {
  id: string,
  displayPath: string,
  path: string,
  feature: string
}

interface ProjectUserToken {
  token: string
}

interface Register {
  username: string,
  email: string,
  password: string
}

interface ResetPassword {
  code: string,
  newPassword: string
}

interface ResetPasswordRequest {
  email: string
}


interface Scenario {
  id: string,
  type: ScenarioType,
  title: string,
  steps: Array<ScenarioStep>,
  examples?: Record<string, Array<string>> | null,
  tags: Array<Tag>
}

interface ScenarioStep {
  id: string,
  adverb: StepAdverb,
  step?: Step,
  params: Array<InlineStepParam | MultilineStepParam | TableStepParam>,
  priority: number
}

interface Session {
  user: User
}

interface CreateStep {
  id: string
  project: StepProject,
  type: StepType,
  extraParamType: StepParamType,
  parts: Array<StepPart>,
  tags: Array<Tag>,
  extraParamTemplate?: TableStepParamTemplate | null
}

interface Step {
  id: string,
  project: StepProject,
  type: StepType,
  extraParamType: StepParamType,
  parts: Array<StepPart>,
  tags: Array<Tag>,
  extraParamTemplate?: TableStepParamTemplate | null
}

interface StepParam {
  id: string,
  type: StepParamType,
}

interface StepPart {
  id: string,
  type: StepPartType,
  content: string,
  priority: number,
  strategy?: ContentStrategy,
  choices?: Array<string> | null
  fakeDataType?: FakeDataType | null
}

interface StepProject {
  id: string
}

interface TableParamOptions {
  headerColumn: boolean,
  headerRow: boolean
}

interface TableStepParam extends StepParam, TableParamOptions {
  content: Array<Array<string>>
}

function isTableStepParam(object: any): object is TableStepParam {
  return !!object && 'headerColumn' in object && 'headerRow' in object;
}

type TableStepParamTemplateColumn = {
  header: string,
  strategy: ContentStrategy,
  choices?: string[]
  fakeDataType?: FakeDataType
}

type TableStepParamTemplate = TableStepParamTemplateColumn[]

interface Tag {
  id: string,
  name: string,
  color: string
}

interface UpdateFeature {
  id: string,
  path: UpdateFeaturePath,
  title: string,
  description: string,
  scenarios: Array<Scenario>,
  tags: Tag[]
  issues: Issue[]
}

interface UpdateFeatureParentPath {
  id: string,
  newParentId: string
}

interface UpdateFeatureStatus {
  id: string,
  status: FeatureStatus
}

interface UpdateFeaturePath extends CreateFeaturePath {}

interface UpdateDomainEntityRequest extends CreateDomainEntityRequest {
  id: string
}

interface UpdateMe {
  username: string,
  email: string
  password?: string
}

interface UpdateOrganizationName {
  id: string,
  name: string
}

interface UpdatePath {
  id: string,
  path: string
}

interface UpdatePathParent {
  id: string,
  newParentId: string
}

interface UpdateProject {
  id: string,
  title?: string,
  visibility?: ProjectVisibility
}

interface UpdateStep {
  id: string,
  parts: Array<StepPart>,
  tags: Array<Tag>,
  extraParamTemplate: TableStepParamTemplate | null
}

interface User extends BaseUser {
  email: string,
  roles: RoleList
}

type BreadcrumbItems = Array<BreadcrumbItem>
type DomainEntityList = Array<DomainEntity>
type OrganizationList = Array<Organization>
type OrganizationUserList = Array<OrganizationUser>
type PathList = Array<Path>
type ProjectList = Array<Project>
type ProjectUserList = Array<ProjectUser>
type RoleList = Array<string>

function isInlineStepParam(param: StepParam): param is InlineStepParam {
  return 'content' in param && typeof 'content' === 'string' && 'stepPart' in param;
}

export {
  BaseUser,
  BreadcrumbItems,
  ContentStrategy,
  Context,
  CreateDomainEntityRequest,
  CreateFeature,
  CreatePath,
  CreateProject,
  CreateStep,
  CreateTag,
  Delay,
  DomainAssociation,
  DomainAssociationBase,
  DomainAssociationCardinality,
  DomainAssociationRequest,
  DomainEntity,
  DomainEntityDraft,
  DomainEntityIdentifier,
  DomainEntityList,
  DomainEntityProject,
  DomainEntitySummary,
  DomainProperty,
  DomainPropertyConstraint,
  DomainPropertyConstraintKind,
  DomainPropertyStringFormat,
  DomainPropertyType,
  FakeDataType,
  Feature,
  FeatureStatus,
  InlineStepParam,
  Issue,
  IssueTracker,
  Login,
  LoginResponse,
  Mode,
  MultilineStepParam,
  Organization,
  OrganizationIssueTrackerConfigurationDetailed,
  OrganizationIssueTrackerConfigurationEmbedded,
  OrganizationList,
  OrganizationPermission,
  OrganizationUser,
  OrganizationUserList,
  Path,
  PathFeature,
  PathList,
  Project,
  ProjectList,
  ProjectPermission,
  ProjectRootPath,
  ProjectUser,
  ProjectUserList,
  ProjectUserToken,
  ProjectVisibility,
  PulledFeature,
  Register,
  ResetPassword,
  ResetPasswordRequest,
  SaveStatus,
  Scenario,
  ScenarioStep,
  ScenarioType,
  Session,
  Step,
  StepAdverb,
  StepParam,
  StepParamType,
  StepPart,
  StepPartType,
  StepType,
  TableParamOptions,
  TableStepParam,
  Tag,
  TableStepParamTemplate,
  TableStepParamTemplateColumn,
  UpdateFeature,
  UpdateFeaturePath,
  UpdateFeatureParentPath,
  UpdateFeatureStatus,
  UpdateDomainEntityRequest,
  UpdateMe,
  UpdateOrganizationName,
  UpdatePath,
  UpdatePathParent,
  UpdateProject,
  UpdateStep,
  User,
  isInlineStepParam,
  isTableStepParam
};
