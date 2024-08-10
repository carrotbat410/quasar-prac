<template>
  <q-page class="q-pa-xl">
    <section class="q-mb-xl">
      <div class="text-h4">Break Points</div>
      <q-separator class="q-my-md"></q-separator>
      <div class="target flex flex-center">
        <span class="text-h2 text-weight-bold text-white">{{
          $q.screen.name
        }}</span>
      </div>
      <div v-if="$q.screen.gt.sm" class="target flex flex-center">
        <span class="text-h2 text-weight-bold text-white">{{
          $q.screen.name
        }}</span>
      </div>
    </section>
    <section class="q-mb-xl">
      <div class="text-h4">$q.screen</div>
      <q-separator class="q-my-md"></q-separator>
      <div>
        <ul>
          <li v-for="(value, key) in $q.screen" :key="key">
            <span class="inline-block" style="width: 120px">{{ key }}</span> -
            <span>{{ ifFunction(value) ? "함수임" : value }}</span>
          </li>
        </ul>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();

const ifFunction = (value) => typeof value === "function";
</script>

<style lang="scss" scoped>
.target {
  height: 200px;
  background-color: black;
}
@media (max-width: $breakpoint-xs-max) {
  .target {
    background-color: red;
  }
}
.target {
  body.screen--sm & {
    background-color: orange;
  }
}
</style>
