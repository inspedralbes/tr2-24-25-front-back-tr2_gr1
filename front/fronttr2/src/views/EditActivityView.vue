<template>
    <div class="screen-container">
      <Card>
        <template #title>Editar Proposta</template>
        <template #content>
          <div class="card flex flex-wrap justify-center items-end gap-4">
            <FloatLabel variant="in">
              <label for="titol_label">Títol</label>
              <InputText id="titol_label" v-model="titol" autocomplete="off" />
            </FloatLabel>
          </div>
  
          <div class="card flex flex-wrap justify-center items-end gap-4">
            <FloatLabel variant="in">
              <label for="subtitol_label">Subtítol</label>
              <InputText id="subtitol_label" v-model="subtitol" autocomplete="off" />
            </FloatLabel>
          </div>
  
          <div class="card flex flex-wrap justify-center items-end gap-4">
            <FloatLabel variant="in">
              <label for="contingut_label">Contingut</label>
              <InputText id="contingut_label" v-model="contingut" autocomplete="off" />
            </FloatLabel>
          </div>
  
          <div class="card flex flex-wrap justify-center items-end gap-4">
            <label for="color_picker">Color de la Proposta</label>
            <ColorPicker id="color_picker" v-model="color" format="hex" />
          </div>
  
          <div class="card flex flex-wrap justify-center items-end gap-4">
            <Button 
              class="button secondary-button" 
              label="Guardar" 
              icon="pi pi-save" 
              iconPos="left" 
              :loading="loading" 
              @click="updateProposta"
            />
          </div>
          <Dialog :visible="visible" modal header="Atenció" :style="{ width: '25rem' }" class="bg-white">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Es requereixen tots els camps obligatoris</span>
            <div class="flex justify-end gap-2">
              <Button class="button secondary-button" type="button" label="Entesos" @click="visible = false" />
            </div>
          </Dialog>
  
          <Dialog :visible="successVisible" modal header="Actualitzat" :style="{ width: '25rem' }" class="bg-white">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">La proposta s'ha actualitzat correctament</span>
            <div class="flex justify-end gap-2">
              <Button class="button secondary-button" type="button" label="Entesos" @click="successVisible = false" />
            </div>
          </Dialog>
  
          <Dialog :visible="errorVisible" modal header="Error" :style="{ width: '25rem' }" class="bg-white">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Hi ha hagut un error en actualitzar la proposta</span>
            <div class="flex justify-end gap-2">
              <Button class="button secondary-button" type="button" label="Entesos" @click="errorVisible = false" />
            </div>
          </Dialog>
        </template>
      </Card>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import ColorPicker from 'primevue/colorpicker';
import { fetchPropostaById, updatePropostaApi } from '@/services/comunicationManager';

const route = useRoute();
const router = useRouter();

const propostaId = route.params.id;
const titol = ref('');
const subtitol = ref('');
const contingut = ref('');
const color = ref('#FFFFFF');
const loading = ref(false);
const visible = ref(false);
const successVisible = ref(false);
const errorVisible = ref(false);

onMounted(async () => {
  try {
    const proposta = await fetchPropostaById(propostaId);
    if (proposta && proposta.titol) {
      titol.value = proposta.titol;
      subtitol.value = proposta.subtitol;
      contingut.value = proposta.contingut;
      color.value = proposta.color || '#FFFFFF';
    } else {
      throw new Error('Proposta no válida');
    }
  } catch (error) {
    console.error('Error loading proposal data:', error);
  }
});

async function updateProposta() {
  if (!titol.value || !subtitol.value || !contingut.value) {
    visible.value = true;
    return;
  }

  loading.value = true;
  try {
    await updatePropostaApi({
      id: propostaId,
      titol: titol.value,
      subtitol: subtitol.value,
      contingut: contingut.value,
      autor: 1,
      idAsso: 1,
      data: new Date().toISOString().split('T')[0],
    });
    successVisible.value = true
  } catch (error) {
    console.error('Error al actualizar la proposta:', error);
    errorVisible.value = true;
  } finally {
    loading.value = false;
  }
}
</script>
  
  <style scoped>
  .screen-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    height: 100vh;
    padding: 10px;
    background-color: var(--main-color);
  }
  
  .card {
    padding: 10px;
    max-width: 400px;
    width: 100%;
    color: var(--accent-light-color);
  }
  
  .secondary-button {
    background-color: var(--secondary-light-color) !important;
    border-color: var(--secondary-light-color) !important;
    color: white !important;
  }
  
  .secondary-button:hover {
    filter: brightness(90%);
  }
  </style>  