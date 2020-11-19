interface BreadcrumbItem {
  text: string,
  disabled: boolean,
  href: string
}

interface CreatePathParent {
  id: string
}

interface CreatePath {
  parent: CreatePathParent,
  path: string
}

interface CreateProject {
  title: string,
  rootPath: CreateProjectRootPath
}

interface CreateProjectRootPath {
  path: string
}

interface ProjectListItemPath {
  id: string
}

interface ProjectListItem {
  id: string,
  title: string,
  rootPath: ProjectListItemPath
}

interface PathFeature {
  id: string,
  title: string
}

interface PathProject {
  id: string,
  title: string
}

interface Path {
  id: string,
  project?: PathProject,
  parent?: Path,
  path: string,
  children: PathList,
  features: Array<PathFeature>
}

type Breadcrumb = Array<BreadcrumbItem>
type PathList = Array<Path>
type ProjectList = Array<ProjectListItem>

export { Breadcrumb, CreatePath, CreateProject, Path, PathFeature, PathList, ProjectList, ProjectListItem };
