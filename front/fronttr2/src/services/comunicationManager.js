const URL = import.meta.env.VITE_API_ROUTE;
const URLNOTICIAS = 'http://localhost:3002';

export const crearAssociacio = async (nom, desc) => {
    try {
        const response = await fetch(`${URL}/api/associacio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom: nom, descripcio: desc }),
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

        const response = await fetch(`${URL}/api/usuari`, {
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
    try {
        const response = await fetch('http://localhost:3000/api/usuari', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No es va poder obtenir la llista d\'usuaris');
        }

        const users = await response.json();

        const user = users.find((u) => u.correu === correu);

        if (user && user.contrasenya === contrasenya) {
            console.log('Usuari autenticat amb èxit');
            return true;
        }

        console.error('Usuari o contrasenya incorrectes');
        return false;
    } catch (error) {
        console.error('Error al intentar autenticar:', error);
        return false;
    }
};

export const getNoticies = async () => {
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia`);
        if (response.ok) {
            const data = await response.json();
            console.log('Noticies:', data);
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

export const getNoticia = async (id) => {
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Noticia:', data);
            return data;
        } else {
            console.error('Unexpected error', response.status);
            return null;
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
        throw err;
    }
};

export const createNoticia = async ({ titol, subtitol, contingut, imatge, autor, idAsso }) => {
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titol, subtitol, contingut, imatge, autor, idAsso }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Noticia created successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const editNoticia = async ({ id, titol, subtitol, contingut, imatge, autor, idAsso }) => {
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titol, subtitol, contingut, imatge, autor, idAsso }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Noticia edited successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const deleteNoticia = async (id) => {
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Noticia deleted successfully');
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const getActivities=async () => {
    try {
        const response = await fetch('http://localhost:3000/api/activities', {
            
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No es poden obtenir activitats del calendari');
        }

        const activities = await response.json();

        console.log("holiwi"+activities)

        return activities
       

        
    } catch (error) {
        console.error('Error al intentar conseguir activitats: ', error);
        return false;
    }
};