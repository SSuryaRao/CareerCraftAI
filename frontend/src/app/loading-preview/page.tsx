'use client'

import { useState } from 'react'

export default function LoadingPreviewPage() {
  const [selected, setSelected] = useState<number | null>(null)

  const options = [
    { id: 1, name: 'Neural Network', description: 'AI brain synapses firing with connections', tag: 'PREMIUM' },
    { id: 2, name: 'Cosmic Portal', description: 'Rotating galaxy with depth and particles', tag: 'ELITE' },
    { id: 3, name: 'DNA Helix', description: 'Double helix rotation with glowing strands', tag: 'EXCLUSIVE' },
    { id: 4, name: 'Quantum Rings', description: 'Multi-layered rotating energy rings', tag: 'PREMIUM' },
    { id: 5, name: 'Digital Rain', description: 'Matrix-style falling code with logo', tag: 'ELITE' },
    { id: 6, name: 'Energy Sphere', description: '3D sphere with pulsing energy waves', tag: 'EXCLUSIVE' },
    { id: 7, name: 'Prism Refraction', description: 'Rainbow light splitting through prism', tag: 'PREMIUM' },
    { id: 8, name: 'Atom Structure', description: 'Electrons orbiting nucleus animation', tag: 'ELITE' },
    { id: 9, name: 'Liquid Metal', description: 'Mercury-like fluid morphing effect', tag: 'EXCLUSIVE' },
    { id: 10, name: 'Hexagon Grid', description: 'Pulsing hexagonal pattern network', tag: 'PREMIUM' },
    { id: 11, name: 'Warp Speed', description: 'Hyperspace light streaks animation', tag: 'ELITE' },
    { id: 12, name: 'Fractal Bloom', description: 'Expanding fractal flower pattern', tag: 'EXCLUSIVE' },
  ]

  return (
    <div className="min-h-screen bg-black p-8 relative overflow-hidden">
      {/* Ultra premium animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-pink-950/40"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm">
            <span className="text-sm font-semibold text-blue-300">ELITE COLLECTION</span>
          </div>
          <h1 className="text-7xl font-black mb-6 relative">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Ultimate Loading Animations
            </span>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </h1>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            12 breathtaking animations designed to captivate your users
          </p>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">

          {/* Option 1: Neural Network */}
          <div
            onClick={() => setSelected(1)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 1 ? 'border-blue-500 shadow-2xl shadow-blue-500/50 scale-105' : 'border-slate-700/50 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[0].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Neural network nodes */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                    style={{
                      left: `${20 + (i % 4) * 20}%`,
                      top: `${30 + Math.floor(i / 4) * 40}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                ))}
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full opacity-40">
                  <line x1="20%" y1="30%" x2="40%" y2="30%" stroke="#60a5fa" strokeWidth="1" className="animate-pulse" />
                  <line x1="40%" y1="30%" x2="60%" y2="70%" stroke="#60a5fa" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.3s'}} />
                  <line x1="60%" y1="70%" x2="80%" y2="70%" stroke="#60a5fa" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                  <line x1="20%" y1="70%" x2="60%" y2="30%" stroke="#60a5fa" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.9s'}} />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
                <p className="text-center text-blue-300/60 mt-3 text-xs">Processing neural pathways...</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[0].name}</h3>
              <p className="text-slate-400 text-sm">{options[0].description}</p>
            </div>
          </div>

          {/* Option 2: Cosmic Portal */}
          <div
            onClick={() => setSelected(2)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 2 ? 'border-purple-500 shadow-2xl shadow-purple-500/50 scale-105' : 'border-slate-700/50 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[1].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Rotating rings creating portal effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border-2 animate-spin"
                    style={{
                      width: `${100 + i * 40}px`,
                      height: `${100 + i * 40}px`,
                      borderColor: `rgba(168, 85, 247, ${0.6 - i * 0.1})`,
                      animationDuration: `${3 + i * 0.5}s`,
                      animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                    }}
                  />
                ))}
                <div className="absolute w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
              </div>
              {/* Particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[1].name}</h3>
              <p className="text-slate-400 text-sm">{options[1].description}</p>
            </div>
          </div>

          {/* Option 3: DNA Helix */}
          <div
            onClick={() => setSelected(3)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 3 ? 'border-cyan-500 shadow-2xl shadow-cyan-500/50 scale-105' : 'border-slate-700/50 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[2].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* DNA Helix strands */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-full">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute left-0 w-full" style={{ top: `${15 + i * 12}%` }}>
                      <div className="relative w-full h-4">
                        <div
                          className="absolute w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-[helix_3s_ease-in-out_infinite]"
                          style={{ animationDelay: `${i * 0.3}s`, left: '20%' }}
                        />
                        <div
                          className="absolute w-4 h-4 bg-blue-400 rounded-full blur-sm animate-[helixReverse_3s_ease-in-out_infinite]"
                          style={{ animationDelay: `${i * 0.3}s`, right: '20%' }}
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-cyan-400/40 via-transparent to-blue-400/40"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[2].name}</h3>
              <p className="text-slate-400 text-sm">{options[2].description}</p>
            </div>
          </div>

          {/* Option 4: Quantum Rings */}
          <div
            onClick={() => setSelected(4)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 4 ? 'border-pink-500 shadow-2xl shadow-pink-500/50 scale-105' : 'border-slate-700/50 hover:border-pink-400/50 hover:shadow-xl hover:shadow-pink-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[3].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Multi-layer rotating rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="absolute" style={{ animationDelay: `${i * 0.3}s` }}>
                    <div
                      className="rounded-full border-4 animate-[quantumRing_4s_linear_infinite]"
                      style={{
                        width: `${120 + i * 50}px`,
                        height: `${120 + i * 50}px`,
                        borderImage: `linear-gradient(${i * 90}deg, rgba(236, 72, 153, 0.8), rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.4)) 1`,
                        borderRadius: '50%',
                        animationDelay: `${i * -0.5}s`
                      }}
                    />
                  </div>
                ))}
                <div className="absolute w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[3].name}</h3>
              <p className="text-slate-400 text-sm">{options[3].description}</p>
            </div>
          </div>

          {/* Option 5: Digital Rain */}
          <div
            onClick={() => setSelected(5)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 5 ? 'border-emerald-500 shadow-2xl shadow-emerald-500/50 scale-105' : 'border-slate-700/50 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[4].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Matrix rain effect */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 w-1 animate-[rain_3s_linear_infinite]"
                    style={{
                      left: `${i * 8.5}%`,
                      height: '100%',
                      animationDelay: `${Math.random() * 3}s`,
                      background: 'linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.8), transparent)',
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10 text-center">
                <div className="text-4xl font-bold text-emerald-400 font-mono" style={{
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.8)'
                }}>
                  CareerCraft AI
                </div>
                <div className="mt-4 text-emerald-300/70 text-xs font-mono">{'> Initializing...'}</div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[4].name}</h3>
              <p className="text-slate-400 text-sm">{options[4].description}</p>
            </div>
          </div>

          {/* Option 6: Energy Sphere */}
          <div
            onClick={() => setSelected(6)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 6 ? 'border-violet-500 shadow-2xl shadow-violet-500/50 scale-105' : 'border-slate-700/50 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[5].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Pulsing energy sphere layers */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-[sphere_3s_ease-in-out_infinite]"
                    style={{
                      width: `${80 + i * 30}px`,
                      height: `${80 + i * 30}px`,
                      background: `radial-gradient(circle, rgba(139, 92, 246, ${0.3 - i * 0.05}), transparent)`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
                <div className="absolute w-20 h-20 bg-violet-500 rounded-full blur-2xl animate-pulse"></div>
              </div>
              {/* Energy waves */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="absolute rounded-full border-2 border-violet-400/40 animate-[ripple_2s_ease-out_infinite]"
                    style={{
                      width: '100px',
                      height: '100px',
                      animationDelay: `${i * 0.7}s`
                    }}
                  />
                </div>
              ))}
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[5].name}</h3>
              <p className="text-slate-400 text-sm">{options[5].description}</p>
            </div>
          </div>

          {/* Option 7: Prism Refraction */}
          <div
            onClick={() => setSelected(7)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 7 ? 'border-amber-500 shadow-2xl shadow-amber-500/50 scale-105' : 'border-slate-700/50 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[6].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Rainbow prism rays */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(7)].map((_, i) => {
                  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#a855f7']
                  return (
                    <div
                      key={i}
                      className="absolute h-1 animate-[prism_3s_ease-in-out_infinite]"
                      style={{
                        width: '200px',
                        background: `linear-gradient(90deg, transparent, ${colors[i]}, transparent)`,
                        transform: `rotate(${i * 25}deg)`,
                        transformOrigin: 'center',
                        opacity: 0.6,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  )
                })}
                <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:300%_auto]">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[6].name}</h3>
              <p className="text-slate-400 text-sm">{options[6].description}</p>
            </div>
          </div>

          {/* Option 8: Atom Structure */}
          <div
            onClick={() => setSelected(8)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 8 ? 'border-sky-500 shadow-2xl shadow-sky-500/50 scale-105' : 'border-slate-700/50 hover:border-sky-400/50 hover:shadow-xl hover:shadow-sky-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[7].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Nucleus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-sky-400 rounded-full blur-sm animate-pulse"></div>
                {/* Electron orbits */}
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div
                      className="absolute rounded-full border border-sky-400/30"
                      style={{
                        width: `${120 + i * 60}px`,
                        height: `${120 + i * 60}px`,
                        transform: `rotate(${i * 60}deg)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: `${-(60 + i * 30)}px`,
                        marginTop: `${-(60 + i * 30)}px`
                      }}
                    />
                    {/* Electrons */}
                    <div
                      className="absolute w-4 h-4 bg-sky-400 rounded-full animate-orbit"
                      style={{
                        left: '50%',
                        top: '50%',
                        animationDuration: `${2 + i * 0.5}s`,
                        animationDelay: `${i * -0.5}s`,
                        '--orbit-size': `${60 + i * 30}px`
                      } as any}
                    />
                  </div>
                ))}
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[7].name}</h3>
              <p className="text-slate-400 text-sm">{options[7].description}</p>
            </div>
          </div>

          {/* Option 9: Liquid Metal */}
          <div
            onClick={() => setSelected(9)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 9 ? 'border-slate-400 shadow-2xl shadow-slate-400/50 scale-105' : 'border-slate-700/50 hover:border-slate-400/50 hover:shadow-xl hover:shadow-slate-400/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full text-white text-xs font-bold shadow-lg">
              {options[8].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Liquid metal blobs */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-slate-300 to-slate-500 animate-[liquid_4s_ease-in-out_infinite]"
                    style={{
                      width: `${40 + i * 20}px`,
                      height: `${40 + i * 20}px`,
                      filter: 'blur(8px)',
                      opacity: 0.4,
                      animationDelay: `${i * 0.4}s`
                    }}
                  />
                ))}
                <div className="absolute w-40 h-40 bg-slate-400/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[8].name}</h3>
              <p className="text-slate-400 text-sm">{options[8].description}</p>
            </div>
          </div>

          {/* Option 10: Hexagon Grid */}
          <div
            onClick={() => setSelected(10)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 10 ? 'border-indigo-500 shadow-2xl shadow-indigo-500/50 scale-105' : 'border-slate-700/50 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[9].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Hexagon pattern */}
              <div className="absolute inset-0">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-12 h-14 animate-pulse"
                    style={{
                      left: `${15 + (i % 6) * 15}%`,
                      top: `${20 + Math.floor(i / 6) * 25}%`,
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      background: i % 3 === 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[9].name}</h3>
              <p className="text-slate-400 text-sm">{options[9].description}</p>
            </div>
          </div>

          {/* Option 11: Warp Speed */}
          <div
            onClick={() => setSelected(11)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 11 ? 'border-blue-500 shadow-2xl shadow-blue-500/50 scale-105' : 'border-slate-700/50 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[10].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Light streaks */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[warp_1.5s_linear_infinite]"
                    style={{
                      height: `${Math.random() * 100 + 50}px`,
                      left: `${Math.random() * 100}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      opacity: 0.6,
                      animationDelay: `${Math.random() * 1.5}s`
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-white animate-pulse">
                  CareerCraft AI
                </div>
                <p className="text-center text-blue-300/60 mt-3 text-xs">Engaging hyperdrive...</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[10].name}</h3>
              <p className="text-slate-400 text-sm">{options[10].description}</p>
            </div>
          </div>

          {/* Option 12: Fractal Bloom */}
          <div
            onClick={() => setSelected(12)}
            className={`group relative border-2 rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selected === 12 ? 'border-rose-500 shadow-2xl shadow-rose-500/50 scale-105' : 'border-slate-700/50 hover:border-rose-400/50 hover:shadow-xl hover:shadow-rose-500/30'}`}
          >
            <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full text-white text-xs font-bold shadow-lg">
              {options[11].tag}
            </div>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
              {/* Fractal petals */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-32 h-32 animate-[bloom_4s_ease-in-out_infinite]"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-16 rounded-full"
                      style={{
                        background: `radial-gradient(ellipse at center, rgba(244, 63, 94, ${0.5 - i * 0.05}), transparent)`
                      }}
                    />
                  </div>
                ))}
                <div className="absolute w-20 h-20 bg-rose-500/30 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  CareerCraft AI
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white mb-1">{options[11].name}</h3>
              <p className="text-slate-400 text-sm">{options[11].description}</p>
            </div>
          </div>

        </div>

        {/* Premium Selection Footer */}
        <div className="relative p-10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border-2 border-slate-700/50 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient"></div>
          <div className="relative">
            {selected ? (
              <div className="text-center space-y-6">
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold text-sm mb-4">
                  SELECTED
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {options[selected - 1].name}
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  {options[selected - 1].description}
                </p>
                <div className="pt-4">
                  <div className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-purple-500/50 animate-pulse">
                    Say: "Implement option {selected}"
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                  Click any animation to select
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Each animation is meticulously crafted with cutting-edge CSS techniques, smooth transitions, and stunning visual effects
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-size, 100px)) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-size, 100px)) rotate(-360deg); }
        }
        @keyframes helix {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(40px) translateY(-10px); }
        }
        @keyframes helixReverse {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-40px) translateY(10px); }
        }
        @keyframes quantumRing {
          0% { transform: rotate(0deg) scale(1); opacity: 0.8; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.4; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.8; }
        }
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes sphere {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes prism {
          0%, 100% { transform: translateX(-50px) rotate(0deg); opacity: 0; }
          50% { transform: translateX(50px) rotate(180deg); opacity: 1; }
        }
        @keyframes liquid {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { transform: translate(20px, -20px) scale(1.1); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes shimmer {
          0% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.3) saturate(1.5); }
          100% { filter: brightness(1) saturate(1); }
        }
        @keyframes warp {
          0% { transform: translateX(-200%) scaleX(0); opacity: 0; }
          50% { opacity: 1; scaleX(1); }
          100% { transform: translateX(200%) scaleX(0); opacity: 0; }
        }
        @keyframes bloom {
          0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.1) rotate(180deg); opacity: 0.7; }
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}
