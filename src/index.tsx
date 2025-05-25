import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// --- MIGRAÇÃO DE DADOS PARA PWA ---
function isRunningStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // @ts-ignore
    window.navigator.standalone === true
  );
}

function migrateLocalStorageToPWA() {
  // Só migra se estiver rodando como PWA e nunca migrou antes
  if (isRunningStandalone() && !localStorage.getItem('__pwa_migrated')) {
    try {
      // Tenta acessar o localStorage do navegador "normal"
      // No contexto PWA, o localStorage pode estar vazio
      // Para migrar, precisamos de uma forma de acessar o localStorage do navegador
      // Isso só é possível se o domínio/origem for o mesmo
      // Aqui, tentamos copiar todos os pares chave-valor se ainda não existem
      const keys = Object.keys(window.localStorage);
      for (const key of keys) {
        // Não sobrescreve se já existe
        if (!localStorage.getItem(key)) {
          const value = window.localStorage.getItem(key);
          if (value !== null) {
            localStorage.setItem(key, value);
          }
        }
      }
      localStorage.setItem('__pwa_migrated', '1');
    } catch (e) {
      // Falha silenciosa
    }
  }
}

migrateLocalStorageToPWA();
// --- FIM MIGRAÇÃO ---

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
