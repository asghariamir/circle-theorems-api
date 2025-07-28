// This is a Node.js function that will run on the server.
export default async function handler(request, response) {
  // Get the prompt and image data from the frontend's request.
  const { prompt, base64ImageData } = request.body;

  // Securely get your secret API key from the server's environment variables.
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Prepare the payload to send to the real Google AI API.
  let userParts = [{ text: prompt }];
  if (base64ImageData) {
      userParts.push({
          inlineData: {
              mimeType: "image/png",
              data: base64ImageData
          }
      });
  }
  const payload = { contents: [{ role: "user", parts: userParts }] };

  try {
    // Call the Google AI API from the server.
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await geminiResponse.json();
    // Send the AI's response back to your frontend.
    response.status(200).json(data);
  } catch (error) {
    // If something goes wrong, send an error message back.
    response.status(500).json({ error: 'Failed to call AI model' });
  }
}
