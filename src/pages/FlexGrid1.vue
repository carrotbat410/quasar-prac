<template>
  <q-page class="q-pa-xl">
    <section class="q-mb-xl">
      <div class="text-h4">FlexBox - Col</div>
      <q-separator class="q-my-md" />
    </section>
    <section class="q-mb-xl">
      <div class="text-h4">Toolbar</div>
      <q-separator class="q-my-md" />
      <div
        class="row items-center justify-between bg-primary q-pa-sm"
        :style="{ minHeight: '50px' }"
      >
        <div class="row items-center">
          <q-btn icon="menu" flat dense round color="white"></q-btn>
          <span class="text-h6 text-weight-bold text-white">Quasar App</span>
        </div>
        <q-btn icon="light_mode" flat dense round color="white"></q-btn>
      </div>
      <div class="text-h4">FlexBox - Row</div>
      <q-separator class="q-my-md" />
      <div class="row bg-yellow inline">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>
      <q-separator class="q-my-md" />
      <div class="row inline">
        <div v-for="n in 4" :key="n" class="square">{{ n }}</div>
      </div>
      <q-separator class="q-my-md" />
      <div class="row inline no-wrap">
        <div v-for="n in 17" :key="n" class="square">{{ n }}</div>
      </div>
    </section>
    <section class="q-mb-xl">
      <div class="text-h4">FlexBox - Column</div>
      <q-separator class="q-my-md" />
      <div class="column inline">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>
    </section>
  </q-page>
</template>

<script setup></script>

<style lang="scss" scoped>
.square {
  height: 80px;
  width: 80px;
  background-color: $primary;
  border: 1px solid black;
  display: inline-block;
  font-weight: 900;
  color: #fff;
}
</style>
