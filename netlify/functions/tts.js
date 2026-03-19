exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { text, voice_id } = JSON.parse(event.body);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    return { statusCode: response.status, body: err };
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio: base64 })
  };
};
