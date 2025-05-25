// Este arquivo registra o service worker para habilitar recursos de PWA (offline, instalação, etc).

// O nome do arquivo do service worker padrão do CRA é 'service-worker.js' na pasta 'public'.
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(
      (process as { env: { [key: string]: string } }).env.PUBLIC_URL || "",
      window.location.href
    );
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL || ""}/service-worker.js`;

      if (isLocalhost) {
        // Em localhost, verifica se o SW existe e é válido.
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          // Pronto para uso offline.
        });
      } else {
        // Em produção, registra normalmente.
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Novo conteúdo disponível.
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Conteúdo em cache para uso offline.
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(() => {
      // Falha ao registrar o SW.
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, { headers: { "Service-Worker": "script" } })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // SW não encontrado. Recarrega removendo o SW antigo.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // SW encontrado, registra normalmente.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // Sem conexão, app será servido offline.
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch(() => {});
  }
}
