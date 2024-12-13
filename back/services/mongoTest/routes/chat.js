

// routes/motocicletes.js
import express from 'express';
import path from 'path';
import Chat from '../models/Chat.js';

const router = express.Router();

router.use(express.json());

// Crear una nova motocicleta
router.post('/', async (req, res) => {
  try {
    // let imatgePath = '';

    // // Gestionar la pujada de la imatge
    // if (req.files && req.files.imatge) {
    //   const imatge = req.files.imatge;
    //   const uploadPath = path.join(__dirname, '..', 'upload', imatge.name);

    //   await imatge.mv(uploadPath);
    //   imatgePath = `/upload/${imatge.name}`;
    // }

    console.log(req.body);

    const newChat = new Chat({
      participants: req.body.participants,
      idAsso: req.body.idAsso,
    });

    const chatGuardat = await newChat.save();
    res.status(201).json(chatGuardat);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al crear el chat', error });
  }
});

// Obtenir totes els chats
router.get('/', async (req, res) => {
  try {
    const motos = await Chat.find();
    res.json(motos);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al obtenir els chats', error });
  }
});

// Obtenir un chat per ID
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ missatge: 'Chat no trobat' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al obtenir el chat', error });
  }
});

// Actualitzar una motocicleta per ID
router.put('/:id', async (req, res) => {
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
      req.params.id,
      {
        participants: req.body.participants,
        idAsso: req.body.idAsso,
      },
      { new: true }
    );

    if (!chatActualitzat) return res.status(404).json({ missatge: 'Chat no trobat' });

    res.json(chatActualitzat);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al actualitzar el chat', error });
  }
});

// Eliminar una motocicleta per ID
router.delete('/:id', async (req, res) => {
  try {
    const chatEliminat = await Chat.findByIdAndDelete(req.params.id);
    if (!chatEliminat) return res.status(404).json({ missatge: 'Chat no trobat' });
    res.json({ missatge: 'Chat eliminada' });
  } catch (error) {
    res.status(500).json({ missatge: 'Error al eliminar el chat', error });
  }
});

export default router;
