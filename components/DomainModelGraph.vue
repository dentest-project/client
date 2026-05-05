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
  entities: DomainEntityList
}>()

const themeStore = useThemeStore()
const graphContainer = ref<HTMLDivElement | null>(null)
const graphReady = ref(false)
const loadError = ref('')
const focusedNodeId = ref<string | null>(null)

let graph: any = null
let cytoscapeFactory: any = null
let elkRegistered = false
const edgeCurveClassNames = ['edge-curve-0', 'edge-curve-1', 'edge-curve-2', 'edge-curve-3', 'edge-curve-4'] as const

type GraphElement = {
  classes?: string,
  data: Record<string, string>
}

const formatEntityName = (name: string): string => name.trim().length > 0 ? name.trim() : 'Untitled entity'

const getEntityNodeId = (entity: DomainEntity, index: number): string => entity.id ?? `domain-entity-${index}`

const formatCardinality = (cardinality: DomainAssociationCardinality): string => ({
  [DomainAssociationCardinality.One]: '1',
  [DomainAssociationCardinality.EventuallyOne]: '0..1',
  [DomainAssociationCardinality.Many]: '*'
}[cardinality] ?? cardinality)

const getEdgeCurveClassName = (entityIndex: number, associationIndex: number): string =>
  edgeCurveClassNames[(entityIndex + associationIndex) % edgeCurveClassNames.length]

const graphElements = computed(() => {
  const nodes = props.entities.map((entity, index) => ({
    data: {
      id: getEntityNodeId(entity, index),
      entityId: entity.id ?? '',
      label: formatEntityName(entity.name)
    }
  }))

  const edges = props.entities.flatMap((entity, entityIndex) =>
    entity.associations.reduce<GraphElement[]>((items, association, associationIndex) => {
      if (!association.targetEntity?.id) {
        return items
      }

      items.push({
        classes: getEdgeCurveClassName(entityIndex, associationIndex),
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
      selector: 'node.is-dimmed',
      style: {
        'border-opacity': 0.2,
        'opacity': 0.35,
        'text-opacity': 0.45
      }
    },
    {
      selector: 'node.is-focused-entity',
      style: {
        'border-color': nodeBorderActive,
        'border-width': 3,
        'opacity': 1,
        'text-opacity': 1
      }
    },
    {
      selector: 'node.is-linked-entity',
      style: {
        'border-color': readCssVar('--el-color-warning', '#e6a23c'),
        'border-width': 2.5,
        'opacity': 1,
        'text-opacity': 1
      }
    },
    {
      selector: 'edge',
      style: {
        'arrow-scale': 0.9,
        'color': textSecondary,
        'control-point-weight': 0.5,
        'curve-style': 'unbundled-bezier',
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
        'text-background-color': labelBackground,
        'text-background-opacity': 0.9,
        'text-background-padding': '2px',
        'text-rotation': 'none',
        'width': 1.8
      }
    },
    {
      selector: 'edge.is-dimmed',
      style: {
        'line-opacity': 0.18,
        'opacity': 0.25,
        'source-text-opacity': 0.35,
        'target-text-opacity': 0.35
      }
    },
    {
      selector: 'edge.is-active-link',
      style: {
        'line-color': nodeBorderActive,
        'opacity': 1,
        'source-text-opacity': 1,
        'target-arrow-color': nodeBorderActive,
        'target-text-opacity': 1,
        'width': 2.4
      }
    },
    {
      selector: '.edge-curve-0',
      style: {
        'control-point-distance': -96
      }
    },
    {
      selector: '.edge-curve-1',
      style: {
        'control-point-distance': -48
      }
    },
    {
      selector: '.edge-curve-2',
      style: {
        'control-point-distance': 0
      }
    },
    {
      selector: '.edge-curve-3',
      style: {
        'control-point-distance': 48
      }
    },
    {
      selector: '.edge-curve-4',
      style: {
        'control-point-distance': 96
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

const clearFocusState = () => {
  focusedNodeId.value = null

  if (!graph) {
    return
  }

  graph.elements().removeClass('is-dimmed is-focused-entity is-linked-entity is-active-link')
}

const applyFocusState = (nodeId: string | null) => {
  if (!graph || !nodeId) {
    clearFocusState()
    return
  }

  const focusedNode = graph.getElementById(nodeId)

  if (!focusedNode || focusedNode.empty()) {
    clearFocusState()
    return
  }

  const connectedEdges = focusedNode.connectedEdges()
  const linkedNodes = graph.collection()

  connectedEdges.forEach((edge: any) => {
    const sourceNode = edge.source()
    const targetNode = edge.target()

    if (sourceNode.id() !== focusedNode.id()) {
      linkedNodes.merge(sourceNode)
    }

    if (targetNode.id() !== focusedNode.id()) {
      linkedNodes.merge(targetNode)
    }
  })

  focusedNodeId.value = nodeId

  graph.elements().removeClass('is-dimmed is-focused-entity is-linked-entity is-active-link')
  graph.elements().addClass('is-dimmed')
  connectedEdges.removeClass('is-dimmed').addClass('is-active-link')
  linkedNodes.removeClass('is-dimmed').addClass('is-linked-entity')
  focusedNode.removeClass('is-dimmed').addClass('is-focused-entity')
}

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
  applyFocusState(focusedNodeId.value)
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
        const nodeId = String(event.target.id() ?? '')

        if (nodeId.length === 0) {
          clearFocusState()
          return
        }

        applyFocusState(focusedNodeId.value === nodeId ? null : nodeId)
      })

      graph.on('tap', (event: any) => {
        if (event.target === graph) {
          clearFocusState()
        }
      })
    } else {
      graph.batch(() => {
        graph.elements().remove()
        graph.add(graphElements.value)
      })

      graph.style(buildGraphStyle())
      runLayout()
    }

    applyFocusState(focusedNodeId.value)
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
  applyFocusState(focusedNodeId.value)
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
