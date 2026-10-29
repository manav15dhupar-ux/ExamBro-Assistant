# 📚 Exam Bro

Exam Bro is an AI-powered study helper. Paste your class notes (or type a topic), choose an answer style, and it generates a **summary**, a **5-question quiz**, and **6 flashcards** using the Google Gemini API.

Built for Web Technology CA, Assignment 5.

**Live demo:** `<>`

## Features

- **AI study material**: summary, multiple-choice quiz, and flashcards generated from your notes
- **Answer styles**: Explain like I'm 10, Exam-focused, or Detailed
- **Summary tools**: copy to clipboard, download as `.txt`, read aloud (text-to-speech) with a stop button
- **Interactive quiz**: instant correct/wrong feedback and a running score
- **Flashcards**: click to flip, previous/next navigation, and Known / Not Known tracking
- **History**: past results are saved in your browser and can be reopened with one click
- **Dark / Light mode**: preference is remembered
- **Character counter** for your notes
- **Error handling**: clear messages for invalid API key, rate limits, network problems, and malformed AI replies
- **Responsive design** for desktop and mobile

## Tech Stack

- HTML5
- CSS3 (CSS variables, flexbox, media queries)
- Vanilla JavaScript (ES6, `fetch`, async/await)
- Google Gemini API (`gemini-2.5-flash`)
- Browser APIs: `localStorage`, Clipboard API, Web Speech API (`SpeechSynthesis`), Blob

## Project Structure

```
├── index.html   # Page structure
├── style.css    # Styling, dark mode, responsive layout
├── script.js    # App logic, API call, quiz, flashcards, history
└── README.md
```

## How to Run Locally

1. Download or clone this repository.
2. Open `index.html` in any modern browser (no build step or server needed).

## How to Use

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Paste the key in **Settings** and click **Save Key**.
3. Paste your notes into **Your Notes** and pick an **Answer Style**.
4. Click **Generate Study Material**.
5. Switch between the **Summary**, **Quiz**, and **Flashcards** tabs.
6. Click any item in **History** to reload an earlier result.

## How It Works

1. `buildPrompt()` creates a prompt asking Gemini to reply only in a fixed JSON format.
2. `callGemini()` sends a POST request to the Gemini `generateContent` endpoint.
3. `parseResult()` validates the JSON (summary, quiz, flashcards).
4. The result is rendered into the three tabs and saved to `localStorage` history.

## Notes on API Key Security

The API key is entered by the user and stored only in their own browser (`localStorage`). It is never committed to the code or sent anywhere except directly to Google's API. Do **not** hardcode your key into `script.js` before publishing.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Invalid API key" | Re-check the key in Settings and save it again |
| "Too many requests" | Free-tier rate limit hit; wait a minute and retry |
| "Not in the correct format" | The AI reply was malformed; click Generate again |
| Model error / 404 | Model names change; update `MODEL` in `script.js` using the Gemini docs |

## Future Improvements

- Upload PDF or image notes
- Export quiz and flashcards
- Per-item delete in history

## Author

`<MANAV DHUPAR`