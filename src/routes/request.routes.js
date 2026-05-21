import { Router } from 'express';
import { listMessages, sendMessage, showForm } from '../controllers/request.controller.js';

export const requestRoutes = Router();

requestRoutes.get('/', showForm);
requestRoutes.post('/send', sendMessage);
requestRoutes.get('/messages', listMessages);

// request.routes.js
import { showEditForm, updateMessage } from '../controllers/request.controller.js';

// ... tidigare routes
requestRoutes.get('/edit/:id', showEditForm);
requestRoutes.post('/update/:id', updateMessage);