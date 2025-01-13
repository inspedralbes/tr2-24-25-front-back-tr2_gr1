import dotenv from 'dotenv';

dotenv.config();

// routes/motocicletes.js
import express from 'express';
import path from 'path';
import Message from '../models/Messaje.js';

// Crear un nou missatge
export async function createMessage(data) {
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

    const newMessage = new Message({
      idAsso: data.idAsso,
      idUser: data.idUser,
      message: data.message,
      date: data.date,
    });

    const messageGuardat = await newMessage.save();
    return { valid: true, message: messageGuardat };
  } catch (error) {
    return { valid: false, error };
  }
};

// Obtenir uns missatges per ID
export async function getMessagesByAssoId(idAsso) {
  try {
    const messages = await Message.find({ idAsso });
    console.log(JSON.stringify(messages));
    return { valid: true, messages: messages };
  } catch (error) {
    return { valid: false, error };
  }
};

// Actualitzar un missatge per ID
// export async function updateMessageById(id, data) {
//   try {
//     // let imatgePath = req.body.imatge || '';

//     // // Gestionar la pujada de la imatge si se'n proporciona una de nova
//     // if (req.files && req.files.imatge) {
//     //   const imatge = req.files.imatge;
//     //   const uploadPath = path.join(__dirname, '..', 'upload', imatge.name);

//     //   await imatge.mv(uploadPath);
//     //   imatgePath = `/upload/${imatge.name}`;
//     // }

//     const messageActualitzat = await Message.findByIdAndUpdate(
//       id,
//       {
//         idAsso: data.idAsso,
        // idUser: data.idUser,
        // message: data.message,
        // date: data.date,
//       },
//       { new: true }
//     );

//     if (!messageActualitzat) return { valid: false, message: 'Message no trobat' };

//     return { valid: true, messageActualitzat };
//   } catch (error) {
//     return { valid: false, error };
//   }
// };

// Eliminar un missatge per ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const messageEliminat = await Message.findByIdAndDelete(req.params.id);
//     if (!messageEliminat) return res.status(404).json({ missatge: 'Message no trobat' });
//     res.json({ missatge: 'Message eliminada' });
//   } catch (error) {
//     res.status(500).json({ missatge: 'Error al eliminar el message', error });
//   }
// });
