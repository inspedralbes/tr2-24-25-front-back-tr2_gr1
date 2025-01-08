import bcrypt from "bcryptjs";
import router from "@/router";
import { useLoggedUsers } from "@/stores/users";

const URL = import.meta.env.VITE_API_ROUTE;
const URLNOTICIAS = import.meta.env.VITE_NEWS_ROUTE;
const URLPROPOSTES = import.meta.env.VITE_ACTIVITY_ROUTE;

export const crearAssociacio = async (nom, desc) => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URL}/api/associacio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
    let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
    try {
        const response = await fetch(`${URL}/api/associacio`, {
            headers: {
                'Authorization': 'Bearer ' + token
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

export async function loginUsuari(correu, contrasenya) {
    try {
        const response = await fetch(`${URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correu, contrasenya }),
        });

        if (!response.ok) {
            throw new Error('Error en el login');
        }

        const user = await response.json();

        const currentAssiciacio = 0;

        const loggedUsersStore = useLoggedUsers();

        loggedUsersStore.newUser({
            token: user.token,
            id: user.id,
            nom: user.nom,
            cognoms: user.cognoms,
            correu: user.correu,
            contrasenya: user.contrasenya,
            imatge: user.imatge,
            permisos: user.permisos,
            associacionsId: user.associacionsId,
            currentAssiciacio
        });

        console.log('Usuari autenticat amb èxit', user.associacionsId);

        console.log(loggedUsersStore.currentUser);

        if (response.ok) {
            console.log('Usuari autenticat amb èxit');
            return { state: true, associacionsId: user.associacionsId };
        } else {
            console.error('Usuari o contrasenya incorrectes');
            return { state: false };
        }

    } catch (error) {
        console.error('Error al intentar autenticar:', error);
        return { state: false };
    }
};

export const updateUsuari = async (id, nom, cognoms, contrasenya, correu, imatge, permisos, token) => {
    try{
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URL}/api/usuari`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id,
                nom,
                cognoms,
                contrasenya,
                correu,
                imatge,
                permisos
            })
        });

        if (response.ok) {
            console.log('Usuari actualitzat amb èxit: ', response);
        } else if (response.status === 404) {
            console.log('Usuari no trobat: ', response);
        } else {
            console.log('Dades incorrectes: ', response);
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
        throw err;
    }
};

export const getPropostes = async () => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URLPROPOSTES}/api/proposta`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Propostes:', data);
            return data.map(item => ({
                id: item.id,
                titol: item.titol,
                subtitol: item.subtitol,
                contingut: item.contingut,
                autor: item.autor,
                data: new Date(item.data).toLocaleDateString(),
            }));
        } else {
            console.error('Unexpected error', response.status);
            return [];
        }
    } catch (err) {
        console.error('Error during fetch: ', err);
        throw err;
    }
};

export const getPropostaById = async (id) => {
    const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
    try {
        const response = await fetch(`${URLPROPOSTES}/api/proposta/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            const data = await response.json();
            return {
                id: data.id,
                titol: data.titol,
                subtitol: data.subtitol,
                contingut: data.contingut,
                autor: data.autor,
                data: new Date(data.data).toLocaleDateString(),
            };
        } else {
            console.error('Proposal not found', response.status);
            return null;
        }
    } catch (err) {
        console.error('Error fetching proposal:', err);
        throw err;
    }
};

export const getComentarios = async (idProp) => {
    const loggedUsersStore = useLoggedUsers();
    let user = loggedUsersStore.getUser();
    let token="";
    if (user.token == undefined || user.token == false || user.token == null) {
        noLogged
    } else {
        token = user.token;
    }
    try {
      const response = await fetch(`${URLPROPOSTES}/api/comentaris/${idProp}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
      if (response.ok) {
        const data = await response.json();
        console.log('Comentarios:', data);
        return data;
      } else {
        console.error('Error fetching comments:', response.status);
        return [];
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      throw err;
    }
  };
  
  export const addComentario = async (idProp, comentario) => {
    const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
    try {
      if (!currentUser.value || token=="") {
        throw new Error('No se encontró el token. El usuario no está autenticado.');
      }
  
      const response = await fetch(`${URLPROPOSTES}/api/comentaris/${idProp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${currentUser.value.token}`,
        },
        body: JSON.stringify({ contenido: comentario }),
      });
  
      if (!response.ok) {
        throw new Error('Error al añadir el comentario');
      }
  
      const data = await response.json();
      console.log('Comentario añadido:', data);
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  export async function submitVotacio(idProposta, idUsuari, resposta) {
    const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
    try {
      const response = await fetch(`${URLPROPOSTES}/api/votacions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProp: idProposta,
          idUsu: idUsuari,
          resposta: resposta,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar la votación');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al enviar la votación:', error);
      throw error;
    }
  }

export const getNoticies = async () => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URLNOTICIAS}/api/noticia`, {
            headers: {
                'Authorization': 'Bearer ' + token
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
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
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
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URLNOTICIAS}/api/noticia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
    let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
    try {
        const response = await fetch(`${URLNOTICIAS}/api/noticia/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
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

export const asignaUsuariAssociacio = async (idUsu, idAsso) => {
    try {

        
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        const response = await fetch('http://localhost:3000/asignaUsuariAssociacio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ idUsu, idAsso }),
        });

        if (!response.ok) {
            throw new Error('Error al asignar usuario a la asociación.');
        }
        const data = await response.json();
        loggedUsersStore.currentUser.currentAssiciacio = idAsso;
        loggedUsersStore.currentUser.associacionsId.push(idAsso);
        return data;
    } catch (error) {
        console.error('Error en la asignación de usuario:', error);
        throw error;
    }
};

export const getActivities = async () => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
        
            let currentAssiciacio=user.currentAssiciacio
            // user.currentAsso
            const response = await fetch(`${URLPROPOSTES}/api/activities/`+user.currentAssiciacio, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
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



    } catch (error) {
        console.error('Error al intentar conseguir activitats: ', error);
        if (user==undefined||!user) {
            noLogged()
        }
        return false;
    }
};

export const crearProposta = async (titol, subtitol, contingut, idAsso, data, color) => {
    try {
        const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
      const response = await fetch(`${URLPROPOSTES}/api/proposta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titol,
          subtitol,
          contingut,
          autor: 1,
          idAsso: idAsso || 1,
          data,
          color,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Proposta creada correctamente:', data);
        return data;
      } else {
        console.error('Error al crear la proposta:', response.status);
        throw new Error('Error al crear la proposta');
      }
    } catch (err) {
      console.error('Error durante la petición:', err);
      throw err;
    }
};  

export const checkToken = async () => {
    const loggedUsersStore = useLoggedUsers();
        let user = loggedUsersStore.getUser();
        let token="";
        if (user.token == undefined || user.token == false || user.token == null) {
            noLogged
        } else {
            token = user.token;
        }
    console.log(user);
    if (user==undefined||!user) {
        noLogged
        return {"status": 401}
    }
    else {
        console.log("bababoi")
        const response = await fetch(`${URL}/prova`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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