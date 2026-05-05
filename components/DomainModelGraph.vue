<template>
  <section class="DomainModelGraph">
    <div class="DomainModelGraph-toolbar">
      <div class="DomainModelGraph-actions">
        <el-tooltip content="Fit graph">
          <el-button circle :icon="Aim" :disabled="!graphReady" @click="fitGraph" />
        </el-tooltip>
        <el-tooltip content="Re-layout graph">
          <el-button circle :icon="RefreshRight" :disabled="!graphReady" @click="runLayout" />
        </el-tooltip>
      </div>
    </div>
    <Panel v-if="loadError.length > 0" type="warning">
      {{ loadError }}
    </Panel>
    <div v-else ref="graphContainer" class="DomainModelGraph-canvas" />
  </section>
</template>

<script setup lang="ts">
import { Aim, RefreshRight } from '@element-plus/icons-vue'
import { useResizeObserver } from '@vueuse/core'
import { useThemeStore } from '~/store/theme'
import { DomainAssociationCardinality, type DomainEntity, type DomainEntityList } from '~/types'

const props = defineProps<{
  entities: DomainEntityList,
  entityLink: (entityId: string) => string
}>()

const router = useRouter()
const themeStore = useThemeStore()
const graphContainer = ref<HTMLDivElement | null>(null)
const graphReady = ref(false)
const loadError = ref('')

let graph: any = null
let cytoscapeFactory: any = null
let elkRegistered = false

const formatEntityName = (name: string): string => name.trim().length > 0 ? name.trim() : 'Untitled entity'

const getEntityNodeId = (entity: DomainEntity, index: number): string => entity.id ?? `domain-entity-${index}`

const formatCardinality = (cardinality: DomainAssociationCardinality): string => ({
  [DomainAssociationCardinality.One]: '1',
  [DomainAssociationCardinality.EventuallyOne]: '0..1',
  [DomainAssociationCardinality.Many]: '*'
}[cardinality] ?? cardinality)

const graphElements = computed(() => {
  const nodes = props.entities.map((entity, index) => ({
    data: {
      id: getEntityNodeId(entity, index),
      entityId: entity.id ?? '',
      label: formatEntityName(entity.name)
    }
  }))

  const edges = props.entities.flatMap((entity, entityIndex) =>
    entity.associations.reduce<Array<{ data: Record<string, string> }>>((items, association, associationIndex) => {
      if (!association.targetEntity?.id) {
        return items
      }

      items.push({
        data: {
          id: association.id ?? `association-${getEntityNodeId(entity, entityIndex)}-${association.targetEntity.id}-${associationIndex}`,
          source: getEntityNodeId(entity, entityIndex),
          target: association.targetEntity.id,
          sourceLabel: formatCardinality(association.sourceCardinality),
          targetLabel: formatCardinality(association.targetCardinality)
        }
      })

      return items
    }, [])
  )

  return [...nodes, ...edges]
})

const readCssVar = (name: string, fallback: string): string => {
  if (!process.client) {
    return fallback
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()

  return value.length > 0 ? value : fallback
}

const buildGraphStyle = () => {
  const nodeBackground = readCssVar('--el-fill-color-light', '#f5f7fa')
  const nodeBorder = readCssVar('--el-border-color-dark', '#c8c9cc')
  const nodeBorderActive = readCssVar('--el-color-primary', '#686de0')
  const edgeColor = readCssVar('--el-border-color-darker', '#cdd0d6')
  const textPrimary = readCssVar('--el-text-color-primary', '#303133')
  const textSecondary = readCssVar('--el-text-color-secondary', '#606266')
  const labelBackground = readCssVar('--el-bg-color-overlay', '#ffffff')

  return [
    {
      selector: 'node',
      style: {
        'background-color': nodeBackground,
        'border-color': nodeBorder,
        'border-width': 1.5,
        'color': textPrimary,
        'font-size': 13,
        'font-weight': 600,
        'height': 'label',
        'label': 'data(label)',
        'line-height': 1.35,
        'min-zoomed-font-size': 10,
        'overlay-opacity': 0,
        'padding': 14,
        'padding-relative-to': 'average',
        'shape': 'round-rectangle',
        'text-halign': 'center',
        'text-max-width': 160,
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'width': 'label'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-color': nodeBorderActive,
        'border-width': 2.5
      }
    },
    {
      selector: 'edge',
      style: {
        'arrow-scale': 0.9,
        'color': textSecondary,
        'curve-style': 'round-taxi',
        'font-size': 10,
        'line-color': edgeColor,
        'min-zoomed-font-size': 9,
        'overlay-opacity': 0,
        'source-distance-from-node': 6,
        'source-label': 'data(sourceLabel)',
        'source-text-offset': 14,
        'source-text-rotation': 'none',
        'target-distance-from-node': 6,
        'target-arrow-color': edgeColor,
        'target-arrow-shape': 'triangle',
        'target-label': 'data(targetLabel)',
        'target-text-offset': 14,
        'target-text-rotation': 'none',
        'taxi-direction': 'downward',
        'taxi-radius': 8,
        'taxi-turn': 24,
        'taxi-turn-min-distance': 18,
        'text-background-color': labelBackground,
        'text-background-opacity': 0.9,
        'text-background-padding': '2px',
        'text-rotation': 'none',
        'width': 1.8
      }
    }
  ]
}

const createLayoutOptions = () => ({
  name: 'elk',
  animate: false,
  fit: true,
  nodeDimensionsIncludeLabels: false,
  padding: 48,
  elk: {
    algorithm: 'layered',
    'elk.direction': 'DOWN',
    'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.spacing.edgeEdgeBetweenLayers': 28,
    'elk.layered.spacing.edgeNodeBetweenLayers': 40,
    'elk.layered.spacing.nodeNodeBetweenLayers': 120,
    'elk.spacing.nodeNode': 80,
    'elk.separateConnectedComponents': true
  }
})

const ensureGraphFactory = async () => {
  if (cytoscapeFactory) {
    return cytoscapeFactory
  }

  const [{ default: cytoscapeModule }, { default: cytoscapeElk }] = await Promise.all([
    import('cytoscape'),
    import('cytoscape-elk')
  ])

  if (!elkRegistered) {
    cytoscapeModule.use(cytoscapeElk)
    elkRegistered = true
  }

  cytoscapeFactory = cytoscapeModule

  return cytoscapeFactory
}

const runLayout = () => {
  if (!graph) {
    return
  }

  graph.layout(createLayoutOptions()).run()
}

const fitGraph = () => {
  if (!graph) {
    return
  }

  graph.fit(undefined, 48)
}

const syncGraph = async () => {
  if (!graphContainer.value) {
    return
  }

  try {
    loadError.value = ''

    const cytoscape = await ensureGraphFactory()

    if (!graph) {
      graph = cytoscape({
        autoungrabify: true,
        boxSelectionEnabled: false,
        container: graphContainer.value,
        elements: graphElements.value,
        layout: createLayoutOptions(),
        maxZoom: 2.5,
        minZoom: 0.2,
        style: buildGraphStyle(),
        wheelSensitivity: 0.2
      })

      graph.on('tap', 'node', (event: any) => {
        const entityId = String(event.target.data('entityId') ?? '')

        if (entityId.length === 0) {
          return
        }

        void router.push(props.entityLink(entityId))
      })
    } else {
      graph.batch(() => {
        graph.elements().remove()
        graph.add(graphElements.value)
      })

      graph.style(buildGraphStyle())
      runLayout()
    }

    graphReady.value = true
  } catch (error) {
    graphReady.value = false
    loadError.value = 'Unable to load the domain graph.'
    console.error(error)
  }
}

watch(graphElements, () => {
  void syncGraph()
})

watch(() => themeStore.theme, () => {
  if (!graph) {
    return
  }

  graph.style(buildGraphStyle())
})

useResizeObserver(graphContainer, () => {
  if (!graph) {
    return
  }

  graph.resize()
})

onMounted(() => {
  void syncGraph()
})

onBeforeUnmount(() => {
  graphReady.value = false

  if (!graph) {
    return
  }

  graph.destroy()
  graph = null
})
</script>

<style scoped>
.DomainModelGraph {
  margin-bottom: 2rem;
}

.DomainModelGraph-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.DomainModelGraph-actions {
  display: flex;
  gap: 0.75rem;
}

.DomainModelGraph-canvas {
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: block;
  height: min(78vh, 920px);
  min-height: 40rem;
  width: 100%;
}
</style>
