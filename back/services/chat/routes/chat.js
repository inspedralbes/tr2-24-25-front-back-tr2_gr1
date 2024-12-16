

// routes/motocicletes.js
import express from 'express';
import path from 'path';
import Chat from '../models/Chat.js';

// Crear una nova motocicleta
export async function createChat(data) {
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

    const newChat = new Chat({
      participants: data.participants,
      idAsso: data.idAsso,
    });

    const chatGuardat = await newChat.save();
    return { valid: true, chatGuardat };
  } catch (error) {
    return { valid: false, error };
  }
};

// Obtenir un chat per ID
export async function getChatByAssoId(idAsso) {
  try {
    const chat = await Chat.findById({ idAsso });
    console.log(chat);
    if (!chat) return { valid: false, message: 'Chat no trobat' };
    return { valid: true, chat };
  } catch (error) {
    return { valid: false, error };
  }
};

// Actualitzar una motocicleta per ID
export async function updateChatById(id, data) {
  try {
    // let imatgePath = req.body.imatge || '';

    // // Gestionar la pujada de la imatge si se'n proporciona una de nova
    // if (req.files && req.files.imatge) {
    //   const imatge = req.files.imatge;
    //   const uploadPath = path.join(__dirname, '..', 'upload', imatge.name);

    //   await imatge.mv(uploadPath);
    //   imatgePath = `/upload/${imatge.name}`;
    // }

    const chatActualitzat = await Chat.findByIdAndUpdate(
      id,
      {
        participants: data.participants,
        idAsso: data.idAsso,
      },
      { new: true }
    );

    if (!chatActualitzat) return { valid: false, message: 'Chat no trobat' };

    return { valid: true, chatActualitzat };
  } catch (error) {
    return { valid: false, error };
  }
};

// Eliminar una motocicleta per ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const chatEliminat = await Chat.findByIdAndDelete(req.params.id);
//     if (!chatEliminat) return res.status(404).json({ missatge: 'Chat no trobat' });
//     res.json({ missatge: 'Chat eliminada' });
//   } catch (error) {
//     res.status(500).json({ missatge: 'Error al eliminar el chat', error });
//   }
// });
