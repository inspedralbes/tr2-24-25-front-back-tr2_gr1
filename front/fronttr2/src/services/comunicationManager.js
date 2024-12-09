export const crearAssociacio = async (nom, desc) => {
    try {
        const response = await fetch('http://localhost:3000/api/associacio', {
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
}

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