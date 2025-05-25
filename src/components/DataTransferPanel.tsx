import React, { useRef } from "react";

const LOCALSTORAGE_EXPORT_PREFIX = ""; // ajuste se quiser filtrar chaves

function exportLocalStorage() {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCALSTORAGE_EXPORT_PREFIX)) {
      data[key] = localStorage.getItem(key) as string;
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "memorizei-dados.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importLocalStorage(file: File, onFinish: (ok: boolean) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (typeof data === "object" && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof key === "string" && typeof value === "string") {
            localStorage.setItem(key, value);
          }
        });
        onFinish(true);
        // Recarrega a página após importar com sucesso
        setTimeout(() => window.location.reload(), 500);
      } else {
        onFinish(false);
      }
    } catch {
      onFinish(false);
    }
  };
  reader.readAsText(file);
}

const DataTransferPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = React.useState<null | "ok" | "fail">(
    null
  );

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded"
        onClick={exportLocalStorage}
        title="Exportar dados para arquivo"
      >
        Exportar Dados
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            importLocalStorage(file, (ok) => {
              setImportStatus(ok ? "ok" : "fail");
              setTimeout(() => setImportStatus(null), 2000);
            });
          }
        }}
      />
      <button
        className="px-2 py-1 bg-green-500 text-white rounded"
        onClick={() => fileInputRef.current?.click()}
        title="Importar dados de arquivo"
      >
        Importar Dados
      </button>
      {importStatus === "ok" && (
        <span className="text-green-600">Importado!</span>
      )}
      {importStatus === "fail" && (
        <span className="text-red-600">Falha ao importar</span>
      )}
    </div>
  );
};

export default DataTransferPanel;
