export default async function handler(req, res) {

  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, comment, ua, visitId } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const time = new Date().toLocaleString("fr-FR");

    let text = `💘 Valentine Tracker
🆔 Visit: ${visitId}
📌 Event: ${type}
🌍 IP: ${ip}
🕒 Time: ${time}
📱 Device: ${ua}`;

    if (comment) {
      text += `\n\n💬 Comment:\n${comment}`;
    }

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text
      })
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
