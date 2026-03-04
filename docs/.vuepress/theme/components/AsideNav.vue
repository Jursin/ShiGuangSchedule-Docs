<script setup lang="ts">
import { VPIcon, VPLink } from 'vuepress-theme-plume/client'
</script>

<template>
  <div class="aside-nav-wrapper">
    <VPLink class="link" no-icon href="https://github.com/XingHeYuZhuan/shiguangschedule">
      <VPIcon name="tabler:star" />
      <span class="link-text">在 GitHub 上 Star</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" no-icon href="https://github.com/XingHeYuZhuan/shiguangschedule/issues/new/choose">
      <VPIcon name="octicon:issue-opened-16" />
      <span class="link-text">遇到问题？</span>
      <span class="vpi-arrow-right" />
    </VPLink>
  </div>
</template>

<style scoped>
.aside-nav-wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  margin: 16px 16px 0;
  border-top: solid 1px var(--vp-c-divider);
}

.aside-nav-wrapper .link {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.aside-nav-wrapper .link:hover {
  color: var(--vp-c-brand-1);
}

.aside-nav-wrapper .link .link-text {
  flex: 1 2;
  font-size: 12px;
}

.aside-nav-wrapper :deep([class*=" vpi-"]) {
  margin: 0;
}
</style>