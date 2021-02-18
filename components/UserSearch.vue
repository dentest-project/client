<template>
  <v-autocomplete
    v-model="select"
    :loading="isAutocompleteLoading"
    :items="items"
    :search-input.sync="search"
    :item-text="getItemText"
    :item-value="getItemValue"
    :label="label"
    solo
    hide-no-data
    hide-details
    clearable
    @input="user => $emit('selected', user)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { BaseUser } from '~/types';

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true
    },
    searchWithinOrganization: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isAutocompleteLoading: false,
      items: [] as Array<BaseUser>,
      search: null,
      select: null
    }
  },
  methods: {
    getItemText: function (user: BaseUser): string {
      return user.username;
    },
    getItemValue: function (user: BaseUser): BaseUser {
      return user;
    },
    doSearch: async function (q: string) {
      this.isAutocompleteLoading = true;
      this.items = await this.$api.searchUsers(
        q,
        this.searchWithinOrganization ? this.$route.params.organization_slug : null,
        this.$axios
      );
      this.isAutocompleteLoading = false;
    }
  },
  watch: {
    search: function (val) {
      val && val !== this.select && this.doSearch(val);
    }
  }
});
</script>
