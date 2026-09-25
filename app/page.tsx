'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Download, ArrowRight, Ambulance, Building2, Radio, Siren } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'how-it-works'>('home');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Direct Google Drive Download Link for JeevanSetu APK
  const APK_DOWNLOAD_URL = "https://drive.google.com/file/d/1YbmJ-tzbPgPvO5e4i99gi0uME9SxkeBy/view?usp=drivesdk";

  // Video source placeholder
  const DEMO_VIDEO_SRC = "/reel.mp4";

  // UI Showcase Screens Array (from public/ directory)
  const UI_SCREENS = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
  ];

  // State & Effect for Auto-Rotating Phone Carousel (Changes every 2 seconds)
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreenIndex((prevIndex) => (prevIndex + 1) % UI_SCREENS.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [UI_SCREENS.length]);

  // Scroll Progress State for Interactive Simulation
  const [scrollProgress, setScrollProgress] = useState(0);
  const simRef = useRef<HTMLDivElement>(null);

  // Mobile-Optimized Scroll Calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!simRef.current) return;
      const rect = simRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startPoint = windowHeight;
      const endPoint = windowHeight * 0.35;
      
      const distanceScrolled = startPoint - rect.top;
      const totalDistanceNeeded = startPoint - endPoint;
      
      const progress = distanceScrolled / totalDistanceNeeded;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      
      setScrollProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('waitlist').insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          setMessage({ text: "You're already on the list!", type: 'success' });
        } else {
          setMessage({ text: `Error: ${error.message}`, type: 'error' });
        }
      } else {
        setMessage({ text: 'Success! We will notify you when we launch on Play Store.', type: 'success' });
        setEmail('');
      }
    } catch {
      setMessage({ text: 'Unable to connect to database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string, tab: 'home' | 'how-it-works') => {
    setActiveTab(tab);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#1c1c1c] font-sans selection:bg-[#800000] selection:text-white">
      {/* Navigation Bar */}
      <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
        <nav className="flex items-center justify-between w-full max-w-4xl px-3 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-black/10 gap-2">
          {/* Logo Brand Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-14 sm:w-36 h-6 sm:h-9">
              <Image
                src="/logoo.png"
                alt="JeevanSetu Logo"
                fill
                sizes="(max-width: 640px) 96px, 144px"
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          {/* Segmented Navigation Tab Pill */}
          <div className="flex items-center bg-[#f0eae1] p-1 rounded-full text-xs sm:text-sm font-medium">
            <button
              onClick={() => scrollToSection('top', 'home')}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeTab === 'home' ? 'bg-[#800000] text-white shadow-sm' : 'text-gray-700 hover:text-black'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeTab === 'how-it-works' ? 'bg-[#800000] text-white shadow-sm' : 'text-gray-700 hover:text-black'
              }`}
            >
              How it works
            </button>
          </div>

          {/* Download Button */}
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 sm:gap-2 bg-[#1c1c1c] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition-all shadow-sm flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Get APK</span>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.15] text-balance">
              Clearing the way for{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="bg-gradient-to-r from-[#800000] via-[#a00000] to-red-600 bg-clip-text text-transparent italic font-semibold px-1">
                  every life.
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[3px] sm:h-[4px] bg-gradient-to-r from-[#800000] via-red-500 to-transparent rounded-full opacity-80" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              An IoT-powered Emergency Ambulance Traffic Alert System. Download the direct APK to test the pilot or sign up to get notified for the Play Store release.
            </p>

            <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl max-w-md mx-auto lg:mx-0 shadow-md border border-black/10 text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-800 mb-3">
                Get early notifications when JeevanSetu goes live on Google Play.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#f8f6f0] border border-black/10 focus:border-[#800000] focus:bg-white outline-none text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#800000] text-white py-3 rounded-2xl text-sm font-medium hover:bg-[#600000] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join early access'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {message && (
                <p className={`mt-3 text-xs font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}
            </div>

            <div id="download-section" className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#800000] text-white px-6 py-3.5 rounded-full font-medium hover:bg-[#600000] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>Download APK Directly</span>
              </a>
              <span className="text-xs text-gray-600 font-medium">v1.0.0 • Android Direct Release</span>
            </div>
          </div>

          {/* Top Phone Mockup Screen (Video Player) */}
          <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
            <div className="relative w-[280px] sm:w-[320px] h-[570px] sm:h-[650px] bg-[#1a1a1b] rounded-[48px] sm:rounded-[54px] p-2.5 sm:p-3 shadow-2xl border-[4px] border-[#2c2c2e]">
              
              {/* Side Buttons */}
              <div className="absolute -left-[7px] top-24 w-[3px] h-8 bg-[#3a3a3c] rounded-l-sm"></div>
              <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#3a3a3c] rounded-l-sm"></div>
              <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#3a3a3c] rounded-r-sm"></div>

              {/* Display Area */}
              <div className="relative w-full h-full bg-black rounded-[38px] sm:rounded-[44px] overflow-hidden">
                
                {/* Camera Bar / Dynamic Island Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30 shadow-md pointer-events-none"></div>

                {/* Mobile App Video Player */}
                <video
                  src={DEMO_VIDEO_SRC}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Bottom Home Bar Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/60 rounded-full z-20 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Early Trigger Route Simulation */}
        <section 
          ref={simRef} 
          className="mt-12 sm:mt-28 pt-8 sm:pt-10 pb-8 px-3 sm:px-8 bg-white/80 backdrop-blur-md rounded-3xl border border-black/10 shadow-lg overflow-hidden scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-3">
            <div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#800000] uppercase mb-1 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#800000]"></span>
                </span>
                Interactive Route Simulation
              </div>
              <h3 className="text-lg sm:text-2xl font-serif">Scroll to clear the emergency corridor</h3>
            </div>
            <div className="flex items-center gap-2 bg-[#800000]/10 text-[#800000] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold border border-[#800000]/20">
              <Siren className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-[#800000]" />
              <span>IoT Corridor Synchronized</span>
            </div>
          </div>

          {/* Interactive Track Area */}
          <div className="relative my-10 py-12 sm:py-16 px-1 sm:px-4">
            {/* Road Background Track */}
            <div className="absolute left-4 right-4 sm:left-8 sm:right-8 top-1/2 -translate-y-1/2 h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden border border-black/5">
              <div 
                className="h-full bg-gradient-to-r from-[#800000] via-red-600 to-green-600 transition-all duration-75 ease-linear"
                style={{ width: `${Math.min(Math.max(scrollProgress * 100, 4), 96)}%` }}
              />
            </div>

            {/* Start Node: Emergency Alert */}
            <div className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#800000] text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md border-2 border-white">
                <Radio className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <span className="absolute -bottom-8 sm:-bottom-8 text-[9px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">
                Emergency Alert
              </span>
            </div>

            {/* Pre-emptive Middle Node */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md border-2 border-white transition-all duration-300 ${
                scrollProgress > 0.25 ? 'bg-red-600 text-white scale-110 ring-4 ring-red-300/80' : 'bg-gray-100 text-gray-400'
              }`}>
                <Siren className={`w-4 h-4 sm:w-6 sm:h-6 ${scrollProgress > 0.25 ? 'animate-spin' : ''}`} />
              </div>
              <span className="absolute -bottom-8 sm:-bottom-8 text-[9px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">
                Pre-Clearing Siren
              </span>
            </div>

            {/* End Node: Destination Hospital */}
            <div className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md border-2 border-white transition-all duration-300 ${
                scrollProgress > 0.85 ? 'bg-green-600 text-white scale-110 ring-4 ring-green-200' : 'bg-gray-100 text-gray-400'
              }`}>
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="absolute -bottom-8 sm:-bottom-8 text-[9px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">
                Hospital
              </span>
            </div>

            {/* Moving Ambulance */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-100 ease-out pointer-events-none"
              style={{ left: `calc(0.75rem + ${scrollProgress * 78}%)` }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-4 sm:h-6 bg-red-500/40 rounded-full animate-ping" />
                <div className="bg-[#800000] text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white flex items-center gap-1">
                  <Ambulance className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline text-[10px] font-bold tracking-wider uppercase bg-white/20 px-1.5 py-0.5 rounded">
                    EN ROUTE
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[11px] sm:text-xs text-gray-500 font-medium">
            Sirens activate pre-emptively ahead of the ambulance to ensure clear passage.
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-20 sm:mt-32 pt-12 sm:pt-16 border-t border-black/15">
          <div className="text-xs font-semibold tracking-wider text-gray-600 uppercase mb-3 sm:mb-4 text-center sm:text-left">
            How RaahRakshak Works
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-8 sm:mb-12 text-center sm:text-left">
            Creating an advance alert system for emergency movement.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-6">
            {/* Step 01 */}
            <div className="group relative bg-white p-6 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#800000]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#800000]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#800000]/10 pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <span className="inline-block text-xl font-serif text-[#800000] bg-[#800000]/10 px-3 py-1 rounded-2xl border border-[#800000]/20">
                  TRACK
                </span>
                <h3 className="text-base font-semibold group-hover:text-[#800000] transition-colors">
                  1. Live GPS Location
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Ambulance starts an emergency trip and continuously broadcasts live GPS data.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="group relative bg-white p-6 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#800000]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#800000]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#800000]/10 pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <span className="inline-block text-xl font-serif text-[#800000] bg-[#800000]/10 px-3 py-1 rounded-2xl border border-[#800000]/20">
                  PREDICT
                </span>
                <h3 className="text-base font-semibold group-hover:text-[#800000] transition-colors">
                  2. Route & ETA Analysis
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  System calculates ETA and identifies upcoming high-traffic junctions along the route.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="group relative bg-white p-6 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#800000]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#800000]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#800000]/10 pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <span className="inline-block text-xl font-serif text-[#800000] bg-[#800000]/10 px-3 py-1 rounded-2xl border border-[#800000]/20">
                  ALERT
                </span>
                <h3 className="text-base font-semibold group-hover:text-[#800000] transition-colors">
                  3. Authority Warnings
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Traffic authorities receive progressive alerts (15, 10, 5, 1 min) before arrival.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="group relative bg-white p-6 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#800000]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#800000]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#800000]/10 pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <span className="inline-block text-xl font-serif text-[#800000] bg-[#800000]/10 px-3 py-1 rounded-2xl border border-[#800000]/20">
                  ACT
                </span>
                <h3 className="text-base font-semibold group-hover:text-[#800000] transition-colors">
                  4. IoT Node Activation
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Connected sirens/light nodes trigger automatically to clear traffic ahead.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase Section with Auto-Rotating Mockup */}
        <section className="mt-20 sm:mt-32 pt-12 sm:pt-16 border-t border-black/15 flex flex-col items-center text-center">
          <div className="text-xs font-semibold tracking-wider text-[#800000] uppercase mb-3 sm:mb-4">
            Interface Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-4">
            Designed for Speed and Clarity
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mb-10">
            A seamless experience built for emergency drivers and authorities to report, track, and clear paths effortlessly.
          </p>

          {/* Rotating Phone Mockup */}
          <div className="relative w-[280px] sm:w-[320px] h-[570px] sm:h-[650px] bg-[#1a1a1b] rounded-[48px] sm:rounded-[54px] p-2.5 sm:p-3 shadow-2xl border-[4px] border-[#2c2c2e]">
            
            {/* Side Buttons */}
            <div className="absolute -left-[7px] top-24 w-[3px] h-8 bg-[#3a3a3c] rounded-l-sm"></div>
            <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#3a3a3c] rounded-l-sm"></div>
            <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#3a3a3c] rounded-r-sm"></div>

            {/* Display Area */}
            <div className="relative w-full h-full bg-black rounded-[38px] sm:rounded-[44px] overflow-hidden">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30 shadow-md pointer-events-none"></div>

              {/* Cross-fading UI Screen Images (Changes every 2s) */}
              {UI_SCREENS.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentScreenIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`App Interface Screen ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* Bottom Home Bar Indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/60 rounded-full z-20 pointer-events-none"></div>
            </div>
          </div>

          {/* Interactive Indicator Pills */}
          <div className="flex items-center gap-2 mt-6">
            {UI_SCREENS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScreenIndex(index)}
                aria-label={`Show screen ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentScreenIndex
                    ? 'bg-[#800000] w-6'
                    : 'bg-gray-300 hover:bg-gray-400 w-2.5'
                }`}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}