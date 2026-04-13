import { CONFIG } from '@/config'

function skeletonCard(): string {
  return /* html */ `
    <div class="skeleton-card">
      <div class="sk-line" style="width:85%"></div>
      <div class="sk-line medium"></div>
      <div class="sk-line short"></div>
      <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
        <div class="sk-line meta" style="width:30%; margin-bottom:0"></div>
        <div class="sk-line meta" style="width:25%; margin-bottom:0"></div>
      </div>
    </div>
  `
}

export function renderSkeletons(): string {
  return Array.from({ length: CONFIG.wishes.pageSize }, () => skeletonCard()).join('')
}
