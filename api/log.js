export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).end();

  const { type, comment, visitorId, ua } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
  const time = new Date().toLocaleString("fr-FR");

  let text = `💘 Valentine Tracker
📌 Event: ${type}
🆔 Visitor: ${visitorId}
🌍 IP: ${ip}
📱 Device: ${ua}
🕒 ${time}`;

  if (comment) {
    text += `\n💬 Commentaire:\n${comment}`;
  }

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      chat_id:process.env.TELEGRAM_CHAT_ID,
      text
    })
  });

  res.status(200).json({ ok:true });
}
