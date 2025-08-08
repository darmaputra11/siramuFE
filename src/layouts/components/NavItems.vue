<script lang="ts" setup>
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- 👉 Dashboards -->
   <VerticalNavLink
   class="mt-4"
    :item="{
      title: 'Dashboard',
      icon: 'ri-dashboard-line',
      to: '/dashboard',
    }"
  />
   <VerticalNavLink
    :item="{
      title: 'Users',
      icon: 'ri-group-line',
      to: '/users',
    }"
  />
  <VerticalNavGroup
    :item="{
      title: 'Data Penduduk',
      // badgeContent: '5',
      // badgeClass: 'bg-error',
      icon: 'ri-user-community-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Data Kematian',
        to: '/dashboard',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Data Pindah',
        href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/crm',
        target: '_blank',
      }"
    />
  </VerticalNavGroup>

</template>
