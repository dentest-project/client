<template>
  <v-dialog width="20rem" :value=value :persistent="true" @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">
        Table dimensions
      </v-card-title>
      <v-card-subtitle>
        This step requires a table param.
      </v-card-subtitle>
      <v-card-text>
        <div class="create-table-step-param">
          <div class="create-table-step-param-wrapper">
            <div v-for="(i, ik) in Array(10)" :key="ik">
              <v-btn
                v-for="(j, jk) in Array(10)"
                class="create-table-step-param-button"
                :class="{ selected: x >= jk && y >= ik }"
                :key="`${ik}-${jk}`"
                @mouseover="onSquareHover(jk, ik)"
                @click="onSquareSelection"
              />
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  model: {
    prop: 'value'
  },
  props: {
    value: Boolean
  },
  data: function () {
    return {
      x: 0,
      y: 0
    }
  },
  methods: {
    onSquareHover (x: number, y: number): void {
      this.x = x;
      this.y = y;
    },
    onSquareSelection (): void {
      this.$emit('selected', this.x, this.y);
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    }
  }
});
</script>

<style scoped>
.create-table-step-param {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-table-step-param-wrapper > div {
  height: 1rem;
  margin: 0.2rem;
}

.create-table-step-param-wrapper .create-table-step-param-button {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  background-color: transparent;
  border: 1px solid #333333;
  margin: 0.1rem;
  padding: 0;
  min-width: 1rem;
}

.create-table-step-param-wrapper .create-table-step-param-button.selected {
  background-color: #AAAAAA !important;
}
</style>
