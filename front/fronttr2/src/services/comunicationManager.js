export const crearAssociacio = async (nom, desc) => {
    try {
        const response = await fetch('http://localhost:3000/api/associacio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {nom: nom, descripcio: desc},
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Associacio created successfully:', data);
        } else if (response.status === 400) {
            console.error('Invalid input');
        } else {
            console.error('Unexpected error', response.status);
        }
        loading.value = false;
    } catch (err) {
        console.error('Error during fetch: ', err);
    }
}