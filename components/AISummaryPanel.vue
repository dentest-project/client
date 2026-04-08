<template>
  <div class="AISummaryPanel" role="note" aria-label="AI-generated feature summary">
    <div class="AISummaryPanel-badge">
      <el-icon class="AISummaryPanel-icon" aria-hidden="true">
        <MagicStick />
      </el-icon>
      <span>Summary</span>
    </div>
    <div
      :class="[
        'AISummaryPanel-text',
        { 'AISummaryPanel-text--collapsed': canExpand && !isExpanded },
      ]"
      v-html="renderedSummary"
    ></div>
    <button
      v-if="canExpand"
      type="button"
      class="AISummaryPanel-toggle"
      :aria-expanded="isExpanded"
      @click="isExpanded = !isExpanded"
    >
      {{ isExpanded ? 'Show less' : 'Show more' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { MagicStick } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  summary: string
}>()

const MAX_VISIBLE_LINES = 10
const MIN_EXPANDABLE_CHAR_COUNT = 1200
const isExpanded = ref(false)

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const defaultLinkOpenRenderer = markdown.renderer.rules.link_open
  ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('target', '_blank')
  tokens[idx].attrSet('rel', 'noopener noreferrer nofollow')

  return defaultLinkOpenRenderer(tokens, idx, options, env, self)
}

const renderedSummary = computed(() => markdown.render(props.summary ?? ''))

const canExpand = computed(() => {
  const explicitLineCount = props.summary.split(/\r?\n/).length
  const plainLength = props.summary.trim().length

  return explicitLineCount > MAX_VISIBLE_LINES || plainLength > MIN_EXPANDABLE_CHAR_COUNT
})

watch(() => props.summary, () => {
  isExpanded.value = false
})
</script>

<style scoped>
.AISummaryPanel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin: 20px 0;
  padding: 1rem 1.15rem;
  border: 1px solid rgba(104, 109, 224, 0.38);
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(104, 109, 224, 0.16), rgba(106, 176, 76, 0.18)),
    var(--el-bg-color-overlay);
  box-shadow: 0 14px 32px rgba(104, 109, 224, 0.16);
}

.AISummaryPanel::before,
.AISummaryPanel::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
}

.AISummaryPanel::before {
  top: -42px;
  right: -26px;
  width: 128px;
  height: 128px;
  background: radial-gradient(circle, rgba(104, 109, 224, 0.26) 0%, transparent 72%);
}

.AISummaryPanel::after {
  bottom: -58px;
  left: -14px;
  width: 156px;
  height: 156px;
  background: radial-gradient(circle, rgba(106, 176, 76, 0.24) 0%, transparent 74%);
}

.AISummaryPanel-badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.8rem;
  width: fit-content;
  border: 1px solid rgba(104, 109, 224, 0.3);
  border-radius: 999px;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-success));
  color: white;
  box-shadow: 0 10px 18px rgba(104, 109, 224, 0.26);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.AISummaryPanel-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.AISummaryPanel-icon {
  font-size: 1rem;
}

.AISummaryPanel-text {
  position: relative;
  z-index: 1;
  color: var(--el-text-color-primary);
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.AISummaryPanel-text--collapsed {
  max-height: calc(1.65em * 10);
  overflow: hidden;
}

.AISummaryPanel-text :deep(h1),
.AISummaryPanel-text :deep(h2),
.AISummaryPanel-text :deep(h3),
.AISummaryPanel-text :deep(h4),
.AISummaryPanel-text :deep(h5),
.AISummaryPanel-text :deep(h6) {
  margin: 0 0 0.8rem;
  color: var(--el-text-color-primary);
  font-weight: 700;
  line-height: 1.4;
}

.AISummaryPanel-text :deep(h1) {
  font-size: 1.2rem;
}

.AISummaryPanel-text :deep(h2) {
  font-size: 1.1rem;
}

.AISummaryPanel-text :deep(h3),
.AISummaryPanel-text :deep(h4),
.AISummaryPanel-text :deep(h5),
.AISummaryPanel-text :deep(h6) {
  font-size: 1rem;
}

.AISummaryPanel-text :deep(p),
.AISummaryPanel-text :deep(ul),
.AISummaryPanel-text :deep(ol),
.AISummaryPanel-text :deep(blockquote),
.AISummaryPanel-text :deep(pre),
.AISummaryPanel-text :deep(table) {
  margin: 0 0 0.85rem;
}

.AISummaryPanel-text :deep(ul),
.AISummaryPanel-text :deep(ol) {
  padding-left: 1.35rem;
}

.AISummaryPanel-text :deep(li + li) {
  margin-top: 0.35rem;
}

.AISummaryPanel-text :deep(blockquote) {
  padding-left: 0.9rem;
  border-left: 3px solid rgba(104, 109, 224, 0.35);
  color: var(--el-text-color-secondary);
}

.AISummaryPanel-text :deep(code) {
  padding: 0.15rem 0.35rem;
  border-radius: 6px;
  background: rgba(31, 35, 41, 0.08);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace;
  font-size: 0.92em;
}

.AISummaryPanel-text :deep(pre) {
  overflow-x: auto;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(31, 35, 41, 0.08);
}

.AISummaryPanel-text :deep(pre code) {
  padding: 0;
  background: transparent;
}

.AISummaryPanel-text :deep(a) {
  color: var(--el-color-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.AISummaryPanel-text :deep(hr) {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid rgba(104, 109, 224, 0.2);
}

.AISummaryPanel-text :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.AISummaryPanel-text :deep(th),
.AISummaryPanel-text :deep(td) {
  padding: 0.55rem 0.7rem;
  border: 1px solid rgba(104, 109, 224, 0.18);
  text-align: left;
  vertical-align: top;
}

.AISummaryPanel-text :deep(*:last-child) {
  margin-bottom: 0;
}

.AISummaryPanel-toggle {
  position: relative;
  z-index: 1;
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--el-color-primary);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.AISummaryPanel-toggle:hover,
.AISummaryPanel-toggle:focus-visible {
  color: var(--el-color-primary-light-3);
}

.AISummaryPanel-toggle:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 4px;
  border-radius: 6px;
}
</style>
