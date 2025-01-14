<template>
  <div class="main">
    <h1>{{ proposta?.titol || 'Cargando...' }}</h1>
    <h3>{{ proposta?.subtitol || 'Cargando...' }}</h3>
    <p>{{ proposta?.contingut || 'Cargando contenido...' }}</p>
    <p class="author" v-if="proposta?.autor?.nomUsuari">
      Per {{ proposta.autor.nomUsuari }} el {{ proposta.data }}
    </p>

    <div class="vote-section">
      <h3>Vota:</h3>
      <button @click="vote('aFavor')" :disabled="voted" class="vote-button a-favor">A favor</button>
      <button @click="vote('enContra')" :disabled="voted" class="vote-button en-contra">En contra</button>
      <p v-if="voted" class="vote-message">Ja has votat</p>
    </div>

    <div class="comments-section">
      <h2>Comentaris</h2>
      <div v-if="comments.length === 0">Encara no hi ha comentaris.</div>
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p><strong>{{ comment.autor.nomUsuari }}</strong></p>
        <p>{{ comment.contingut }}</p>
      </div>
    </div>

    <div class="add-comment">
      <textarea
        v-model="newComment"
        placeholder="Escriu el teu comentari..."
        rows="1"
        ref="textarea"
        @input="autoResize"
      ></textarea>
      <button @click="submitComment" :disabled="!newComment.trim()">Afegir Comentari</button>
    </div>
  </div>
  <NavigationBar />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { io } from 'socket.io-client';
import { getPropostaById, getComentarios, addComentario, submitVotacio } from '@/services/comunicationManager.js';
import NavigationBar from '@/components/NavigationBar.vue';
import { useLoggedUsers } from '@/stores/users';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const proposta = ref({});
const comments = ref([]);
const newComment = ref('');
const textarea = ref(null);
const voted = ref(false);

const loggedUsersStore = useLoggedUsers();
const socket = io('http://localhost:3003');

onMounted(async () => {
  try {
    const id = props.id;
    proposta.value = await getPropostaById(id);

    if (!proposta.value) {
      console.error('Proposal not found');
    }

    comments.value = await getComentarios(id);

    socket.on('newComment', (data) => {
      if (data.idProp === id) {
        comments.value.unshift(data.newComment);
      }
    });
  } catch (error) {
    console.error('Error fetching proposal or comments:', error);
  }
});

onUnmounted(() => {
  socket.disconnect();
});

const submitComment = async () => {
  try {
    const id = props.id;
    const comment = newComment.value;

    const userId = loggedUsersStore.currentUser?.id;
    if (!userId) {
      alert('Debes iniciar sesión para añadir un comentario.');
      return;
    }

    await addComentario(id, comment);

    newComment.value = '';
    await nextTick();
    autoResize();
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

const autoResize = () => {
  const el = textarea.value;
  if (el) {
    el.style.height = 'auto';
    const screenHeight = window.innerHeight;
    const limitHeight = screenHeight <= 768 ? 300 : 500;
    const scrollHeight = el.scrollHeight;
    if (scrollHeight <= limitHeight) {
      el.style.height = `${scrollHeight}px`;
    } else {
      el.style.height = `${limitHeight}px`;
      el.style.overflowY = 'auto';
    }
  }
};

const vote = async (option) => {
  if (voted.value) return;

  const resposta = option === 'aFavor';

  try {
    const propostaId = proposta.value.id;
    const userId = loggedUsersStore.currentUser?.id;

    if (!userId) {
      alert('Debes iniciar sesión para votar.');
      return;
    }

    await submitVotacio(propostaId, userId, resposta);

    voted.value = true;

    console.log(`Voto registrado: ${resposta ? 'A favor' : 'En contra'}`);
  } catch (error) {
    console.error('Error al registrar la votación:', error);
  }
};
</script>

<style scoped>
.main {
  background-color: var(--main-color);
  padding: 1rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  overflow-y: auto;
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
  padding-bottom: 165px;
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
  position: fixed;
  bottom: 65px;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: var(--main-color);
  z-index: 1000;
}

.add-comment textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
  overflow: hidden;
  user-select: text;
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

.vote-section {
  margin-top: 2rem;
  text-align: center;
}

.vote-button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.vote-button.a-favor {
  background-color: var(--secondary-light-color);
  color: white;
}

.vote-button.en-contra {
  background-color: var(--secondary-light-color);
  color: white;
}

.vote-button:disabled {
  background-color: #ccc;
}

.vote-message {
  margin-top: 10px;
  font-size: 1rem;
  color: #333;
}
</style>