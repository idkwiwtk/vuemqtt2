<template>
  <div class="projects">
    <h1 class="subheading grey--text">Project</h1>
    <v-container>
      <v-row>
        <v-col
          v-for="(stc, index) in stcList"
          :key="index"
          cols="12"
          sm="4"
          lg="3"
        >
          <Stc :stc="stc" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import Stc from '../components/Stc.vue';

export default {
  name: 'Projects',
  components: {Stc},
  data: () => ({
    projects: [
      {title: 'Site web', person: 'xhaled', due: '10/10/1987', status: 'complete'},
      {title: 'Site web', person: 'xhaled', due: '10/10/1987', status: 'complete'},
      {title: 'Site web', person: 'xhaled', due: '10/10/1987', status: 'complete'},
      {title: 'Site web', person: 'xhaled', due: '10/10/1987', status: 'complete'},
    ],
    stcList: [
      {id: "stc1", mqttState: 'disconnect'},
      {id: "stc2", mqttState: 'disconnect'},
      //{id: "stc3"},
      //{id: "stc4"},
      //{id: "stc5"},
    ],
  }),

  methods: {
    sortBy(prop) {
      this.projects.sort((a, b) => a[prop] < b[prop] ? -1: 1);
    }
  }
}
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}
.project.no {
  border-left: 4px solid orange;
}
.project.up {
  border-left: 4px solid red;
}
.project.yes {
  border-left: 4px solid yellow;
}
</style>