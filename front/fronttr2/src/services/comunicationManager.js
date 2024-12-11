import { useLoggedUsers } from "@/stores/users";

const URL = import.meta.env.VITE_API_ROUTE;

export const crearAssociacio = async (nom, desc) => {
    try {
        const response = await fetch(`${URL}/api/associacio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nom: nom, descripcio: desc}),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Associacio created successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const getAssociacions = async () => {
    try {
        const response = await fetch(`${URL}/api/associacio`);
        if (response.ok) {
            const data = await response.json();
            console.log('Associacions:', data);
            return data;
        } else {
            console.error('Unexpected error', response.status);
            return [];
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
        throw err;
    }
};

export const createUser = async ({ nom, cognoms, contrasenya, correu, imatge, permisos }) => {
    try {
        console.log('Datos enviados:', { nom, cognoms, contrasenya, correu, imatge, permisos });

        const response = await fetch('http://localhost:3000/api/usuari', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom,
                cognoms,
                contrasenya,
                correu,
                imatge,
                permisos,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuari creat amb èxit:', data);
            return data;
        } else if (response.status === 400) {
            const errorDetails = await response.json();
            console.error('Error 400: Input no vàlid:', errorDetails);
            throw new Error(errorDetails.message || 'Input no vàlid');
        } else {
            console.error('Error inesperat:', response.status);
            throw new Error('Unexpected error occurred');
        }
    } catch (err) {
        console.error('Error en el fetch:', err);
        throw err;
    }
};


export const loginUsuari = async (correu, contrasenya) => {
    const loggedUsersStore = useLoggedUsers();
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correu,
                contrasenya
            })
        });

        if (!response.ok) {
            throw new Error(`L'inici de sessió ha fallat`);
        }

        const user = await response.json();

        loggedUsersStore.newUser({
            token: user.token,
            nom: user.nom,
            cognoms: user.cognoms,
            correu: user.correu,
            associacionsId: user.associacionsId,
        });

        if (response.ok) {
            console.log('Usuari autenticat amb èxit');
            return true;
        } else {
            console.error('Usuari o contrasenya incorrectes');
            return false;
        }
        
    } catch (error) {
        console.error('Error al intentar autenticar:', error);
        return false;
    }
};