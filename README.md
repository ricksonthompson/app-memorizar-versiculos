# Verse Memorization App

## Overview

The Verse Memorization App is a React application designed to help users memorize Bible verses efficiently. It allows users to manage their verses, create custom lists, and recite verses while tracking their progress. The app is built using React and styled with Tailwind CSS.

## Features

- **Manage Verses**: Add, view, and filter verses by month and week.
- **Custom Lists**: Create and manage blocks of verses with customizable colors.
- **Recitation Tracking**: Select verses for recitation and track progress with checkboxes.
- **Sharing**: Share recitation results via WhatsApp with a formatted message.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Local Storage for data persistence

## Project Structure

```
memorizei-app
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── VerseList.tsx
│   │   ├── VerseForm.tsx
│   │   ├── CustomList.tsx
│   │   ├── Recitation.tsx
│   │   └── SharedButton.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── MyVerses.tsx
│   │   ├── CustomLists.tsx
│   │   └── ReciteVerses.tsx
│   ├── styles
│   │   └── tailwind.css
│   ├── utils
│   │   ├── localStorageHelper.ts
│   │   └── dataStructure.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types
│       └── index.ts
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd memorizei-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Usage

- Open the app in your browser at `http://localhost:3000`.
- Use the navigation to access "Meus Versículos", "Lista Personalizada", and "Recitar Versículos".
- Follow the prompts to add verses, create custom lists, and track your recitation progress.

## Customization

- The app uses the Fira Sans font for a clean and modern look.
- Custom colors can be set in the Tailwind CSS configuration file.

## License

This project is licensed under the MIT License.
