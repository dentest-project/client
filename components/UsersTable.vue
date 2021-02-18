<template>
  <div>
    <user-search label="Add user..." @selected="onUserAdd" />
    <v-simple-table dense>
      <template v-slot:default>
        <tbody>
          <users-table-row
            v-for="(user, i) in users"
            :key="i"
            :user="user"
            :mode="mode"
            @change="onUserChanged"
            @delete="onUserDelete"
          />
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import UserSearch from '~/components/UserSearch.vue';
import UsersTableRow from '~/components/UsersTableRow.vue';
import {
  BaseUser,
  OrganizationUser,
  OrganizationUserList, ProjectUser,
  ProjectUserList
} from '~/types';

enum Mode {
  Project = 'project',
  Organization = 'organization'
}

export default Vue.extend({
  components: {
    UserSearch,
    UsersTableRow
  },
  props: {
    users: {
      type: Array,
      required: true
    } as PropOptions<OrganizationUserList | ProjectUserList>,
    mode: {
      type: String,
      required: true
    } as PropOptions<Mode>
  },
  methods: {
    onUserAdd: function (user?: BaseUser) {
      if (user) {
        this.$emit('add', user);
      }
    },
    onUserChanged: function (user: ProjectUser | OrganizationUser) {
      this.$emit('change', user);
    },
    onUserDelete: function (user: BaseUser) {
      this.$emit('delete', user);
    }
  }
});
</script>
