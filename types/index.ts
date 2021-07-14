enum FeatureStatus {
  Draft = 'draft',
  ReadyToDev = 'ready_to_dev',
  Live = 'live'
}

enum Mode {
  View,
  Edit
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
}

interface InlineStepParam extends StepParam {
  content: string,
  stepPart: StepPart
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
  permissions: Array<OrganizationPermission>
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
  title: string
}

interface PathProject {
  id: string,
  title: string
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
  id?: number,
  type: ScenarioType,
  title: string,
  steps: Array<ScenarioStep>,
  examples?: Record<string, Array<string>> | null,
  tags: Array<Tag>
}

interface ScenarioStep {
  id?: number,
  adverb: StepAdverb,
  step?: Step,
  params: Array<InlineStepParam | MultilineStepParam | TableStepParam>,
  priority: number
}

interface SelectItem {
  text: string,
  value: string,
  disabled: boolean
}

interface Step {
  id?: number,
  project: StepProject,
  type: StepType,
  extraParamType: StepParamType,
  parts: Array<StepPart>,
  tags: Array<Tag>
}

interface StepParam {
  id?: number,
  type: StepParamType,
}

interface StepPart {
  id?: number,
  type: StepPartType,
  content: string,
  priority: number
}

interface StepProject {
  id: string
}

interface TableStepParam extends StepParam {
  content: Array<Array<string>>
}

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
  scenarios: Array<Scenario>
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
  id: number,
  parts: Array<StepPart>,
  tags: Array<Tag>
}

interface User extends BaseUser {
  email: string,
  roles: RoleList
}

type Breadcrumb = Array<BreadcrumbItem>
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
  Breadcrumb,
  CreateFeature,
  CreatePath,
  CreateProject,
  CreateTag,
  Feature,
  FeatureStatus,
  InlineStepParam,
  Login,
  LoginResponse,
  Mode,
  MultilineStepParam,
  Organization,
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
  Register,
  ResetPassword,
  ResetPasswordRequest,
  Scenario,
  ScenarioStep,
  ScenarioType,
  SelectItem,
  Step,
  StepAdverb,
  StepParam,
  StepParamType,
  StepPart,
  StepPartType,
  StepType,
  TableStepParam,
  Tag,
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
  isInlineStepParam
};
