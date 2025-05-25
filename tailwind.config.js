module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Paleta moderna e fácil de alterar
      colors: {
        // Azul vibrante para destaque principal
        primary: {
          DEFAULT: "#2563eb", // Azul principal
          light: "#60a5fa",
          dark: "#1e40af",
        },
        // Roxo para elementos secundários
        secondary: {
          DEFAULT: "#7c3aed", // Roxo principal
          light: "#a78bfa",
          dark: "#4c1d95",
        },
        // Rosa/laranja para acentos e chamadas de ação
        accent: {
          DEFAULT: "#f472b6", // Rosa moderno
          light: "#fbcfe8",
          dark: "#be185d",
        },
        // Fundo e texto para contraste e beleza
        background: {
          DEFAULT: "#f8fafc", // Cinza bem claro
          dark: "#1e293b", // Azul escuro para dark mode
        },
        text: {
          DEFAULT: "#1e293b", // Azul escuro para texto
          light: "#f8fafc", // Para texto em fundo escuro
        },
      },
      fontFamily: {
        sans: ["Fira Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
