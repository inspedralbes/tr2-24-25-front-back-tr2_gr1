<template>
    <div>
        <main>
            <div v-if="loading">Cargando noticias...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <!-- Componente para controlar el microservicio -->
                <MicroserviceControl />

                <div v-for="noticia in noticies" :key="noticia.id" class="noticia-card">
                    <img :src="noticia.imatge" :alt="noticia.titol" />
                    <h2>{{ noticia.titol }}</h2>
                    <h3>{{ noticia.subtitol }}</h3>
                    <p>Autor ID: {{ noticia.autor }}</p>
                    <p>Asociación ID: {{ noticia.idAsso }}</p>
                    <p>Creado el: {{ formatDate(noticia.createdAt) }}</p>
                    <p>Actualizado el: {{ formatDate(noticia.updatedAt) }}</p>
                </div>
            </div>
        </main>
        <footer>
            <NavigationBar />
        </footer>
    </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import MicroserviceControl from '@/components/MicroserviceControl.vue';  // Importa el componente
import { getNoticies } from '@/services/comunicationManager';

export default {
    components: {
        NavigationBar,
        MicroserviceControl,  // Registra el componente
    },
    data() {
        return {
            noticies: [],
            loading: true,
            error: null,
        };
    },
    methods: {
        async fetchNoticies() {
            try {
                const data = await getNoticies();
                if (!data || !data.data) {
                    throw new Error('Formato de respuesta incorrecto');
                }
                this.noticies = data.data;
            } catch (err) {
                this.error = `Error al cargar noticias: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
    mounted() {
        this.fetchNoticies();
    },
};
</script>

<style>
.noticia-card {
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
}

.noticia-card img {
    width: 100%;
    height: auto;
    margin-bottom: 8px;
    border-radius: 4px;
}
</style>
    