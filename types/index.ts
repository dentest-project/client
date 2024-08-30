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
  Choices = 'choices'
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

interface Feature {
  id: string,
  slug?: string,
  status: FeatureStatus,
  path: Path,
  title: string,
  description: string,
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

type TableStepParamTemplate = {
  header: string,
  strategy: ContentStrategy,
  choices?: string[]
}[]

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

interface UpdateMe extends Register {}

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
  CreateFeature,
  CreatePath,
  CreateProject,
  CreateStep,
  CreateTag,
  Delay,
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
  UpdateFeature,
  UpdateFeaturePath,
  UpdateFeatureParentPath,
  UpdateFeatureStatus,
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
