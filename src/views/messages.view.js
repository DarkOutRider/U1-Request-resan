export function renderMessagesPage({ itemsHtml }) {
  return `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Meddelanden</title>

  <style>
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .meta {
      color: #666;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .actions {
      margin-top: 12px;
    }

    a {
      text-decoration: none;
      color: blue;
    }
  </style>
</head>

<body>
  <h1>📨 Sparade meddelanden</h1>

  <p>
    <a href="/">← Tillbaka till formuläret</a>
  </p>

  <ul>
    ${itemsHtml || '<li>Inga meddelanden hittades.</li>'}
  </ul>
</body>
</html>`;
}