import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  // Check if user is already logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If logged in, redirect to dashboard (producten page)
  if (user) {
    redirect('/producten')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Beta Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-2.5 text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Beta Programma - Gratis toegang voor early adopters | Jouw feedback maakt het verschil
        </span>
      </div>

      {/* Navigation */}
      <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">VoorraadPro</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full ml-2">BETA</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden md:block text-slate-400 hover:text-white transition">Features</a>
            <a href="#how" className="hidden md:block text-slate-400 hover:text-white transition">Hoe werkt het</a>
            <Link href="/login" className="px-4 py-2 text-slate-300 hover:text-white transition">
              Inloggen
            </Link>
            <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-emerald-500/25">
              Start gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-slate-300 text-sm">Speciaal voor food professionals</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Slimmer voorraad<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">beheren</span>
              </h1>

              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                De moderne oplossing voor groenteboeren, horeca, bakkers en slagers.
                Houd je voorraad bij, beheer leveranciers en krijg direct inzicht in je business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-xl shadow-emerald-500/25 text-center">
                  Gratis uitproberen
                </Link>
                <a href="#features" className="px-8 py-4 bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bekijk features
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Geen creditcard nodig
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Direct aan de slag
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Gratis tijdens beta
                </span>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Mock browser bar */}
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-400 w-fit">
                      voorraadpro.app/dashboard
                    </div>
                  </div>
                </div>
                {/* Mock dashboard */}
                <div className="p-4 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-slate-500 text-xs mb-1">Producten</p>
                      <p className="text-2xl font-bold text-white">248</p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-slate-500 text-xs mb-1">Voorraadwaarde</p>
                      <p className="text-2xl font-bold text-emerald-400">€12.450</p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-slate-500 text-xs mb-1">Lage voorraad</p>
                      <p className="text-2xl font-bold text-orange-400">7</p>
                    </div>
                  </div>
                  {/* Chart placeholder */}
                  <div className="bg-slate-800 rounded-xl p-4 h-32">
                    <div className="flex items-end justify-between h-full gap-2 px-4">
                      <div className="w-8 bg-emerald-500/50 rounded-t" style={{ height: '40%' }}></div>
                      <div className="w-8 bg-emerald-500/50 rounded-t" style={{ height: '65%' }}></div>
                      <div className="w-8 bg-emerald-500/50 rounded-t" style={{ height: '45%' }}></div>
                      <div className="w-8 bg-emerald-500/50 rounded-t" style={{ height: '80%' }}></div>
                      <div className="w-8 bg-emerald-500/50 rounded-t" style={{ height: '55%' }}></div>
                      <div className="w-8 bg-emerald-500/50 rounded-t" style={{ height: '70%' }}></div>
                      <div className="w-8 bg-emerald-500 rounded-t" style={{ height: '90%' }}></div>
                    </div>
                  </div>
                  {/* List items */}
                  <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Appels Jonagold</span>
                      <span className="text-emerald-400">45 kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Wortelen</span>
                      <span className="text-orange-400">3 kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Tomaten</span>
                      <span className="text-emerald-400">28 kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Krachtige tools die je dagelijkse werk makkelijker maken
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/50 transition group">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Voorraad bijhouden</h3>
              <p className="text-slate-400 leading-relaxed">
                Registreer inkomende en uitgaande voorraad met een paar klikken. Altijd actueel overzicht van je producten.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 hover:border-teal-500/50 transition group">
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500/30 transition">
                <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bestellingen beheren</h3>
              <p className="text-slate-400 leading-relaxed">
                Maak bestellingen aan bij leveranciers, volg de status en ontvang alles netjes in je voorraad.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition group">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Inzichtelijke rapporten</h3>
              <p className="text-slate-400 leading-relaxed">
                Voorraadwaarde, mutaties, vervaldatums - alles in overzichtelijke rapporten die je kunt exporteren.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 hover:border-orange-500/50 transition group">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Vervaldatums bijhouden</h3>
              <p className="text-slate-400 leading-relaxed">
                Krijg automatisch waarschuwingen voor producten die bijna verlopen. Verminder verspilling.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition group">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Meerdere locaties</h3>
              <p className="text-slate-400 leading-relaxed">
                Beheer voorraad op verschillende locaties. Perfect voor meerdere winkels of opslagplaatsen.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 hover:border-pink-500/50 transition group">
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500/30 transition">
                <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bulk import</h3>
              <p className="text-slate-400 leading-relaxed">
                Importeer al je producten in een keer via CSV. Bespaar uren handmatig invoeren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/50 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Simpel &amp; Snel</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              In 3 stappen aan de slag
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Van registratie tot volledig voorraadbeheer in minder dan 5 minuten
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 font-bold text-sm">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Account aanmaken</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Registreer gratis met je e-mail en vul je bedrijfsgegevens in. Klaar in minder dan een minuut.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border-2 border-teal-500 rounded-full flex items-center justify-center text-teal-400 font-bold text-sm">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Producten toevoegen</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Voeg producten handmatig toe of importeer in bulk via CSV. Stel categorieën en prijzen in.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border-2 border-cyan-500 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Start met beheren</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Registreer voorraadmutaties, beheer bestellingen en houd alles overzichtelijk bij.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA under steps */}
          <div className="text-center mt-16">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-xl shadow-emerald-500/25">
              Begin nu gratis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-slate-500">Gratis tijdens beta</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">&lt;1 min</div>
              <div className="text-slate-500">Om te starten</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-500">Toegang tot je data</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">NL/BE</div>
              <div className="text-slate-500">Volledig Nederlands</div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">Limited Beta Programma</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Word een van de eerste gebruikers
            </h2>

            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Als beta-tester krijg je gratis toegang en bepaal jij mee welke features we toevoegen.
              Jouw feedback is ontzettend waardevol en helpt ons de beste tool te bouwen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/register" className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl text-lg">
                Start als beta-tester
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-emerald-100 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Gratis tijdens beta
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Invloed op features
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Direct support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text */}
            <div>
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Jouw mening telt</span>
              <h2 className="text-4xl font-bold text-white mt-4 mb-6">
                Help ons VoorraadPro<br />beter maken
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Als beta-gebruiker bepaal jij mee hoe VoorraadPro zich ontwikkelt.
                Elke suggestie, elk idee en elk stukje feedback helpt ons de tool te bouwen die jij nodig hebt.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Feature requests</h4>
                    <p className="text-slate-400 text-sm">Mis je een functie? Laat het ons weten en we bouwen het.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Bugs melden</h4>
                    <p className="text-slate-400 text-sm">Iets werkt niet zoals verwacht? We fixen het zo snel mogelijk.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Algemene feedback</h4>
                    <p className="text-slate-400 text-sm">Vertel ons wat je vindt - positief of negatief, we horen het graag.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-10"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stuur ons een bericht</h3>
                  <p className="text-slate-400">We reageren binnen 24 uur</p>
                </div>

                <div className="space-y-4">
                  <a href="mailto:feedback@voorraadpro.be?subject=Feedback VoorraadPro Beta"
                     className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    feedback@voorraadpro.be
                  </a>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800 text-slate-500">of via WhatsApp</span>
                    </div>
                  </div>

                  <a href="https://wa.me/32XXXXXXXXX?text=Hallo%2C%20ik%20heb%20feedback%20over%20VoorraadPro%3A"
                     className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition border border-slate-600">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp ons
                  </a>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                  Alle feedback wordt persoonlijk gelezen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Veelgestelde vragen</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Is VoorraadPro echt gratis tijdens de beta?</h3>
              <p className="text-slate-400">Ja, als beta-tester krijg je volledige toegang zonder kosten. We vragen alleen je feedback om het product te verbeteren.</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Kan ik mijn bestaande productlijst importeren?</h3>
              <p className="text-slate-400">Absoluut! Je kunt je producten importeren via een CSV-bestand. We bieden ook een template aan om het makkelijk te maken.</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Is mijn data veilig?</h3>
              <p className="text-slate-400">Ja, we gebruiken beveiligde servers en je data is alleen voor jou toegankelijk. We verkopen nooit data aan derden.</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Hoe kan ik feedback geven?</h3>
              <p className="text-slate-400">We horen graag van je! Je kunt feedback geven via het feedbackformulier in de app of door ons te mailen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">VoorraadPro</span>
              </div>
              <p className="text-slate-400 max-w-md">
                De moderne voorraadbeheertool voor food professionals. Simpel, overzichtelijk en gemaakt met feedback van echte gebruikers.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><Link href="/register" className="hover:text-white transition">Registreren</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Inloggen</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="mailto:feedback@voorraadpro.be" className="hover:text-emerald-400 transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    feedback@voorraadpro.be
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2025 VoorraadPro - Beta versie</p>
            <p className="mt-2 md:mt-0">Gemaakt in Belgie</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
