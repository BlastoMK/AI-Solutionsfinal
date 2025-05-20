import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // Replace with your key
  dangerouslyAllowBrowser: true, // Only for frontend testing (use a backend in production)
});

export const getChatResponse = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Sorry, I couldn’t process your request.";
  }
};