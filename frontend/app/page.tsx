"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Terminal, Cpu, Search, MessageSquare, X, AlertCircle, Globe, Send, Zap } from "lucide-react";
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
    } catch (err) { console.error("Error"); }
    finally { setLoading(false); }
  };

  // قيمة العداد بناءً على التهديد (0-100)
  const getThreatScore = () => {
    if (!result?.vt) return 0;
    const stats = result.vt.attributes.last_analysis_stats;
    return (stats.malicious * 10) + (stats.suspicious * 5);
  };

  return (
    <main className={`min-h-screen bg-[#020617] text-slate-200 p-4 ${lang === "ar" ? "rtl" : "ltr"}`}>

      {/* الشريط العلوي المتحرك */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 mb-6 overflow-hidden">
        <motion.div animate={{ x: lang === "ar" ? [1000, -1000] : [-1000, 1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="whitespace-nowrap flex items-center gap-4 text-[10px] font-bold text-blue-400">
          <Zap size={14} className="animate-pulse" /> {texts[lang].tip} — SYSTEM STATUS: MONITORING — 3TITAN SECURE
        </motion.div>
      </div>

      <div className="max-w-[1500px] mx-auto">
        <header className="flex justify-between items-center mb-10 p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4">
            <Shield size={35} className="text-blue-500" />
            <h1 className="text-2xl font-black">{texts[lang].title}</h1>
          </div>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="bg-white/5 px-6 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-blue-600 transition-all">
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* الأقسام الجانبية (رجعت نفس أول) */}
          <aside className="lg:col-span-2 space-y-3">
            <NavBtn active={activeTab === "scanner"} icon={<Search />} label={texts[lang].scanner} onClick={() => setActiveTab("scanner")} />
            <NavBtn active={activeTab === "alerts"} icon={<Globe />} label={texts[lang].alerts} onClick={() => setActiveTab("alerts")} />
            <NavBtn active={activeTab === "siem"} icon={<Activity />} label={texts[lang].siem} onClick={() => setActiveTab("siem")} />
          </aside>

          <section className="lg:col-span-10 space-y-6">
            {activeTab === "scanner" && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                  {/* لمسة سيبرانية متحركة في الخلفية */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
                  <div className="flex gap-4">
                    <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder={texts[lang].placeholder} value={ip} onChange={(e) => setIp(e.target.value)} />
                    <button onClick={handleScan} className="bg-blue-600 px-10 rounded-xl font-bold uppercase">{loading ? "..." : texts[lang].scan}</button>
                  </div>
                </div>

                {result && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* العداد الاحترافي السيبراني */}
                    <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                      <h3 className="text-xs font-bold text-blue-400 mb-4 uppercase tracking-widest">Threat Level Index</h3>
                      <GaugeComponent
                        value={getThreatScore()}
                        type="arc"
                        arc={{
                          colorArray: ['#22c55e', '#f59e0b', '#ef4444'],
                          subArcs: [{ limit: 30 }, { limit: 60 }, { limit: 100 }],
                          padding: 0.02,
                          width: 0.3
                        }}
                        pointer={{ type: "blob", animationDelay: 0 }}
                        labels={{ valueLabel: { style: { fill: '#fff', fontSize: '35px' } } }}
                      />
                    </div>
                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-950/20 to-black p-8 rounded-3xl border border-blue-500/20 shadow-xl">
                      <h3 className="flex items-center gap-2 text-blue-400 font-bold mb-4 uppercase text-xs"><Cpu className="animate-pulse" /> 3Titan AI Report</h3>
                      <div className="text-md italic leading-relaxed text-slate-300 whitespace-pre-wrap">{result.ai}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* قسم الـ SIEM المتحرك */}
            {activeTab === "siem" && (
              <div className="bg-black/60 p-8 rounded-3xl border border-blue-500/20 font-mono text-xs space-y-2 h-[500px] overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                <p className="text-blue-500">[{new Date().toISOString()}] INITIALIZING_3TITAN_CORE...</p>
                <p className="text-green-500">[{new Date().toISOString()}] SIEM_LIVE_TRAFFIC_MONITOR_ON</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-red-500">[{new Date().toISOString()}] WARNING: ANOMALY_DETECTED_IN_PORT_443</p>
                <p className="text-gray-500">[{new Date().toISOString()}] PACKET_INSPECTION_COMPLETED...</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* الشات المطور مع خاصية الإرسال */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-slate-900 border border-blue-500/30 w-80 h-[450px] rounded-[2rem] shadow-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-xl">
              <div className="bg-blue-600 p-5 flex justify-between items-center font-black text-xs uppercase">
                <span className="flex items-center gap-2"><Cpu size={14} /> 3Titan Expert</span>
                <X size={18} className="cursor-pointer" onClick={() => setShowChat(false)} />
              </div>
              <div className="flex-1 p-5 text-[10px] space-y-4 overflow-y-auto">
                <div className="bg-blue-500/10 p-4 rounded-2xl rounded-tl-none border border-blue-500/20 text-blue-300">أهلاً يا بدر. أنا خبيرك السيبراني، كيف أساعدك في فحص التهديدات اليوم؟</div>
                {chatMsg && <div className="bg-slate-800 p-4 rounded-2xl rounded-tr-none self-end text-right">{chatMsg}</div>}
              </div>
              <div className="p-4 border-t border-white/5 flex gap-2 bg-black/20">
                <input className="flex-1 bg-black/40 border border-white/10 p-2 rounded-xl text-[10px] outline-none focus:border-blue-500" placeholder="اسأل الخبير..." />
                <button className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500"><Send size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setShowChat(!showChat)} className="bg-blue-600 p-5 rounded-full shadow-2xl shadow-blue-600/20 hover:scale-110 transition-all text-white"><MessageSquare /></button>
      </div>
    </main>
  );
}

function NavBtn({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-xs uppercase transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-500 hover:bg-white/5"}`}>
      {icon} {label}
    </button>
  );
}