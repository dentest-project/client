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

interface ProjectListItem {
  id: string,
  title: string,
  rootPath: ProjectListItemPath
}

interface ProjectListItemPath {
  id: string
}

type Breadcrumb = Array<BreadcrumbItem>
type PathList = Array<Path>
type ProjectList = Array<ProjectListItem>

export {
  Breadcrumb,
  CreateFeature,
  CreatePath,
  CreateProject,
  Path,
  PathFeature,
  PathList,
  ProjectList,
  ProjectListItem
};
