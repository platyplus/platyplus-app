<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header
    router-view(name="header")
  router-view(name="menu")
  q-page-container
    router-view
</template>
