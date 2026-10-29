# 📚 Exam Bro

**Exam Bro** is an AI-powered study assistant that helps students learn more efficiently. Paste your class notes or enter a topic, choose an answer style, and generate a **summary, a 5-question quiz, and 6 flashcards** using the Google Gemini API.

Built for **Web Technology CA — Assignment 5**.

🔗 **Live Demo:** [Exam Bro](https://manav15dhupar-ux.github.io/ExamBro-Assistant/)

---

## ✨ Features

- 📝 **AI Summarization:** Convert lengthy notes into concise, easy-to-understand summaries.
- 🧠 **Quiz Generation:** Generate a 5-question quiz to test your understanding.
- 🗂️ **Flashcards:** Create 6 flashcards for quick revision.
- 🎯 **Custom Answer Styles:** Choose a suitable style for your study needs.
- 🌙 **Dark Mode:** Switch between light and dark themes.
- 📱 **Responsive Design:** Use the application on desktops, tablets, and mobile devices.
- ⚠️ **Error Handling:** Display loading states and useful error messages.
- 💾 **Local Storage:** Remember supported preferences in your browser.

---

## 🛠️ Technologies Used

- **HTML5** — Webpage structure
- **CSS3** — Styling, responsive layouts, and dark mode
- **JavaScript (ES6+)** — Application logic and API requests
- **Google Gemini API** — AI-powered study content generation
- **Browser Local Storage** — Saving supported preferences and user-provided API key

---

## 🚀 Getting Started

### Prerequisites

You need:
- A modern web browser
- An internet connection
- A Google Gemini API key

### 1. Get an API Key

Create an API key through [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Open Exam Bro

Visit the deployed application:

**[Launch Exam Bro](https://manav15dhupar-ux.github.io/ExamBro-Assistant/)**

### 3. Enter Your API Key

Enter your Gemini API key in the application's API key section.

### 4. Generate Study Material

1. Paste your class notes or enter a topic.
2. Select your preferred answer style.
3. Generate a summary, quiz, or flashcards using the available options.
4. Review the generated content to prepare for exams.

---

## 💻 Run Locally

To run the project on your computer:

```bash
git clone https://github.com/manav15dhupar-ux/ExamBro-Assistant.git
cd ExamBro-Assistant
```

Open `index.html` in your browser.

If the project uses JavaScript modules or browser features that require an HTTP server, run it using the **Live Server** extension in Visual Studio Code instead.

---

## 📁 Project Structure

```text
ExamBro-Assistant/
├── index.html      # Main webpage
├── style.css       # Styling and responsive design
├── script.js       # Application logic and Gemini API integration
└── README.md       # Project documentation
```

---

## 🔐 API Key Security

Exam Bro allows users to enter their own Google Gemini API key.

- The key is stored in the user's browser using `localStorage` if the application implements this functionality.
- The application uses the key to make requests to the Google Gemini API.
- Never commit a personal API key to a public repository.
- Anyone with access to the browser profile may be able to inspect a key stored in `localStorage`.
- Browser-side API keys are not fully protected from misuse. Apply appropriate restrictions and usage limits through Google AI Studio where supported.

**Important:** Do not hardcode a personal API key in `script.js` or publish it in the repository.

---

## 🌐 Deployment

This project is deployed using **GitHub Pages**.

To enable or configure deployment:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and the `/(root)` folder.
5. Click **Save**.
6. Wait for the deployment to complete.

Once deployed, access the application here:

**[https://manav15dhupar-ux.github.io/ExamBro-Assistant/](https://manav15dhupar-ux.github.io/ExamBro-Assistant/)**

---

## 📌 Limitations

- An internet connection is required for Gemini API requests.
- API usage is subject to Google's applicable quotas and terms.
- AI-generated content may contain inaccuracies. Verify important information against your course materials.
- GitHub Pages hosts the frontend as a static website; it does not provide a backend server for this project.

---

## 👨‍💻 Author

**Manav Dhupar**

- GitHub: [@manav15dhupar-ux](https://github.com/manav15dhupar-ux)

---

⭐ If you find Exam Bro useful, consider starring the repository!