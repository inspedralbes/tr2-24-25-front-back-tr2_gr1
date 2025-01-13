<template>
    <div class="min-h-[90vh] flex justify-center items-center bg-[--main-color]">
        <Card class="p-6 w-5/6 sm:w-80 rounded-lg shadow-lg backdrop-blur-md bg-[--secondary-light-color] bg-opacity-70">
            <div class="flex justify-center">
                <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4 w-full">
                    <div class="flex flex-col gap-1">
                        <input v-model="form.nom" type="text" placeholder="Nom" class="p-inputtext p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#57A2A2]" />
                        <p v-if="errors.nom" class="error-message">{{ errors.nom }}</p>
                    </div>

                    <div class="flex flex-col gap-1">
                        <input v-model="form.cognoms" type="text" placeholder="Cognoms" class="p-inputtext p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#57A2A2]" />
                        <p v-if="errors.cognoms" class="error-message">{{ errors.cognoms }}</p>
                    </div>

                    <div class="flex flex-col gap-1">
                        <input v-model="form.contrasenya" type="password" placeholder="Contrasenya" class="p-inputtext p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#57A2A2]" />
                        <p v-if="errors.contrasenya" class="error-message">{{ errors.contrasenya }}</p>
                    </div>

                    <div class="flex flex-col gap-1">
                        <input v-model="form.correu" type="email" placeholder="Correu" class="p-inputtext p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#57A2A2]" />
                        <p v-if="errors.correu" class="error-message">{{ errors.correu }}</p>
                    </div>

                    <button type="submit" class="p-button p-component bg-[#57A2A2] text-white py-2 px-4 rounded-md hover:bg-[#459191] transition-colors">Registrar</button>
                </form>
            </div>
        </Card>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUser } from '@/services/comunicationManager';
import Card from 'primevue/card';
import { hashPassword } from '@/services/hasher';
export default {
    setup() {
        const router = useRouter();

        const form = ref({
            nom: '',
            cognoms: '',
            contrasenya: '',
            correu: '',
        });

        const errors = ref({
            nom: null,
            cognoms: null,
            contrasenya: null,
            correu: null,
        });

        const validateForm = () => {
            let isValid = true;
            errors.value = {
                nom: form.value.nom ? null : 'El nom és obligatori.',
                cognoms: form.value.cognoms ? null : 'Els cognoms són obligatoris.',
                contrasenya:
                    form.value.contrasenya.length >= 6
                        ? null
                        : 'La contrasenya ha de tenir almenys 6 caràcters.',
                correu: form.value.correu.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                    ? null
                    : 'El correu no és vàlid.',
            };

            for (const key in errors.value) {
                if (errors.value[key]) isValid = false;
            }

            return isValid;
        };

        const onFormSubmit = async () => {
            if (validateForm()) {
                try {
                    const hashedPassword= await hashPassword(form.value.contrasenya)
                   
                    const response = await createUser({
                        nom: form.value.nom,
                        cognoms: form.value.cognoms,
                        contrasenya: hashedPassword,
                        correu: form.value.correu,
                        imatge: 'default-image.png',
                        permisos: 'user',
                    });
                    if(response.state==true){
                        router.push('/noticies');
                    }
                } catch (error) {
                    console.error('Error al crear el usuari:', error);
                }
            }
        };

        return { form, errors, onFormSubmit };
    },
};
</script>

<style scoped>
.card {
    padding: 20px;
    background-color: var(--main-color);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: var(--bold-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

button {
    background-color: var(--secondary-dark-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: var(--secondary-dark-color);
}

input:focus {
    border-color: var(--secondary-light-color);
    box-shadow: 0 0 0 2px var(--secondary-light-color);
}
</style>
