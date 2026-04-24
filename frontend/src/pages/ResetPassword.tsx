import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "https://panoramabo.onrender.com/api/v1";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Token non valido.");
      return;
    }

    if (password.length < 6) {
      setMessage("La password deve avere almeno 6 caratteri.");
      return;
    }

    if (password !== confirm) {
      setMessage("Le password non coincidono.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Errore durante il reset.");
        return;
      }

      setMessage("Password aggiornata correttamente ✅");

      // opcional: redirige después de 2 segundos
      setTimeout(() => {
        navigate("/accedi");
      }, 2000);

    } catch (err) {
      setMessage("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">Reimposta password</h1>

        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-zinc-800 border border-zinc-700"
        />

        <input
          type="password"
          placeholder="Conferma password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-zinc-800 border border-zinc-700"
        />

        {message && (
          <p className="mb-3 text-sm text-purple-300">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Aggiornamento..." : "Aggiorna password"}
        </button>
      </form>
    </div>
  );
}