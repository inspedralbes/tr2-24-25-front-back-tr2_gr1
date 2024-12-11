<template>
    <div class="main">
      <h1>{{ proposta?.titol || 'Cargando...' }}</h1>
      <h3>{{ proposta?.subtitol || 'Cargando...' }}</h3>
      <p>{{ proposta?.contingut || 'Cargando contenido...' }}</p>
      <p class="author" v-if="proposta?.autor?.nomUsuari">
        Per {{ proposta.autor.nomUsuari }} el {{ proposta.data }}
      </p>
  
      <div class="comments-section">
        <h2>Comentaris</h2>
        <div v-if="comments.length === 0">No hi ha comentaris encara.</div>
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <p><strong>{{ comment.autor.nomUsuari }}</strong></p>
          <p>{{ comment.contingut }}</p>
        </div>
        
        <div class="add-comment">
          <textarea v-model="newComment" placeholder="Escribe tu comentario..." rows="4"></textarea>
          <button @click="submitComment" :disabled="!newComment.trim()">Añadir Comentario</button>
        </div>
      </div>
    </div>
    <NavigationBar />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getPropostaById, getComentarios, addComentario } from '@/services/comunicationManager.js';
  import NavigationBar from '@/components/NavigationBar.vue';
  
  const props = defineProps({
    id: {
      type: String,
      required: true
    }
  });
  
  const proposta = ref({});
  const comments = ref([]);
  const newComment = ref("");
  
  onMounted(async () => {
    try {
      const id = props.id;
      console.log('Fetching proposal with ID:', id);
      proposta.value = await getPropostaById(id);
  
      if (!proposta.value) {
        console.error('Proposal not found');
      }
  
      comments.value = await getComentarios(id);
    } catch (error) {
      console.error('Error fetching proposal or comments:', error);
    }
  });
  
  const submitComment = async () => {
    try {
      const id = props.id;
      const comment = newComment.value;
  
      const addedComment = await addComentario(id, comment);
  
      comments.value.push(addedComment);
  
      newComment.value = "";
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  </script>
  
  <style scoped>
  .main {
    background-color: var(--main-color);
    padding: 1rem;
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }
  
  h1 {
    color: var(--secondary-dark-color);
    font-size: 2rem;
  }
  
  h3 {
    color: var(--secondary-light-color);
    font-size: 1.5rem;
  }
  
  p {
    color: var(--bold-color);
    font-size: 1.2rem;
  }
  
  .author {
    font-size: 0.75rem;
  }
  
  .comments-section {
    margin-top: 2rem;
  }
  
  .comment {
    background-color: var(--accent-light-color);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
  }
  
  .comment p {
    margin: 0;
  }
  
  .add-comment {
    margin-top: 2rem;
  }
  
  .add-comment textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .add-comment button {
    margin-top: 10px;
    padding: 10px;
    background-color: var(--secondary-light-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .add-comment button:disabled {
    background-color: #ccc;
  }
  </style>  