// api/gemini.js - UPDATED WITH DIAGNOSTIC LOGS
export default async function handler(request, response) {
  console.log("--- Gemini API Function Started ---");

  try {
    // 1. Get the prompt from the frontend's request.
    const { prompt, base64ImageData } = request.body;
    console.log("Received prompt:", prompt ? "Yes" : "No");
    console.log("Received image data:", base64ImageData ? "Yes" : "No");

    // 2. Securely get your secret API key from the server's environment variables.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("FATAL ERROR: GEMINI_API_KEY environment variable not found!");
        return response.status(500).json({ error: "Server configuration error: API key is missing." });
    }
    console.log(`API Key loaded: Starts with '${apiKey.substring(0, 4)}', Ends with '${apiKey.substring(apiKey.length - 4)}'`);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // 3. Prepare the payload to send to the real Google AI API.
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

    // 4. Call the Google AI API from the server.
    console.log("Calling Google AI API...");
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log("Google AI API response status:", geminiResponse.status, geminiResponse.statusText);
    
    const responseData = await geminiResponse.json();

    if (!geminiResponse.ok) {
        console.error("Google AI API returned an error:", responseData);
        throw new Error(responseData.error?.message || 'Unknown error from Google AI');
    }
    
    console.log("Successfully received data from Google AI.");

    // 5. Send the AI's response back to your frontend.
    response.status(200).json(responseData);
    console.log("--- Gemini API Function Finished Successfully ---");

  } catch (error) {
    console.error("Error in Gemini API function:", error);
    response.status(500).json({ error: error.message || 'Failed to call AI model' });
  }
}
