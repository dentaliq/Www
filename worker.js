addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const AB = 'رمز البوت الخاص بك في تيليجرام'; // ضع رمز البوت هنا
  const BC = 'معرف المحادثة التي تريد إرسال الرسائل إليها'; // ضع معرف المحادثة هنا
  
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  
  try {
    const data = await request.json();
    const message = JSON.stringify(data, null, 2);
    
    const telegramApiUrl = `https://api.telegram.org/bot${AB}/sendMessage`;
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: BC,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    if (telegramResponse.ok) {
      return new Response('Success', { status: 200 });
    } else {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      return new Response('Error sending message to Telegram', { status: 500 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
