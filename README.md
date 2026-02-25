## Cognizant Frontend Engineer Technical Assessment

**Objective**

Create a **lightweight app** where a user can input a prompt, submit it to an AI API (e.g., OpenAI), and receive/display a response. Focus on:

- Prompt input + submit button ✅
- Fetching from OpenAI or HuggingFace ✅
- Displaying results dynamically ✅
- Error handling and loading states ✅

**Bonus (+10 pts)**
- Save and show past prompts/responses (chat history) ✅
- Include a “Clear” button for the user ✅

---

Built with **React + TypeScript + Vite**

---

### 1. Getting started

#### 1.1 Prerequisites

- Node.js (LTS recommended, e.g. 18+)
- npm or pnpm or yarn (examples below use npm)
- An API key for **OpenAI** and/or **HuggingFace**

#### 1.2 Install dependencies


```bash
npm install
```

#### 1.3 Configure environment variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Inside `.env.local`, you can configure:

```bash
# OpenAI (Chat Completions)
VITE_OPENAI_API_KEY=sk-...

# HuggingFace Inference API
VITE_HF_API_KEY=hf_...
```

- **At least one** of these must be set.
- If you only want OpenAI, you can omit the HuggingFace key (and vice versa).

> **Important (security)**: Vite exposes `VITE_` variables to the browser bundle.
> This is acceptable for **local experiments only**. For any real application,
> we should proxy API calls through a backend so our keys are never sent to the browser.

#### 1.4 Run the dev server

```bash
npm run dev
```

Open the printed local URL (by default `http://localhost:3000`) in your browser.

---

### 2. How the app works (high-level)

- **React + Vite + TypeScript**
  - `vite.config.ts` sets up React via `@vitejs/plugin-react-swc`.
  - `tsconfig.json` configures strict TypeScript compilation for `src/`.
  - `index.html` injects `src/main.tsx`, which renders the root React tree.

- **Core UI**
  - The app is a **single page** rendered by `src/App.tsx`.
  - Styles live in `src/styles.css` and give it a clean, modern dark UI.

- **AI providers**
  - You can switch between:
    - **OpenAI** (`VITE_OPENAI_API_KEY`, `https://api.openai.com/v1/chat/completions`)
    - **HuggingFace** (`VITE_HF_API_KEY`, `https://api-inference.huggingface.co/models/gpt-2`)

---

### 3. Main components & logic

#### 3.1 Entry point: `src/main.tsx`

- Bootstraps React and renders the `App` component:

```startLine:endLine:src/main.tsx
// main React entrypoint (Vite injects this from index.html)
```

#### 3.2 App component: `src/App.tsx`

The `App` component owns all UI and state:

- **State**:
  - `provider: "openai" | "huggingface"` – which backend to call.
  - `prompt: string` – current text in the textarea.
  - `currentResponse: string | null` – latest answer shown in the “Latest response” panel.
  - `error: string | null` – last error message (if any).
  - `loading: boolean` – whether a request is in flight.
  - `history: ChatMessage[]` – in-session chat history.

- **ChatMessage shape**:

```ts
interface ChatMessage {
  id: string;
  provider: "openai" | "huggingface";
  prompt: string;
  response: string;
  error?: string;
  createdAt: string;
}
```

Each history entry records:

- which **provider** was used,
- the original **prompt**,
- the model **response** (or empty string on error),
- an optional **error**,
- and a timestamp.

---

### 4. Quick recap

- **Prompt input + submit button**: textarea + “Send Prompt” in `App.tsx`.
- **Fetching from OpenAI or HuggingFace**: `callOpenAI` and `callHuggingFace`
  choose an endpoint based on provider and use `fetch`.
- **Dynamic results**: response panel immediately reflects the latest answer.
- **Error & loading**: clearly indicated via button label, status chip, and
  styled error text.
- **Bonus features**:
  - **Chat history**: in-memory history list for this session.
  - **Clear button**: wipes history + current response/error in one click.

Run `npm run dev`, enter a prompt, select a provider, and see
responses come back in real time. Enjoy experimenting with the APIs!
