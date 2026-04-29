"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Terminal, Cpu, Search, MessageSquare, X, AlertCircle, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const RENDER_URL = "https://threetitan-backend.onrender.com"; // ضع رابطك هنا

  const texts: any = {
    ar: { title: "3Titan للعمليات السيبرانية", scan: "تحليل", tip: "نصيحة: استخدم مصادقة ثنائية MFA دائماً.", placeholder: "عنوان IP..." },
    en: { title: "3Titan Cyber-Ops", scan: "Analyze", tip: "Tip: Always use Multi-Factor Authentication (MFA).", placeholder: "IP Address..." }
  };

  const handleScan = async () => {
    if (!ip) return;
    setLoading(true);
    try {
      const res = await fetch(`${RENDER_URL}/api/check-ip/${ip}`);
      const data = await res.json();
      setResult(data);
    } catch (err) { console.error("Error"); }
    finally { setLoading(false); }
  };

  const chartData = result ? [
    { name: 'Malicious', value: result.vt?.attributes?.last_analysis_stats?.malicious || 0 },
    { name: 'Suspicious', value: result.vt?.attributes?.last_analysis_stats?.suspicious || 0 },
    { name: 'Harmless', value: result.vt?.attributes?.last_analysis_stats?.harmless || 0 },
  ] : [];

  return (
    <main className={`min-h-screen bg-[#020617] text-slate-200 p-4 ${lang === "ar" ? "rtl" : "ltr"}`}>
      {/* التنبيه العلوي المتحرك */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 mb-6 overflow-hidden">
        <motion.div animate={{ x: lang === "ar" ? [1000, -1000] : [-1000, 1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="whitespace-nowrap flex items-center gap-4 text-[10px] font-bold text-blue-400 uppercase">
          <AlertCircle size={14} /> {texts[lang].tip} — 3TITAN SHIELD ACTIVE
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <header className="flex justify-between items-center mb-8 p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4">
            <Shield size={32} className="text-blue-500 animate-pulse" />
            <h1 className="text-2xl font-black tracking-tighter">{texts[lang].title}</h1>
          </div>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-blue-600 transition-all">
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5">
              <div className="flex gap-4">
                <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder={texts[lang].placeholder} value={ip} onChange={(e) => setIp(e.target.value)} />
                <button onClick={handleScan} className="bg-blue-600 px-10 rounded-xl font-bold uppercase text-xs">{loading ? "..." : texts[lang].scan}</button>
              </div>
            </div>

            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" fontSize={10} stroke="#475569" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                      <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                        {chartData.map((e, i) => <Cell key={i} fill={i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#22c55e'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/20 to-black p-8 rounded-3xl border border-blue-500/20">
                  <h3 className="flex items-center gap-2 text-blue-400 font-bold mb-4 uppercase text-xs"><Cpu size={16} /> 3Titan AI Intelligence</h3>
                  <p className="text-md italic leading-relaxed text-slate-300 whitespace-pre-wrap">{result.ai}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الشات المنبثق */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-slate-900 border border-blue-500/30 w-72 h-96 rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden">
              <div className="bg-blue-600 p-4 flex justify-between items-center font-bold text-xs">
                <span>3Titan Expert AI</span>
                <X size={16} className="cursor-pointer" onClick={() => setShowChat(false)} />
              </div>
              <div className="flex-1 p-4 text-[10px] text-blue-300">أهلاً بك يا بطل، كيف أساعدك اليوم في حماية بياناتك؟</div>
              <div className="p-4 border-t border-white/5"><input className="w-full bg-black/40 p-2 rounded-lg text-xs outline-none" placeholder="Ask anything..." /></div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setShowChat(!showChat)} className="bg-blue-600 p-4 rounded-full shadow-2xl"><MessageSquare text-white /></button>
      </div>
    </main>
  );
}