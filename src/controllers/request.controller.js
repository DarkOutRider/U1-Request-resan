import { supabase } from '../lib/supabase.js';
import { clampString } from '../utils/sanitize.js';
import { escapeHtml } from '../utils/html.js';

import { renderFormPage } from '../views/form.view.js';
import { renderReceivedPage } from '../views/received.view.js';
import { renderMessagesPage } from '../views/messages.view.js';
import { renderEditPage } from '../views/edit.view.js';


// Visa formulär
export async function showForm(req, res) {
  res.type('html').send(renderFormPage());
}


// Skicka nytt meddelande
export async function sendMessage(req, res) {

  const nameRaw = clampString(req.body?.name, 50);
  const messageRaw = clampString(req.body?.message, 500);

  if (!nameRaw || !messageRaw) {
    return res
      .status(400)
      .type('html')
      .send(`
        <p>Fel: saknar namn eller meddelande.</p>
        <p><a href="/">Tillbaka</a></p>
      `);
  }

  const userAgent = clampString(req.get('user-agent'), 200);
  const ip = clampString(req.ip, 60);

  const { error } = await supabase
    .from('request_messages')
    .insert([
      {
        name: nameRaw,
        message: messageRaw,
        user_agent: userAgent,
        ip
      }
    ]);

  if (error) {
    console.error('[supabase] insert error:', error);

    return res
      .status(500)
      .type('html')
      .send(`
        <p>Serverfel när vi skulle spara i databasen.</p>
        <p><a href="/">Tillbaka</a></p>
      `);
  }

  // Escape för säker HTML
  const safeName = escapeHtml(nameRaw);

  const safeMessage = escapeHtml(messageRaw)
    .replaceAll('\n', '<br/>');

  res.type('html').send(
    renderReceivedPage({
      name: safeName,
      message: safeMessage
    })
  );
}


// Visa lista med meddelanden
export async function listMessages(req, res) {

  const { data, error } = await supabase
    .from('request_messages')
    .select('id, created_at, name, message')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[supabase] select error:', error);

    return res
      .status(500)
      .type('html')
      .send(`
        <p>Serverfel när vi skulle läsa från databasen.</p>
        <p><a href="/">Tillbaka</a></p>
      `);
  }

  const itemsHtml = (data || [])
    .map((row) => {

      const when = escapeHtml(
        new Date(row.created_at).toLocaleString('sv-SE')
      );

      const n = escapeHtml(row.name);

      const m = escapeHtml(row.message)
        .replaceAll('\n', '<br/>');

      return `
        <li>
          <div class="meta">
            <strong>#${row.id}</strong> · ${when}
          </div>

          <div>
            <strong>${n}</strong>
          </div>

          <div style="margin-top:8px;">
            ${m}
          </div>

          <div class="actions">
            <a href="/messages/${row.id}/edit">
              ✏️ Redigera
            </a>
          </div>
        </li>
      `;
    })
    .join('');

  res.type('html').send(
    renderMessagesPage({ itemsHtml })
  );
}


// Visa edit-formulär
export async function showEditForm(req, res) {

  const { id } = req.params;

  const { data, error } = await supabase
    .from('request_messages')
    .select('id, name, message')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res
      .status(404)
      .send('Inlägget hittades inte.');
  }

  res.type('html').send(
    renderEditPage(data)
  );
}


// Uppdatera meddelande
export async function updateMessage(req, res) {

  const { id } = req.params;

  const nameRaw = clampString(req.body?.name, 50);
  const messageRaw = clampString(req.body?.message, 500);

  if (!nameRaw || !messageRaw) {
    return res
      .status(400)
      .send('Namn och meddelande krävs.');
  }

  const { error } = await supabase
    .from('request_messages')
    .update({
      name: nameRaw,
      message: messageRaw
    })
    .eq('id', id);

  if (error) {
    console.error('[supabase] update error:', error);

    return res
      .status(500)
      .send('Kunde inte uppdatera.');
  }

  res.redirect('/messages');
}