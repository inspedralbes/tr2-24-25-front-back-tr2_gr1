<template>
    <div>
      <button @click="runCommand" class="bg-red-600">Ejecutar Comando</button>
      <div v-if="loading">Cargando...</div>
      <div v-if="error" style="color: red;">{{ error }}</div>
      <div v-if="output">
        <h2>Resultado:</h2>
        <pre>{{ output }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        output: '',    // Almacenará la salida del comando
        error: '',     // Almacenará los errores (si los hay)
        loading: false // Estado de carga
      };
    },
    methods: {
      async runCommand() {
        this.loading = true;
        this.error = '';
        this.output = '';
  
        try {
          const response = await fetch('http://localhost:3001/runCommand', {
            method: 'POST',
          });
          const data = await response.json();
  
          if (data.success) {
            this.output = data.output; // Mostrar la salida del comando
          } else {
            this.error = data.error; // Mostrar el error si hubo alguno
          }
        } catch (err) {
          this.error = 'Error al ejecutar el comando';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  