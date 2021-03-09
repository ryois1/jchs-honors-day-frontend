<template>
  <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: "Admin",
          href: "#",
        },
        {
          text: "Manage",
          href: "#",
        },
        {
          text: "Library",
          active: true,
        },
      ],
    };
  },
};
</script>