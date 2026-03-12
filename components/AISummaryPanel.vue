<template>
  <div class="AISummaryPanel" role="note" aria-label="AI-generated feature summary">
    <div class="AISummaryPanel-badge">
      <el-icon class="AISummaryPanel-icon" aria-hidden="true">
        <MagicStick />
      </el-icon>
      <span>AI-generated summary</span>
    </div>
    <p class="AISummaryPanel-text">{{ summary }}</p>
  </div>
</template>

<script setup lang="ts">
import { MagicStick } from '@element-plus/icons-vue'

defineProps<{
  summary: string
}>()
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
  margin: 0;
  color: var(--el-text-color-primary);
  line-height: 1.65;
  white-space: pre-line;
}
</style>
