export default {
  async fetch(request, env) {
    try {
      // قراءة المتغيرات البيئية
      const BOT_TOKEN = env.AB;
      const CHAT_ID = env.BC;

      if (!BOT_TOKEN || !CHAT_ID) {
        return new Response("Missing BOT_TOKEN or CHAT_ID", { status: 400 });
      }

      // قراءة الرسالة من الطلب (POST body أو query)
      let message = "";
      if (request.method === "POST") {
        const data = await request.json();
        message = data.message || JSON.stringify(data);
      } else {
        const url = new URL(request.url);
        message = url.searchParams.get("msg") || "No message provided";
      }

      // إرسال الرسالة إلى بوت تيليجرام
      const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const payload = {
        chat_id: CHAT_ID,
        text: message,
      };

      const telegramResponse = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await telegramResponse.json();
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  },
};
