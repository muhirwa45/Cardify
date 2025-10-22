# Cardify - Offline-First Flashcard App

Cardify is a modern, offline-first flashcard application designed for efficient learning through a Spaced Repetition System (SRS). It allows you to create, manage, and study flashcard decks with a beautiful, responsive interface. All your data is stored locally in your browser, ensuring you can study anytime, anywhere, without an internet connection.

<img width="584" height="463" alt="image" src="https://github.com/user-attachments/assets/e9aa701d-7dc8-462d-b639-92851916c38f" />


## ✨ Key Features

- **Offline-First:** All decks and study progress are saved in your browser's local storage. No account or internet connection is required after the initial load.
- **Spaced Repetition System (SRS):** An intelligent algorithm schedules card reviews at increasing intervals to maximize memory retention and learning efficiency.
- **Create & Edit Decks:** Easily create new decks, add cards manually, or edit existing decks on the fly.
- **Import from File:** Quickly build new decks by importing cards from `.csv` or `.txt` files.
- **Engaging Study Sessions:** A clean, focused interface for reviewing cards with smooth flip animations.
- **Progress Tracking:** Visualize your study habits with a GitHub-style activity heatmap and a weekly calendar that shows upcoming reviews.
- **Deck Search:** Quickly find the deck you're looking for with a built-in search feature.
- **Customizable Themes:** Personalize your learning environment with multiple themes, including light, dark, green, yellow, and dark blue modes.
- **Fully Responsive:** Enjoy a seamless experience on desktop, tablet, or mobile devices.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) with TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Data Persistence:** Browser `localStorage` API

## 🚀 How to Use

### 1. Creating a New Deck

1.  Navigate to the **Study** tab using the bottom navigation bar.
2.  Click the **New Deck** button.
3.  In the modal that appears, give your deck a name.
4.  Add your cards in the text area, with each card on a new line. Separate the front and back of each card with a semicolon (`;`).
    ```
    Hola;Hello
    Adiós;Goodbye
    Gracias;Thank you
    ```
5.  Click **Create Deck**.

### 2. Importing a Deck from a File

1.  Go to the **Study** tab.
2.  Click the **Import** button.
3.  Enter a name for your new deck.
4.  Click the upload area to select a `.txt` or `.csv` file from your device.
5.  The file should contain one flashcard per line, with the front and back separated by a semicolon (`;`) or a comma (`,`).
    **Example (`.txt` or `.csv`):**
    ```
    useState,"Manages state in a functional component"
    useEffect,"Performs side effects in functional components"
    ```
6.  Once the file is successfully parsed, click **Import Deck**.

### 3. Studying a Deck

1.  From the **Home** or **Study** tab, find the deck you want to review.
2.  Click the **Study** or **Study Now** button.
3.  The study session will begin, showing you new cards and cards that are due for review.
4.  Click **Show Answer** to flip the card.
5.  Rate your recall of the answer using one of the four options: **Again, Hard, Good,** or **Easy**. The SRS algorithm will use your rating to schedule the next review for that card.
6.  Continue until you've completed the session!

### 4. Customizing the Theme

1.  Navigate to the **Settings** tab.
2.  Click on any of the available themes to instantly change the application's appearance. Your preference is saved automatically.
