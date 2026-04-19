"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Reveal = ({ children, className = "", animation = "reveal-fade-up", threshold = 0.1 }: { children: React.ReactNode, className?: string, animation?: string, threshold?: number }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return (
    <div ref={ref} className={`${animation} ${isInView ? 'in-view' : ''} ${className}`}>
      {children}
    </div>
  );
};

const TeamCard = ({ member, idx, isSupervisor = false }: { member: any, idx: number, isSupervisor?: boolean }) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`glass-card p-8 group relative flex flex-col items-center text-center reveal-scale-in bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 ${isSupervisor ? 'border-brand/20 shadow-[0_0_20px_rgba(201,162,39,0.05)]' : ''}`} 
      style={{ animationDelay: `${idx * 0.1}s` }}
    >
      <div className={`mb-6 overflow-hidden relative transition-all duration-1000 ${isSupervisor ? 'w-40 h-40 rounded-[32px] border border-brand/20 shadow-xl' : 'w-28 h-28 rounded-full border border-white/10 bg-[#070d19]'} ${isInView ? 'grayscale-0 scale-100' : 'grayscale'}`}>
        <Image 
          src={member.photo} 
          alt={member.name} 
          fill 
          className={`object-cover transition-all duration-1000 ${isSupervisor ? 'scale-105 group-hover:scale-100' : ''}`} 
          unoptimized 
        />
      </div>
      
      <h4 className={`font-bold text-white mb-1.5 tracking-tight uppercase ${isSupervisor ? 'text-xl' : 'text-lg'}`}>{member.name}</h4>
      <p className="text-brand text-[9px] font-bold mb-4 tracking-widest">{member.id}</p>
      <p className={`text-slate-400 leading-relaxed font-normal ${isSupervisor ? 'text-base italic mb-8' : 'text-sm mb-6 h-10'}`}>{member.role}</p>

      <div className="flex gap-4 mt-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
        <Link href={member.linkedin} target="_blank" className="text-slate-500 hover:text-brand transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zM8 19h-3v-11h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
        </Link>
        <Link href={`mailto:${member.email}`} className="text-slate-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </Link>
      </div>
    </div>
  );
};

export default function Home() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const isProd = process.env.NODE_ENV === "production" || process.env.GITHUB_ACTIONS === "true";
  const BASE_PATH = isProd ? "/scjas-research-portfolio" : "";
  const backgrounds = [`${BASE_PATH}/bg1.png`, `${BASE_PATH}/bg2.png`, `${BASE_PATH}/bg3.png`];

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollWidth(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Inquiry from ${formName}`);
    const body = encodeURIComponent(`Name: ${formName}\nEmail: ${formEmail}\n\nMessage:\n${formMessage}`);
    const mailtoLink = `mailto:it22026484@my.sliit.lk?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  const modules = [
    { 
      emoji: "🎙️", 
      title: "Resource Finder", 
      desc: "Identify relevant laws from plain language case facts.",
      detail: "Uses BERT-based semantic extraction to query the Penal Code and Criminal Procedure Code, clustering legal sections into Prosecution and Defence categories."
    },
    { 
      emoji: "📄", 
      title: "Argument Builder", 
      desc: "Generate structured case profiles from judgment documents.",
      detail: "Performs deep document parsing to extract semantically similar past cases, building balanced 'Prosecution vs Defence' argument reports with strength scores."
    },
    { 
      emoji: "⚖️", 
      title: "Outcome Predictor", 
      desc: "Predict appeal results based on historical patterns.",
      detail: "Employs Bayesian statistical modelling on thousands of historical judgments to calculate probability distributions for outcomes like Acquittal or Sentence Reduction."
    },
    { 
      emoji: "💬", 
      title: "Semantic Chatbot", 
      desc: "Multilingual research aid for real-time legal queries.",
      detail: "An advanced NLP assistant that interprets and answers complex legal questions based on the insights generated by the system's core modules."
    }
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#070d19] text-slate-200 selection:bg-brand selection:text-[#070d19] relative scroll-smooth overflow-x-hidden">
      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[200] bg-[#070d19]/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {[
            { label: "Home", href: "#home" },
            { label: "Architecture", href: "#architecture" },
            { label: "Archive", href: "#archive" },
            { label: "Milestones", href: "#milestones" },
            { label: "Team", href: "#team" },
            { label: "Contact", href: "#contact" }
          ].map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-bold uppercase tracking-[0.3em] text-white hover:text-brand transition-all"
            >
              {link.label}
            </Link>
          ))}
          <button onClick={() => setIsMenuOpen(false)} className="mt-12 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#070d19]/80 backdrop-blur-md border-b border-white/5 py-4 lg:py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-end items-center h-10 lg:h-12">
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: "Home", href: "#home" },
              { label: "Architecture", href: "#architecture" },
              { label: "Archive", href: "#archive" },
              { label: "Milestones", href: "#milestones" },
              { label: "Team", href: "#team" },
              { label: "Contact", href: "#contact" }
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="py-2 px-4 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-brand transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden w-10 h-10 flex flex-col justify-center items-end gap-1.5">
            <div className="w-8 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-brand"></div>
            <div className="w-8 h-0.5 bg-white"></div>
          </button>
        </div>
      </nav>

      {/* Scroll Progress Bar */}
      <div id="scroll-progress" style={{ width: `${scrollWidth}%` }}></div>

      {/* Atmospheric Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* HERO / CINEMATIC SLIDER BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#070d19]">
        <div className="absolute inset-0 transition-all duration-[3000ms]">
          {backgrounds.map((bg, i) => (
            <Image
              key={bg}
              src={bg}
              alt="Legal Background"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className={`transition-opacity duration-[3000ms] animate-slow-pan unoptimized ${i === bgIndex ? 'opacity-20' : 'opacity-0'}`}
              priority={i === 0}
              unoptimized
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070d19]/60 via-[#070d19]/40 to-[#070d19]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center">

        {/* HERO SECTION */}
        <section id="home" className="text-center max-w-[1440px] mx-auto mb-48 pt-24 scroll-mt-32 px-4 w-full">
          <Reveal>
          <div className="glass-card px-8 lg:px-40 py-14 lg:py-16 bg-[#070d19]/60 backdrop-blur-3xl border-white/10 relative group overflow-hidden w-full">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="inline-block px-4 py-1.5 rounded-full border border-brand/20 bg-brand/5 text-brand text-[10px] uppercase font-bold tracking-widest mb-10 relative z-10">
              Research Development Portfolio
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-10 relative z-10 leading-tight tracking-tight">
              Smart Criminal Judgment <br className="hidden lg:block" />
              <span className="text-brand">Analysis System</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 font-normal max-w-4xl mx-auto leading-relaxed relative z-10 mb-14">
              An advanced AI-driven research methodology developed for the <span className="text-white font-medium">Sri Lankan Penal Code</span>, 
              leveraging semantic legal extraction and predictive modeling architectures.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
              <Link href="https://drive.google.com/file/d/1OJNyOK6boykUqLDI6ufoJJTE3_M_VuBo/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-brand hover:bg-brand-light text-[#070d19] px-14 py-5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-500 shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                View System Demo
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

        {/* CORE SYSTEM ARCHITECTURE */}
        <section id="architecture" className="w-full mb-48 scroll-mt-32">
          <Reveal>
            <div className="flex items-center gap-6 mb-16">
              <div className="h-0.5 w-12 bg-brand/40"></div>
              <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">System Architecture</h2>
              <div className="h-0.5 flex-grow bg-white/5"></div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((module, idx) => (
              <Reveal key={idx} animation="reveal-scale-in">
                <div 
                  onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                  className={`glass-card p-10 group cursor-pointer relative overflow-hidden transition-all duration-500 ${expandedModule === idx ? 'bg-brand/[0.03] border-brand/20' : ''}`} 
                >
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{module.emoji}</div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-brand transition-colors">{module.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm transition-opacity group-hover:opacity-80">{module.desc}</p>
                  
                  {/* Expanded Detail */}
                  <div className={`mt-6 overflow-hidden transition-all duration-500 ease-in-out ${expandedModule === idx ? 'max-h-40 opacity-100 shadow-inner' : 'max-h-0 opacity-0'}`}>
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-brand/80 text-sm font-normal leading-relaxed italic">
                         &ldquo;{module.detail}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 w-full flex items-center justify-between">
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]">Module 0{idx + 1}</div>
                    <div className={`w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-all ${expandedModule === idx ? 'rotate-45' : ''}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* DOMAIN & METHODOLOGY */}
        <section id="methodology" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 mb-48 scroll-mt-32">
          <div className="lg:col-span-7 space-y-8">
            <Reveal>
              <div className="relative p-10 glass-card bg-white/[0.02] border-white/5 overflow-hidden group">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 tracking-tight">The Research Problem</h3>
                <p className="text-slate-300 leading-relaxed text-base mb-6">
                  The Sri Lankan criminal justice system is currently slowed by a <strong className="text-white font-semibold">manual review bottleneck</strong>. Our methodology introduces advanced automation to process complex case facts and derive semantic legal insights.
                </p>
                <div className="flex gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-[9px] font-bold uppercase tracking-wider">High Latency</div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[9px] font-bold uppercase tracking-wider">Outcome Ambiguity</div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="relative p-10 glass-card bg-brand/[0.03] border-brand/10 overflow-hidden group">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 tracking-tight">Literature & Innovation</h3>
                <p className="text-slate-300 leading-relaxed text-base">
                  Bridging the gap between global LLMs and local SL litigation. We utilize <strong className="text-brand font-semibold">Semantic Argument Clustering (SAC)</strong> as a primary methodology for the region.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 flex flex-col h-full">
            <Reveal className="h-full">
              <div className="glass-card p-10 bg-[#070d19]/40 border-white/10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-10 border-b border-white/5 pb-6 tracking-widest uppercase text-center">Tech Stack</h2>
                  <div className="space-y-6">
                    {[
                      { label: "Core AI", value: "NLP, BERT, Transformers" },
                      { label: "Knowledge", value: "Semantic Graphs (Neo4j)" },
                      { label: "Predictive", value: "Bayesian Models" },
                      { label: "Languages", value: "Sinhala, Tamil, English" },
                      { label: "Platform", value: "Next.js, FastAPI, Docker" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1 group">
                        <span className="text-brand/60 text-[8px] uppercase font-bold tracking-widest">{item.label}</span>
                        <span className="text-white text-base font-medium transition-transform group-hover:translate-x-1 duration-300">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROJECT MILESTONES */}
        <section id="milestones" className="w-full mb-48 scroll-mt-32">
           <Reveal>
             <div className="flex items-center gap-6 mb-16 px-4">
               <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">Project Milestones</h2>
               <div className="h-0.5 flex-grow bg-white/5"></div>
             </div>
           </Reveal>

           <div className="relative max-w-5xl mx-auto pl-10 lg:pl-0">
             <div className="absolute left-[3px] lg:left-1/2 top-0 bottom-0 w-px bg-white/10 lg:-translate-x-1/2"></div>
             
             <div className="space-y-16 relative">
               {[
                 { title: "Project Proposal", desc: "Initial concept presentation and project charter submission.", marks: "12%" },
                 { title: "Progress Presentation 1", desc: "First technical milestone evaluating 50% functional completion.", marks: "15%" },
                 { title: "Progress Presentation 2", desc: "Refinement phase assessing 90% system integration.", marks: "18%" },
                 { title: "Demonstration", desc: "Final system walkthrough and poster presentation.", marks: "10%" },
                 { title: "Final Assessment", desc: "Full dissertation submission and final defense.", marks: "10%" },
                 { title: "Viva & Video", desc: "Final viva, commercialization video, and user testing results.", marks: "10%" },
               ].map((milestone, idx) => (
                 <Reveal key={idx} threshold={0.4}>
                   <div className={`relative flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 group`}>
                     <div className="absolute left-[-31px] lg:left-1/2 lg:-translate-x-1/2 w-3 h-3 rounded-full bg-[#070d19] border border-brand z-10 group-hover:scale-125 transition-transform"></div>
                     
                     <div className="w-full lg:w-[45%] glass-card p-8 bg-white/[0.01] hover:bg-white/[0.03] border-white/5 transition-all duration-300">
                       <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg lg:text-xl font-bold text-white tracking-tight">{milestone.title}</h3>
                          <span className="text-brand text-[9px] font-bold uppercase tracking-widest bg-brand/10 px-2.5 py-1 rounded-full">{milestone.marks}</span>
                       </div>
                       <p className="text-slate-400 text-sm leading-relaxed">{milestone.desc}</p>
                     </div>
                     <div className="hidden lg:block lg:w-[45%]"></div>
                   </div>
                 </Reveal>
               ))}
             </div>
           </div>
        </section>

        {/* DOCUMENTS & PRESENTATIONS */}
        <section id="archive" className="w-full mb-48 scroll-mt-32">
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Documents Column */}
              <div className="flex flex-col">
                 <Reveal>
                   <div className="flex items-center gap-6 mb-10">
                      <h2 className="text-2xl lg:text-4xl font-bold text-white tracking-tight">Resources & Archive</h2>
                      <div className="h-px flex-grow bg-white/5"></div>
                   </div>
                 </Reveal>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   {[
                     { title: "Project Charter", link: "#" },
                     { title: "Proposal Document", link: "#" },
                     { title: "Checklist Document", link: "#" },
                     { title: "Report – Ekanayake S.D.S.", link: "https://drive.google.com/file/d/1wKiyHZAADBNYzIQAgQ2kPyUaNTOeC0jM/view?usp=sharing" },
                     { title: "Report – Navashanthan T.", link: "https://drive.google.com/file/d/1RYttyOul9FzY-sRxPVBnT8Zlu7CW431V/view?usp=sharing" },
                     { title: "Report – Kabisek S.", link: "https://drive.google.com/file/d/19Ycqx_MbsMf3vL2yG6JrlkNdZI1rlsuu/view?usp=sharing" },
                     { title: "Report – Sivajanthan S.", link: "https://drive.google.com/file/d/1mamruNF1itgXoYXBgy3I_z0QdPYc5Ik7/view?usp=sharing" },
                     { title: "Final Dissertation", link: "#" }
                   ].map((doc, idx) => (
                     <Reveal key={idx} animation="reveal-scale-in">
                       <Link href={doc.link} target="_blank" className="flex items-center justify-between p-5 glass-card bg-white/[0.01] hover:bg-white/[0.04] border-white/5 group border-l-2 border-l-transparent hover:border-l-brand transition-all">
                         <div className="max-w-[80%]">
                           <p className="text-white text-xs lg:text-sm font-bold mb-1 truncate">{doc.title}</p>
                           <p className="text-slate-500 text-[9px] uppercase tracking-wider">Technical Document</p>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-brand/5 flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                         </div>
                       </Link>
                     </Reveal>
                   ))}
                 </div>
              </div>

              {/* Presentations Column */}
              <div className="flex flex-col">
                 <Reveal>
                   <div className="flex items-center gap-6 mb-10">
                      <h2 className="text-2xl lg:text-4xl font-bold text-white tracking-tight">Artifacts</h2>
                      <div className="h-px flex-grow bg-white/5"></div>
                   </div>
                 </Reveal>
                 
                 <div className="space-y-4 flex-grow">
                   {[
                     "Proposal Presentation",
                     "Progress Milestone 01",
                     "Progress Milestone 02",
                     "Final Defense Presentation"
                   ].map((pres, idx) => (
                     <Reveal key={idx} animation="reveal-scale-in">
                        <div className="p-5 glass-card border-white/5 hover:border-brand/20 flex items-center gap-8 group cursor-pointer transition-all duration-300 bg-white/[0.01] hover:bg-brand/[0.02]">
                           <div className="w-12 h-12 rounded-xl bg-blue-500/5 text-blue-400 flex items-center justify-center group-hover:bg-brand group-hover:text-[#070d19] transition-all duration-500">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <div className="flex-grow">
                             <p className="text-white font-bold text-base lg:text-lg mb-0.5 group-hover:text-brand transition-colors tracking-tight">{pres}</p>
                             <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">PowerPoint Showcase</p>
                           </div>
                        </div>
                     </Reveal>
                   ))}
                 </div>
              </div>
           </div>
        </section>

        {/* TEAM SECTION */}
        <section id="team" className="w-full mb-48 reveal-fade-up scroll-mt-32">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4">Our Team</h2>
            <div className="w-20 h-1 bg-brand mx-auto mb-6"></div>
            <p className="text-slate-400 uppercase tracking-[0.3em] text-[10px] font-bold">Research Affiliation 2025</p>
          </div>

          <div className="space-y-24">
            {/* Supervisors */}
            <div>
              <h3 className="text-brand/80 font-bold uppercase tracking-[0.2em] text-center mb-16 text-[10px]">Supervisory Board</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto px-4">
                {[
                  { name: "Dr. Lakmini Abeywardena", role: "Supervisor", photo: `${BASE_PATH}/team/lakmini.jfif`, linkedin: "https://www.linkedin.com/in/lakmini-abeywardhana-65283aa9/", email: "lakmini.d@sliit.lk", id: "Supervisor" },
                  { name: "Ms. Malithi Navarathne", role: "Co-Supervisor", photo: `${BASE_PATH}/team/malithi.png`, linkedin: "https://www.linkedin.com/in/malithi-nawarathne-2a443b18b/", email: "malithi.n@sliit.lk", id: "Co-Supervisor" }
                ].map((m, idx) => (
                  <TeamCard key={idx} member={m} idx={idx} isSupervisor />
                ))}
              </div>
            </div>

            {/* Research Students */}
            <div>
              <h3 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-center mb-16 text-[10px]">Research Associates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                  { name: "Kabisek S.", id: "IT22026620", role: "Argument Generation", email: "it22026620@my.sliit.lk", linkedin: "https://www.linkedin.com/in/kabisek11/", photo: `${BASE_PATH}/team/IT22026620.jfif` },
                  { name: "Ekanayake S.D.S.", id: "IT22026484", role: "Semantic Clustering", email: "it22026484@my.sliit.lk", linkedin: "https://www.linkedin.com/in/divanka24/", photo: `${BASE_PATH}/team/IT22026484.jfif` },
                  { name: "Navashanthan T.", id: "IT22274984", role: "Outcome Prediction", email: "it22274984@my.sliit.lk", linkedin: "https://www.linkedin.com/in/thavachchelvam-navashanthan/", photo: `${BASE_PATH}/team/IT22274984.png` },
                  { name: "Sivajanthan S.", id: "IT22316172", role: "Public Interfaces", email: "it22316172@my.sliit.lk", linkedin: "https://www.linkedin.com/in/sivajanthan/", photo: `${BASE_PATH}/team/IT22316172.jfif` }
                ].map((m, idx) => (
                  <Reveal key={idx} animation="reveal-scale-in">
                    <TeamCard member={m} idx={idx} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="w-full mb-48 scroll-mt-32">
          <Reveal>
            <div className="glass-card overflow-hidden bg-[#070d19]/60 backdrop-blur-3xl border-white/10 relative p-12 lg:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">Connect</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-12">
                    Open for technical collaborations and research inquiries regarding the SCJAS methodology.
                  </p>
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Email</p>
                        <p className="text-white font-medium text-base">it22026484@my.sliit.lk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Location</p>
                        <p className="text-white font-medium text-base">SLIIT, Malabe, Sri Lanka</p>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Right Form Column */}
                <div className="lg:col-span-7">
                  {isSent ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8 text-brand">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Message Received</h3>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Opening Email Client...</p>
                    </div>
                  ) : (
                    <form className="space-y-8" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold tracking-widest text-brand ml-1">Full Name</label>
                          <input required value={formName} onChange={(e) => setFormName(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-[#070d19]/60 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-brand outline-none transition-all text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold tracking-widest text-brand ml-1">Email Address</label>
                          <input required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full bg-[#070d19]/60 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-brand outline-none transition-all text-sm" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-brand ml-1">Message</label>
                        <textarea required value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={4} placeholder="How can we collaborate?" className="w-full bg-[#070d19]/60 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-brand outline-none transition-all text-sm resize-none"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-brand hover:bg-brand-light text-[#070d19] font-bold py-5 rounded-xl transition-all uppercase tracking-widest text-xs shadow-xl shadow-brand/10">
                        Send message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* REFINED FOOTER */}
        <footer className="w-full mb-20 scroll-mt-32">
          <Reveal>
            <div className="glass-card p-12 lg:p-16 bg-[#070d19]/60 backdrop-blur-3xl border-white/10 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 relative z-10 border-b border-white/5 pb-16">
                <div className="col-span-1">
                  <div className="text-white font-bold text-2xl tracking-tighter mb-6 uppercase">Criminal Judgment <br /> Analysis System</div>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-normal">
                    Academic research initiative focused on the application of NLP methodologies for the Sri Lankan legal domain.
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Project Access</div>
                  <ul className="space-y-4 text-sm text-slate-300 font-medium">
                    <li className="hover:text-brand transition-colors cursor-pointer tracking-tight">System Architecture</li>
                    <li className="hover:text-brand transition-colors cursor-pointer tracking-tight">Documentation Archive</li>
                    <li className="hover:text-brand transition-colors cursor-pointer tracking-tight">Methodology Overview</li>
                  </ul>
                </div>
  
                <div className="space-y-10">
                  <div>
                    <div className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-6">Institutional Affiliation</div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Sri Lanka Institute of <br /> Information Technology (SLIIT). <br /> Faculty of Computing • 2025
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                  © 2025 SCJAS Research Project • All Rights Reserved
                </p>
                <div className="flex gap-8">
                   <Link href="#" className="text-slate-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.372.75 1.103.75 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg></Link>
                   <Link href="#" className="text-slate-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zM8 19h-3v-11h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></Link>
                </div>
              </div>
            </div>
          </Reveal>
        </footer>
      </div>
    </main>
  );
}
