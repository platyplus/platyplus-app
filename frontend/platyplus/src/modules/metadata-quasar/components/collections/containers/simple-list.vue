<template lang="pug">
q-list(v-if="list.length" highlight class="col-12" separator)
    slot(name="before-item")
    template(v-for="item in list")
      slot(name="item" :item="item")
        h-list-item(:element="item" :table="table" :key="item.id")
    slot(name="after-item")
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { listProps } from '../../../../metadata'

export default createComponent({
  props: {
    ...listProps
  }
})
</script>
