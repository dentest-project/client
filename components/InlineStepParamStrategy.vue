<template>
  <v-speed-dial v-model="activated" direction="right">
    <template v-slot:activator>
      <v-btn v-model="activated" :color="$colors.primary" dark fab x-small>
        <v-icon v-if="activated">mdi-close</v-icon>
        <v-icon
          v-else-if="stepPartStrategy === 'choices'"
          title="Defined choices"
        >
          mdi-format-list-bulleted
        </v-icon>
        <v-icon
          v-else-if="stepPartStrategy === 'free'"
          title="Free text param"
        >
          mdi-message
        </v-icon>
      </v-btn>
    </template>
    <free-inline-param-button @click="onFreeSelected" />
    <choices-inline-param-button @click="onChoicesSelected" />
  </v-speed-dial>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ChoicesInlineParamButton from '~/components/buttons/ChoicesInlineParamButton.vue'
import FreeInlineParamButton from '~/components/buttons/FreeInlineParamButton.vue'
import { StepPartStrategy } from '~/types'

export default Vue.extend({
  model: {
    prop: 'stepPartStrategy',
  },
  components: {
    ChoicesInlineParamButton,
    FreeInlineParamButton,
  },
  props: {
    stepPartStrategy: {
      type: String,
      required: true,
    } as PropOptions<StepPartStrategy>,
  },
  data() {
    return {
      activated: false,
    }
  },
  methods: {
    onFreeSelected() {
      this.$emit('input', StepPartStrategy.Free)
    },
    onChoicesSelected() {
      this.$emit('input', StepPartStrategy.Choices)
    }
  },
})
</script>
