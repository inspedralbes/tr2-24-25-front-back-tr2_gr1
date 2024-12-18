import { useLoggedUsers } from "@/stores/users";
import bcrypt from "bcryptjs";
import router from "@/router";

const URL = import.meta.env.VITE_API_ROUTE;
const URLNOTICIAS = 'http://localhost:3002';

export const crearAssociacio = async (nom, desc) => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        const response = await fetch(`${URL}/api/associacio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ nom: nom, descripcio: desc }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Associacio created successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else if (response.status === 401) {
            noLogged();
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const getAssociacions = async () => {
    const loggedUsersStore = useLoggedUsers();
    let user = loggedUsersStore.getUser();
    try {
        const response = await fetch(`${URL}/api/associacio`, {
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Associacions:', data);
            return data;
        } else if (response.status === 401) {
            noLogged();
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
        console.log('Dades enviades (abans del hash): ', { nom, cognoms, contrasenya, correu, imatge, permisos });

       
        console.log('Contrasenya encriptada: ', contrasenya);

        const response = await fetch(`${URL}/api/usuari`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom,
                cognoms,
                contrasenya: contrasenya,
                correu,
                imatge,
                permisos,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuari creat amb èxit:', data);
            let returnData = await loginUsuari(data.correu, contrasenya);
            console.log(returnData);
            return returnData;
        } else if (response.status === 400) {
            const errorDetails = await response.json();
            console.error('Error 400: Input no vàlid:', errorDetails);
            throw new Error(errorDetails.message || 'Input no vàlid');
        } else if (response.status === 401) {
            noLogged();
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
    console.log(contrasenya)
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
            console.log(response);
            throw new Error(`L'inici de sessió ha fallat`);
        }

        const user = await response.json();

        const currentAssiciacio = 0;

        loggedUsersStore.newUser({
            token: user.token,
            nom: user.nom,
            cognoms: user.cognoms,
            correu: user.correu,
            associacionsId: user.associacionsId,
            currentAssiciacio
        });

        console.log(loggedUsersStore.users);

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

export const getNoticies = async () => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        const response = await fetch(`${URLNOTICIAS}/api/noticia`, {
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Noticies:', data);
            return data;
        } else if (response.status === 401) {
            noLogged();
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
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Noticia:', data);
            return data;
        } else if (response.status === 401) {
            noLogged();
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
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        const response = await fetch(`${URLNOTICIAS}/api/noticia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ titol, subtitol, contingut, imatge, autor, idAsso }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Noticia created successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else if (response.status === 401) {
            noLogged();
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const editNoticia = async ({ id, titol, subtitol, contingut, imatge, autor, idAsso }) => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ titol, subtitol, contingut, imatge, autor, idAsso }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Noticia edited successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else if (response.status === 401) {
            noLogged();
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const deleteNoticia = async (id) => {
    const loggedUsersStore = useLoggedUsers();
    let user = loggedUsersStore.getUser();
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        });
        if (response.ok) {
            console.log('Noticia deleted successfully');
        } else if (response.status === 401) {
            noLogged();
        } else {
            console.error('Unexpected error', response.status);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
};

export const getActivities = async () => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser()
        if (user.token == undefined || user.token == false || user.token == null || user.token == false) {
            noLogged
        }
        else {
            const response = await fetch('http://localhost:3000/api/activities', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    noLogged();
                } else {
                    throw new Error('No es poden obtenir activitats del calendari');
                }
            }

            const activities = await response.json();

            console.log("holiwi" + activities);

            return activities;
        }

    } catch (error) {
        console.error('Error al intentar conseguir activitats: ', error);
        if (!user) {
            noLogged()
        }
        return false;
    }
};

export const checkToken = async () => {
    const loggedUsersStore = useLoggedUsers();
    let user = loggedUsersStore.getUser();
    console.log(user);
    if (!user) {
        console.log("PINGAPONGA")
        noLogged
        return {"status": 401}
    }
    else {
        console.log("bababoi")
        const response = await fetch(`${URL}/prova`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
        });
        console.log("Response" + response);
        if (response.status === 401) {
            noLogged();
        }
        let responseJson = await response.json();
        console.log("respondoe" + responseJson);
        return responseJson;
    }
};

export const noLogged = async () => {
    console.log("Pal lobby")
    const loggedUsersStore = useLoggedUsers();
    loggedUsersStore.emptyUser();
    router.push('/login');
};