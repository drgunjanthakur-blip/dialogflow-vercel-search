import OpenAI from "openai";

export default async function handler(req, res) {
  const query = req.body?.queryResult?.parameters?.query || "";

  if (!query) {
    return res.status(200).json({ fulfillmentText: "No query provided." });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Search the web and answer briefly with facts." },
        { role: "user", content: `Search the web for: ${query}` }
      ],
      web: {
        search: { enabled: true }
      }
    });

    const answer = completion.choices[0].message.content;

    res.status(200).json({
      fulfillmentText: answer || "No answer found."
    });

  } catch (error) {
    console.error(error);
    res.status(200).json({ fulfillmentText: "Error using OpenAI API." });
  }
}
