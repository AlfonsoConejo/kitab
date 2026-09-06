type AuthUnavailableProps = {
  onRetry: () => Promise<void>;
};

export default function AuthUnavailable({ onRetry }: AuthUnavailableProps) {
  return (
    <main className="min-h-dvh bg-gray-900 px-4 text-white flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center shadow-xl">
        <h1 className="text-xl font-semibold">No pudimos conectar con el servidor</h1>
        <p className="mt-3 text-sm text-gray-300">
          No hemos podido verificar tu sesión. Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={() => void onRetry()}
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
        >
          Reintentar
        </button>
      </section>
    </main>
  );
}
