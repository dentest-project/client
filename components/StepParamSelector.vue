<template>
  <v-speed-dial v-model="activated" direction="right">
    <template v-slot:activator>
      <v-btn v-model="activated" :color="$colors.secondary" dark fab x-small>
        <v-icon v-if="activated">mdi-close</v-icon>
        <v-icon v-else-if="stepParamType === 'multiline'">mdi-text-box</v-icon>
        <v-icon v-else-if="stepParamType === 'table'">mdi-table-large</v-icon>
        <v-icon v-else>mdi-circle-off-outline</v-icon>
      </v-btn>
    </template>
    <none-step-param-type-button @click="onNoneSelected" />
    <multiline-step-param-button @click="onMultilineSelected" />
    <table-step-param-button @click="onTableSelected" />
  </v-speed-dial>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import MultilineStepParamButton from '~/components/buttons/MultilineStepParamButton.vue';
import NoneStepParamTypeButton from '~/components/buttons/NoneStepParamTypeButton.vue';
import TableStepParamButton from '~/components/buttons/TableStepParamButton.vue';
import InlineStepParamForm from '~/components/InlineStepParamForm.vue';
import { StepParamType } from '~/types';

export default Vue.extend({
  components: {
    TableStepParamButton,
    MultilineStepParamButton,
    NoneStepParamTypeButton,
    InlineStepParamForm
  },
  props: {
    stepParamType: {
      type: String,
      required: true
    } as PropOptions<StepParamType>
  },
  data () {
    return {
      activated: false
    }
  },
  methods: {
    onNoneSelected() {
      this.$emit('input', StepParamType.None);
    },
    onMultilineSelected() {
      this.$emit('input', StepParamType.Multiline);
    },
    onTableSelected() {
      this.$emit('input', StepParamType.Table);
    }
  }
});
</script>
