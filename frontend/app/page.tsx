"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Search, MessageSquare, X, AlertCircle, Globe, Send, Zap, Cpu } from "lucide-react";
import GaugeComponent from 'react-gauge-component';

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("scanner");
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState("");

  const texts: any = {
    ar: { title: "3Titan للعمليات السيبرانية", scan: "تحليل", tip: "نصيحة: تأكد من تشغيل جدار الحماية (Firewall) دائماً.", placeholder: "أدخل IP...", scanner: "الماسح", alerts: "تنبيهات NVD", siem: "الداشبورد" },
    en: { title: "3Titan Cyber-Ops", scan: "Analyze", tip: "Tip: Always ensure your Firewall is active.", placeholder: "Enter IP...", scanner: "Scanner", alerts: "NVD Feeds", siem: "Dashboard" }
  };

  const handleScan = async () => {
    if (!ip) return;
    setLoading(true);
    try {
      const res = await fetch(`https://threetitan-backend.onrender.com/api/check-ip/${ip}`);
      const data = await res.json();
      setResult(data);
    } catch (err) { console.error("Error connecting to backend"); }
    finally { setLoading(false); }
  };

  const getThreatScore = () => {
    if (!result?.vt) return 0;
    const stats = result.vt.attributes.last_analysis_stats;
    const score = (stats.malicious * 20) + (stats.suspicious * 10);
    return score > 100 ? 100 : score;
  };

  return (
    <main className={`min-h-screen bg-[#020617] text-slate-200 p-4 ${lang === "ar" ? "rtl" : "ltr"}`}>

      {/* الشريط العلوي المتحرك */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 mb-6 overflow-hidden">
        <motion.div animate={{ x: lang === "ar" ? [1000, -1000] : [-1000, 1000] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="whitespace-nowrap flex items-center gap-4 text-[10px] font-bold text-blue-400">
          <Zap size={14} className="animate-pulse" /> {texts[lang].tip} — SYSTEM STATUS: MONITORING — 3TITAN SECURE — VERSION 2.0
        </motion.div>
      </div>

      <div className="max-w-[1500px] mx-auto">
        <header className="flex justify-between items-center mb-10 p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4">
            <Shield size={35} className="text-blue-500 shadow-blue-500/50" />
            <h1 className="text-2xl font-black tracking-tighter">{texts[lang].title}</h1>
          </div>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="bg-white/5 px-6 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-blue-600 transition-all uppercase">
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* الأقسام الجانبية */}
          <aside className="lg:col-span-2 space-y-3">
            <NavBtn active={activeTab === "scanner"} icon={<Search size={18} />} label={texts[lang].scanner} onClick={() => setActiveTab("scanner")} />
            <NavBtn active={activeTab === "alerts"} icon={<Globe size={18} />} label={texts[lang].alerts} onClick={() => setActiveTab("alerts")} />
            <NavBtn active={activeTab === "siem"} icon={<Activity size={18} />} label={texts[lang].siem} onClick={() => setActiveTab("siem")} />
          </aside>

          <section className="lg:col-span-10 space-y-6">
            {activeTab === "scanner" && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="flex gap-4">
                    <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-mono text-lg" placeholder={texts[lang].placeholder} value={ip} onChange={(e) => setIp(e.target.value)} />
                    <button onClick={handleScan} className="bg-blue-600 hover:bg-blue-500 px-10 rounded-xl font-bold uppercase transition-all shadow-lg shadow-blue-600/20">{loading ? "..." : texts[lang].scan}</button>
                  </div>
                </div>

                {result && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* العداد الاحترافي السيبراني */}
                    <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[350px]">
                      <h3 className="text-[10px] font-black text-blue-400 mb-8 uppercase tracking-[0.2em]">Threat Severity Index</h3>
                      <GaugeComponent
                        value={getThreatScore()}
                        type="semicircle"
                        arc={{
                          colorArray: ['#22c55e', '#f59e0b', '#ef4444'],
                          subArcs: [{ limit: 30 }, { limit: 60 }, { limit: 100 }],
                          padding: 0.02,
                          width: 0.25
                        }}
                        labels={{
                          valueLabel: { style: { fontSize: "40px", fontWeight: "bold", fill: "#fff" } }
                        }}
                      />
                    </div>

                    {/* تقرير الذكاء الاصطناعي */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-950/30 to-black p-10 rounded-3xl border border-blue-500/20 shadow-xl">
                      <h3 className="flex items-center gap-3 text-blue-400 font-black mb-6 uppercase text-xs tracking-widest"><Cpu className="animate-pulse" /> 3Titan AI Forensic Intelligence</h3>
                      <div className="text-lg italic leading-relaxed text-slate-300 whitespace-pre-wrap font-serif">{result.ai}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "siem" && (
              <div className="bg-black/60 p-8 rounded-3xl border border-blue-500/20 font-mono text-[11px] space-y-3 h-[500px] overflow-hidden relative">
                <p className="text-blue-500">[{new Date().toISOString()}] - CORE_KERNEL: ONLINE</p>
                <p className="text-green-500">[{new Date().toISOString()}] - SIEM_MODULE: INTERCEPTING_PACKETS...</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-red-500">[{new Date().toISOString()}] - ALERT: UNUSUAL_TRAFFIC_VOLUME_DETECTED</motion.p>
                <p className="text-gray-500">[{new Date().toISOString()}] - DATABASE: SYNCING_THREAT_FEEDS</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* الشات المطور */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="bg-slate-900 border border-blue-500/30 w-80 h-[450px] rounded-[2rem] shadow-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-xl">
              <div className="bg-blue-600 p-5 flex justify-between items-center font-black text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-2"><Cpu size={14} /> 3Titan Expert</span>
                <X size={18} className="cursor-pointer" onClick={() => setShowChat(false)} />
              </div>
              <div className="flex-1 p-5 text-[11px] space-y-4 overflow-y-auto">
                <div className="bg-blue-500/10 p-4 rounded-2xl rounded-tl-none border border-blue-500/20 text-blue-300">أهلاً يا بدر. أنا خبيرك السيبراني، كيف يمكنني مساعدتك في حماية بنيتك التحتية اليوم؟</div>
                {chatMsg && <div className="bg-slate-800 p-4 rounded-2xl rounded-tr-none text-right ml-auto max-w-[80%]">{chatMsg}</div>}
              </div>
              <div className="p-4 border-t border-white/5 flex gap-2 bg-black/20">
                <input
                  className="flex-1 bg-black/40 border border-white/10 p-2 rounded-xl text-[10px] outline-none focus:border-blue-500"
                  placeholder="اسأل الخبير..."
                  onKeyDown={(e) => { if (e.key === 'Enter') setChatMsg((e.target as any).value) }}
                />
                <button className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition-colors"><Send size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setShowChat(!showChat)} className="bg-blue-600 p-5 rounded-full shadow-2xl hover:scale-110 transition-all text-white"><MessageSquare /></button>
      </div>
    </main>
  );
}

function NavBtn({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1" : "text-slate-500 hover:bg-white/5"}`}>
      {icon} {label}
    </button>
  );
}