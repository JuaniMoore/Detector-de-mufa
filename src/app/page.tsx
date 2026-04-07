"use client";

import { useState, useEffect } from "react";
import { MUFA_PHRASES, CANCEL_CHALLENGES, SEVERITY_LEVELS, TOURNAMENT_STAGES, calculateSeverity, FAKE_HISTORY_REPORTS } from "@/lib/constants";
import { ShieldAlert, Loader2, Download, RefreshCcw, Search, Gavel, Share2, Archive } from "lucide-react";

type ReportRecord = {
  id: string;
  name: string;
  phrase: string;
  severity: string;
  imageUrl: string;
  date: string;
};

function LoadingMeter({ text }: { text: string }) {
  const [needleAngle, setNeedleAngle] = useState(-80);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      // Ramp up from -80 to +80 over ~20 ticks (3 seconds)
      const baseAngle = -80 + (160 * Math.min(1, tick / 20));
      // Add a frantic jitter
      const jitter = (Math.random() - 0.5) * 30; // +/- 15 deg
      setNeedleAngle(Math.min(85, Math.max(-85, baseAngle + jitter)));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 animate-in fade-in duration-300">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          {/* Background Track */}
          <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="#e5e7eb" strokeWidth="20" strokeLinecap="round" />
          {/* Progress colored track */}
          <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="url(#mufaGradient)" strokeWidth="20" strokeLinecap="round" />
          <defs>
            <linearGradient id="mufaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Needle Group */}
          <g
            style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 90px', transition: 'transform 100ms ease-in-out' }}
          >
            <path d="M 96 90 L 100 20 L 104 90 Z" fill="#1f2937" />
            <circle cx="100" cy="90" r="10" fill="#1f2937" />
            <circle cx="100" cy="90" r="4" fill="#f87171" />
          </g>
        </svg>
      </div>

      <div className="flex items-center space-x-3 text-red-600 bg-red-50 px-6 py-3 rounded-full border border-red-100 shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-xl font-bold font-mono tracking-tight">{text}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState(MUFA_PHRASES[0]);
  const [stage, setStage] = useState(TOURNAMENT_STAGES[0]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<ReportRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mufa_history');
    if (saved) {
      try { 
        setHistory(JSON.parse(saved)); 
      } catch (e) {
        console.error("Error loading history", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setLoadingText("Consultando al VAR...");

    setTimeout(() => {
      setLoadingText("Midiendo niveles de humedad y mufa...");
    }, 1200);

    setTimeout(() => {
      const calculatedSeverity = calculateSeverity(stage, phrase);
      const randomChallenge = calculatedSeverity.includes('Desestimados')
        ? 'Ninguno. El ciudadano queda en libertad inmediata bajo apercibimiento.'
        : CANCEL_CHALLENGES[Math.floor(Math.random() * CANCEL_CHALLENGES.length)];
      const date = new Date().toLocaleDateString('es-AR');

      const params = new URLSearchParams({
        name: name,
        phrase: phrase,
        stage: stage,
        severity: calculatedSeverity,
        challenge: randomChallenge,
        date: date
      });

      const constructedUrl = `/api/og?${params.toString()}`;
      
      const newReport: ReportRecord = {
        id: Date.now().toString(),
        name,
        phrase,
        severity: calculatedSeverity,
        imageUrl: constructedUrl,
        date: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedHistory = [newReport, ...history].slice(0, 10); // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('mufa_history', JSON.stringify(updatedHistory));

      setImageUrl(constructedUrl);
      setLoading(false);
    }, 2800);
  };

  const resetForm = () => {
    setImageUrl(null);
    setName("");
    setPhrase(MUFA_PHRASES[0]);
    setStage(TOURNAMENT_STAGES[0]);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `boleta-infraccion-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    
    try {
      // We try to share the generated image as a native File first
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `boleta-${name.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Acta de Infracción Mufa',
          text: `🚨 ¡Denuncia oficial contra ${name}! Sentencia confirmada por intento de mufa. \n\nEscudate usando el Detector Oficial: ${window.location.origin}`,
        });
      } else if (navigator.share) {
        // Fallback for browsers that support share but not file sharing
        await navigator.share({
          title: 'Detector Mufa 2026',
          text: `🚨 ¡Acabo de emitir un Acta Policial de Mufa contra ${name}! \n\nEscudate usando el Detector Oficial:`,
          url: window.location.origin
        });
      } else {
        // Ultimate fallback for desktop without share API
        await navigator.clipboard.writeText(`🚨 ¡Denuncia de Mufa contra ${name}! \n\nEscudate usando el Detector Oficial: ${window.location.origin}`);
        alert("¡Mensaje copiado al portapapeles listos para pegar en WhatsApp/Redes!");
      }
    } catch (err) {
      console.log('User cancelled or error sharing:', err);
    }
  };

  return (
    <main className="min-h-screen relative flex justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
      <style>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-bg {
          animation: subtle-zoom 15s infinite ease-in-out;
        }
      `}</style>

      {/* Background Image Container */}
      <div
        className="absolute inset-0 z-0 animate-bg mix-blend-screen"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
        }}
      />

      <div className="max-w-2xl w-full relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
          <div className="bg-dorado/20 p-4 rounded-full border border-dorado shadow-lg">
            <Gavel className="w-12 h-12 text-dorado" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl flex items-center justify-center gap-3" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            Detector Mufa <span className="text-dorado drop-shadow-xl" style={{ textShadow: "0 2px 8px rgba(212, 175, 55, 0.4)" }}>2026</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-white bg-black/40 px-6 py-2 rounded-full shadow-xl backdrop-blur-md border border-white/20">
            Departamento de Protección de la Scaloneta
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-md shadow-2xl border-t-8 border-t-red-600 border-x border-b border-gray-200 overflow-hidden transform transition-all duration-300">
          {!imageUrl ? (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-gray-200 pb-4">
                <ShieldAlert className="text-red-600 w-7 h-7" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Acta de Infracción</h2>
              </div>

              {loading ? (
                <LoadingMeter text={loadingText} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Nombre del Imputado/a
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      maxLength={30}
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="Ej. Martín Pérez"
                      className="w-full px-4 py-3 rounded-sm border-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-0 focus:border-red-600 transition-colors duration-200"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phrase" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Alegato Denunciado / Frase
                    </label>
                    <input
                      id="phrase"
                      type="text"
                      list="mufa-phrases"
                      value={phrase}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhrase(e.target.value)}
                      placeholder="Escribí la ofensa textual..."
                      maxLength={70}
                      required
                      className="w-full px-4 py-3 rounded-sm border-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-0 focus:border-red-600 transition-colors duration-200"
                      disabled={loading}
                    />
                    <datalist id="mufa-phrases">
                      {MUFA_PHRASES.map((p, i) => (
                        <option key={i} value={p} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="stage" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Instancia del Torneo
                    </label>
                    <select
                      id="stage"
                      value={stage}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStage(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm border-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-0 focus:border-red-600 transition-colors duration-200 cursor-pointer"
                      disabled={loading}
                    >
                      {TOURNAMENT_STAGES.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm py-4 px-6 rounded-sm shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Search className="w-5 h-5" />
                      <span>Emitir Infracción</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center">
              <div className="bg-red-100 text-red-900 border-2 border-red-200 text-sm font-bold tracking-widest uppercase px-6 py-2 mb-6 shadow-sm">
                Infracción Registrada Oficialmente
              </div>

              <div className="relative group w-full mb-8 overflow-hidden shadow-2xl border-4 border-gray-800 p-2 bg-white">
                {/* Fallback pattern in case image takes time to render */}
                <div className="absolute inset-0 bg-papel animate-pulse -z-10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Boleta de Infracción"
                  className="w-full h-auto relative z-10 border border-gray-300"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-2 rounded-sm shadow-md transition-colors duration-200 uppercase tracking-wide text-xs sm:text-sm"
                >
                  <Download className="w-5 h-5 flex-shrink-0" />
                  <span>Descargar</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-2 rounded-sm shadow-md transition-colors duration-200 uppercase tracking-wide text-xs sm:text-sm"
                >
                  <Share2 className="w-5 h-5 flex-shrink-0" />
                  <span>Compartir</span>
                </button>
                
                <button
                  onClick={resetForm}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-2 rounded-sm shadow-sm transition-colors duration-200 uppercase tracking-wide text-xs sm:text-sm"
                >
                  <RefreshCcw className="w-5 h-5 flex-shrink-0" />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm font-medium text-white/80 mt-8 mb-4 drop-shadow-lg">
          Aprobado por el Ministerio de Prevención de la Mufa. Patente Pendiente.
        </p>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-8 bg-black/40 backdrop-blur-xl rounded-md border border-white/20 p-6 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/20 pb-4">
              <Archive className="w-5 h-5 text-dorado" />
              Expedientes Archivados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {history.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-white/95 p-4 rounded-md shadow-sm border-l-4 border-l-red-600 hover:bg-white hover:-translate-y-1 transition-all duration-200 cursor-pointer group" 
                  onClick={() => {
                    setImageUrl(record.imageUrl);
                    setName(record.name);
                    setPhrase(record.phrase);
                    // Scroll to top smoothly
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 border-b border-gray-300 pb-1 w-full flex justify-between uppercase tracking-wide text-xs">
                      {record.name}
                      <span className="text-gray-500 font-normal">{record.date}</span>
                    </span>
                  </div>
                  <p className="text-xs italic text-gray-700 mt-3 line-clamp-2 leading-relaxed">&quot;{record.phrase}&quot;</p>
                  <div className="flex justify-between items-center mt-3">
                     <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{record.severity}</p>
                     <p className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">VER ACTA ➡</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ticker de Noticias / Prontuarios */}
      <div className="absolute top-0 left-0 w-full bg-red-600/90 text-white py-2 overflow-hidden flex border-b border-red-500/50 backdrop-blur-md z-30 shadow-lg">
        <div className="absolute left-0 top-0 bottom-0 bg-red-700/95 px-4 font-black flex items-center z-40 uppercase tracking-widest text-sm shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
          ÚLTIMAS CONDENAS
        </div>
        <div className="flex animate-[marquee_90s_linear_infinite] shrink-0 pl-52 hover:[animation-play-state:paused]">
          {FAKE_HISTORY_REPORTS.map((report, i) => (
            <span key={i} className="mx-6 text-sm font-medium whitespace-nowrap">
              🚨 <span className="font-bold border-b border-white/50">{report.name}</span> <span className="text-white/80 italic">&quot;{report.offense}&quot;</span> ➡ <span className="text-yellow-300 font-bold uppercase">{report.penalty}</span>
              <span className="text-white/60 ml-2">({report.time})</span>
            </span>
          ))}
        </div>
        <div className="flex animate-[marquee_90s_linear_infinite] shrink-0 hover:[animation-play-state:paused]" aria-hidden="true">
          {FAKE_HISTORY_REPORTS.map((report, i) => (
            <span key={`dup-${i}`} className="mx-6 text-sm font-medium whitespace-nowrap">
              🚨 <span className="font-bold border-b border-white/50">{report.name}</span> <span className="text-white/80 italic">&quot;{report.offense}&quot;</span> ➡ <span className="text-yellow-300 font-bold uppercase">{report.penalty}</span>
              <span className="text-white/60 ml-2">({report.time})</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
