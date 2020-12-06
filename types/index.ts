enum Mode {
  View,
  Edit
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
  rootPath: CreateProjectRootPath
}

interface CreateProjectRootPath {
  path: string
}

interface Feature {
  id: string,
  path: Path,
  title: string,
  description: string,
  scenarios: Array<Scenario>
}

interface FeatureRootProject {
  id: string
}

interface InlineStepParam extends StepParam {
  content: string,
  stepPart: StepPart
}

interface MultilineStepParam extends StepParam {
  content: string
}

interface Path {
  id: string,
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
  rootPath: ProjectRootPath
}

interface ProjectRootPath {
  id: string
}

interface Scenario {
  id: number,
  type: ScenarioType,
  title: string,
  steps: Array<ScenarioStep>,
  examples?: Record<string, Array<string>>
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
  parts: Array<StepPart>
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

interface UpdateFeature{
  id: string,
  path: UpdateFeaturePath,
  title: string,
  description: string,
  scenarios: Array<Scenario>
}

interface UpdateFeaturePath extends CreateFeaturePath {}

interface UpdatePath {
  id: string,
  path: string
}

interface UpdateProject {
  id: string,
  title: string
}

type Breadcrumb = Array<BreadcrumbItem>
type PathList = Array<Path>
type ProjectList = Array<Project>

function isInlineStepParam(param: StepParam): param is InlineStepParam {
  return 'content' in param && typeof 'content' === 'string' && 'stepPart' in param;
}

export {
  Breadcrumb,
  CreateFeature,
  CreatePath,
  CreateProject,
  Feature,
  FeatureRootProject,
  InlineStepParam,
  Mode,
  MultilineStepParam,
  Path,
  PathFeature,
  PathList,
  Project,
  ProjectList,
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
  UpdateFeature,
  UpdatePath,
  UpdateProject,
  isInlineStepParam
};
