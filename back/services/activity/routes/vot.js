

// routes/motocicletes.js
import express from 'express';
import path from 'path';
import Vot from '../models/Vot.js';

// Crear una nova motocicleta
export async function createVot(data) {
    try {
        // let imatgePath = '';

        // // Gestionar la pujada de la imatge
        // if (req.files && req.files.imatge) {
        //   const imatge = req.files.imatge;
        //   const uploadPath = path.join(__dirname, '..', 'upload', imatge.name);

        //   await imatge.mv(uploadPath);
        //   imatgePath = `/upload/${imatge.name}`;
        // }

        console.log(data);

        const newVot = new Vot({
            idActivitat: data.idProp,
            idUsuari: data.idUsu,
            vot: data.resposta,
        });

        const votGuardat = await newVot.save();
        return { valid: true, votGuardat };
    } catch (error) {
        return { valid: false, error };
    }
};

// Obtenir un vot per ID
export async function getVotByActUserID(idAct, idUser) {
    try {
        console.log("buscant vot");
        const vot = await Vot.findOne({ idActivitat: idAct, idUsuari: idUser });
        console.log(vot);
        if (!vot) return { valid: true, message: 'Vot no trobat' };
        return { valid: false, message: 'Ja has votat' };
    } catch (error) {
        return { valid: false, message: "Error", error };
    }
};

// Actualitzar una motocicleta per ID
export async function updateVotById(id, data) {
    try {
        // let imatgePath = req.body.imatge || '';

        // // Gestionar la pujada de la imatge si se'n proporciona una de nova
        // if (req.files && req.files.imatge) {
        //   const imatge = req.files.imatge;
        //   const uploadPath = path.join(__dirname, '..', 'upload', imatge.name);

        //   await imatge.mv(uploadPath);
        //   imatgePath = `/upload/${imatge.name}`;
        // }

        const votActualitzat = await Vot.findByIdAndUpdate(
            id,
            {
                idActivitat: data.idActivitat,
                idUsuari: data.idUsuari,
                vot: data.vot,
            },
            { new: true }
        );

        if (!votActualitzat) return { valid: false, message: 'Vot no trobat' };

        return { valid: true, votActualitzat };
    } catch (error) {
        return { valid: false, error };
    }
};

// Eliminar una motocicleta per ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const votEliminat = await Vot.findByIdAndDelete(req.params.id);
//     if (!votEliminat) return res.status(404).json({ missatge: 'Vot no trobat' });
//     res.json({ missatge: 'Vot eliminada' });
//   } catch (error) {
//     res.status(500).json({ missatge: 'Error al eliminar el vot', error });
//   }
// });
