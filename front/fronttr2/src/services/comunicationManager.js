import { useLoggedUsers } from "@/stores/users";
import bcrypt from "bcryptjs";

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
        console.log('Dades enviades (abans del hash): ', { nom, cognoms, contrasenya, correu, imatge, permisos });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasenya, salt);

        console.log('Contrasenya encriptada: ', hashedPassword);

        const response = await fetch(`${URL}/api/usuari`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom,
                cognoms,
                contrasenya: hashedPassword,
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
            console.log(response)
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


export const getPropostes = async () => {
    try {
        const response = await fetch(`${URL}/api/proposta`);
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
    try {
        const response = await fetch(`${URL}/api/proposta/${id}`);
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
    try {
      const response = await fetch(`${URL}/api/comentaris/${idProp}`);
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
    try {
      const response = await fetch(`http://localhost:3000/api/comentaris/${idProp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    try {
      const response = await fetch('http://localhost:3000/api/votacions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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