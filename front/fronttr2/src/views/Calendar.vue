<template>
  <div class="main">
    <div style="display: flex; justify-content: center">
      <VCalendar
        class="my-calendar"
        :style="{ backgroundColor: 'var(--accent-light-color)', width: '90%' }"
        :attributes="attrs"
        @dayclick="onDayClickHandler"
            />
          </div>
            <Dialog
            v-model:visible="visible"
            header="Event Details"
            :style="{ width: '70%', backgroundColor: 'var(--accent-light-color)', color: 'black' }"
            modal
            :closable="false"
            >
            <template #header>
              <div class="dialog-header">
                <span>Activitats del dia {{ new Date(dayData[0].dates).toLocaleDateString() }}</span>
                <button class="custom-close-button" @click="changeValueDayData()">
            <i class="pi pi-times" style="color: black;"></i>
            
          </button>
              </div>
      </template>
      
      <div v-for="(data, index) in dayData" :key="index">
        <h3 :style="{ color: data.bar }"><a :href="data.link" >{{ data.label }}</a></h3>
        
      </div>
      
    </Dialog>
    <button @click="getActivities">TEST</button>
  </div>
  <NavigationBar />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import NavigationBar from "@/components/NavigationBar.vue";
import Dialog from "primevue/dialog";
import {getActivities} from "@/services/comunicationManager.js"

const attrs = ref([]);
const dayData = ref([]);
const visible = ref(false);

watch(dayData, (newVal) => {
  visible.value = newVal.length > 0;
});

function changeValueDayData(){
  dayData.value=[]
}
function onDayClickHandler({ date }) {
  console.log("Day clicked", date);
  console.log(attrs.value);
  let auxArray = [];
  attrs.value.forEach((element) => {
    if (new Date(element.dates).toLocaleDateString('en-GB') == new Date(date).toLocaleDateString('en-GB')) {
      console.log("HOLA ESTOY ENTRANDO")
      auxArray.push(element);
    }
  });
  dayData.value = auxArray;
  console.log("this is dayDAta", dayData);
  //   if(dayData){
  //     console.log(dayData.popover.label);
  //   }
}

function transformEventsToDates(date) {
  date.forEach((element) => {
    attrs.value.push({
      dates: element.date,
      bar: element.color,
      link: element.link,
      label: element.label,
    });
  });
}

onMounted(async () => {
  const events= await getActivities();
  
  transformEventsToDates(events);
});
</script>

<style>
.vc-weekday {
  color: var(--accent-dark-color);
  font-size: 1.5rem;
}

.vc-base-icon {
  stroke: var(--accent-dark-color) !important;
}

.vc-day-content {
  font-size: 1.5rem;
}


</style>

<style scoped>
.main {
  background-color: var(--main-color);
  padding: 1rem;
  padding-bottom: 8rem;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  height: calc(100vh - 4rem);
  overflow-y: auto;
}

.dialog-header {
  width: 100%;
  display: grid;
  grid-template-columns: 9fr 1fr;
}

.custom-close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem; /* Adjust size as needed */
}

.custom-close-button i {
  font-size: 1.5rem;
  color: black;
}
</style>
