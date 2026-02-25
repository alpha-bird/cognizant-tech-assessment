import React, { useCallback, useState } from "react";
import { callOpenAI, callHuggingFace } from "./apis";

type Provider = "openai" | "huggingface";

interface ChatMessage {
  id: string;
  provider: Provider;
  prompt: string;
  response: string;
  error?: string;
  createdAt: string;
}

export const App: React.FC = () => {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const trimmed = prompt.trim();
      if (!trimmed || loading) return;

      setLoading(true);
      setError(null);
      setCurrentResponse(null);

      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const createdAt = new Date().toISOString();

      try {
        const responseText =
          provider === "openai"
            ? await callOpenAI(trimmed)
            : await callHuggingFace(trimmed);

        const message: ChatMessage = {
          id,
          provider,
          prompt: trimmed,
          response: responseText,
          createdAt
        };

        setCurrentResponse(responseText);
        setHistory((prev) => [message, ...prev]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred.";
        setError(message);

        const historyItem: ChatMessage = {
          id,
          provider,
          prompt: trimmed,
          response: "",
          error: message,
          createdAt
        };
        setHistory((prev) => [historyItem, ...prev]);
      } finally {
        setLoading(false);
      }
    },
    [prompt, provider, loading]
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setCurrentResponse(null);
    setError(null);
  }, []);

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>AI-integrated web app</h1>
          <p className="subtitle">
            Lightweight React app to send prompts to OpenAI or HuggingFace and
            view responses.
          </p>
        </div>
        <span className="badge">Assessment</span>
      </header>

      <main className="layout">
        <section className="card card--primary">
          <form onSubmit={handleSubmit} className="prompt-form">
            <div className="field-group">
              <label className="field-label" htmlFor="provider">
                Provider
              </label>
              <select
                id="provider"
                className="select"
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
              >
                <option value="openai">OpenAI (Chat Completions)</option>
                <option value="huggingface">
                  HuggingFace (Inference API)
                </option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="prompt">
                Prompt
              </label>
              <textarea
                id="prompt"
                className="textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask a question, describe a task, or paste any text you want the model to respond to..."
                rows={5}
              />
            </div>

            <div className="actions-row">
              <button
                type="submit"
                className="button button--primary"
                disabled={loading || !prompt.trim()}
              >
                {loading ? "Sending..." : "Send Prompt"}
              </button>

              <button
                type="button"
                className="button button--ghost"
                onClick={handleClearHistory}
                disabled={history.length === 0 && !currentResponse && !error}
              >
                Clear
              </button>
            </div>

            <div className="status-row">
              {loading && (
                <span className="status status--info">
                  Contacting {provider === "openai" ? "OpenAI" : "HuggingFace"}…
                </span>
              )}
              {error && !loading && (
                <span className="status status--error">
                  Error: {error}
                </span>
              )}
            </div>
          </form>

          <section className="response-section">
            <h2 className="section-title">Latest response</h2>
            {!currentResponse && !error && (
              <p className="muted">
                Submit a prompt to see the model&apos;s response here.
              </p>
            )}
            {(currentResponse || error) && (
              <div className="response-box">
                {currentResponse && !error && (
                  <pre className="response-text">{currentResponse}</pre>
                )}
                {error && (
                  <pre className="response-text response-text--error">
                    {error}
                  </pre>
                )}
              </div>
            )}
          </section>
        </section>

        <section className="card card--secondary">
          <header className="history-header">
            <h2 className="section-title">History (this session)</h2>
            <span className="pill">{history.length}</span>
          </header>

          {history.length === 0 ? (
            <p className="muted">
              No prompts yet. Each prompt and response will be saved here so you
              can quickly review previous interactions.
            </p>
          ) : (
            <ul className="history-list">
              {history.map((item) => (
                <li key={item.id} className="history-item">
                  <div className="history-meta">
                    <span className="history-provider">
                      {item.provider === "openai" ? "OpenAI" : "HuggingFace"}
                    </span>
                    <span className="history-time">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="history-body">
                    <div className="history-prompt">
                      <span className="label">Prompt:</span>
                      <p>{item.prompt}</p>
                    </div>
                    <div className="history-response">
                      <span className="label">
                        {item.error ? "Error:" : "Response:"}
                      </span>
                      <p className={item.error ? "error-text" : ""}>
                        {item.error || item.response}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p className="muted">
          Note: For production use, proxy API calls through a backend instead of
          exposing API keys in the browser. This app is for local demos only.
        </p>
      </footer>
    </div>
  );
};
