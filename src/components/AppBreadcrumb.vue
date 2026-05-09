<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const route = useRoute()

type Crumb = {
  label: string
  to?: { name: string; params?: Record<string, string | number> }
}

const crumbs = computed<Crumb[]>(() => {
  const name = route.name?.toString()
  const title = (route.meta.title as string | undefined) ?? 'Page'
  const id = Number(route.params.id)

  if (name === 'home') {
    return [{ label: 'Notes' }]
  }

  if (name === 'note-create') {
    return [{ label: 'Notes', to: { name: 'home' } }, { label: 'Create Note' }]
  }

  if (name === 'note-detail') {
    return [{ label: 'Notes', to: { name: 'home' } }, { label: `Note #${id}` }]
  }

  if (name === 'note-edit') {
    return [
      { label: 'Notes', to: { name: 'home' } },
      { label: `Note #${id}`, to: { name: 'note-detail', params: { id } } },
      { label: 'Edit Note' },
    ]
  }

  return [{ label: 'Notes', to: { name: 'home' } }, { label: title }]
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(crumb, index) in crumbs" :key="`${crumb.label}-${index}`">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="crumb.to" as-child>
            <RouterLink :to="crumb.to">{{ crumb.label }}</RouterLink>
          </BreadcrumbLink>
          <BreadcrumbPage v-else>{{ crumb.label }}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < crumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
