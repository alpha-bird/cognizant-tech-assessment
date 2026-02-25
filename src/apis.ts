export async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      "Missing VITE_OPENAI_API_KEY. Set it in a .env.local file in the project root."
    );
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-5.2",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const content =
    data.choices?.[0]?.message?.content ??
    "[No content returned from OpenAI response]";
  return content;
}

export async function callHuggingFace(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_HF_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      "Missing VITE_HF_API_KEY. Set it in a .env.local file in the project root."
    );
  }

  const res = await fetch(
    "https://api-inference.huggingface.co/models/gpt-2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 64,
          temperature: 0.7
        }
      })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HuggingFace error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const text =
    Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : JSON.stringify(data);
  return text;
}
