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