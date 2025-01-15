import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import path from 'path';
import Message from '../models/Messaje.js';

// Crear un nou missatge
export async function createMessage(data) {
  try {
  

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