// App.js
import React, { useState, useEffect, useRef } from 'react';
import image1 from './images/tuludimtu.png'
import magic from './images/magic.png'
import port from './images/port.png'
import cvPdf from './assets/daniel-sheleme-cv.pdf';
import bg from './images/bg.png';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div className="App">
      <CosmicBackground />
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

// Elite Cosmic Background with Particle System
const CosmicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle System
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.alpha = 0.1 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 150 }, () => new Particle());

    // Nebula Effect
    const drawNebula = (time) => {
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.7,
        0,
        canvas.width * 0.3,
        canvas.height * 0.7,
        canvas.width * 0.8
      );
      
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)');
      gradient.addColorStop(0.3, 'rgba(30, 41, 59, 0.6)');
      gradient.addColorStop(0.6, 'rgba(51, 65, 85, 0.4)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(time * 0.0005) * 0.1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    // Animated Grid
    const drawGrid = (time) => {
      const gridSize = 50;
      const offsetX = (time * 0.02) % gridSize;
      const offsetY = (time * 0.01) % gridSize;

      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = -offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Pulsing Orbs
    const drawOrbs = (time) => {
      const orbs = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 200, speed: 0.0003 },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, size: 150, speed: 0.0004 },
        { x: canvas.width * 0.4, y: canvas.height * 0.8, size: 180, speed: 0.0005 }
      ];

      orbs.forEach(orb => {
        const pulse = Math.sin(time * orb.speed) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size * pulse
        );
        
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background elements
      drawNebula(time);
      drawGrid(time);
      drawOrbs(time);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full bg-slate-950"
    />
  );
};

// Elite Header with Magnetic Effects
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-900/80 backdrop-blur-xl py-3 shadow-2xl shadow-blue-500/10 border-b border-slate-800/50' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="group relative">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            Daniel<span className="text-white">.</span>
          </div>
          <div className="absolute -inset-2 bg-blue-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="relative group"
            >
              <div className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === item.href.slice(1)
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}>
                <span className="relative z-10">{item.name}</span>
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                <div className="absolute inset-[1px] rounded-lg bg-slate-900 -z-10"></div>
              </div>
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-6 relative">
            <span className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 top-3' : 'top-1'
            }`}></span>
            <span className={`absolute w-6 h-0.5 bg-current transition-all duration-300 top-3 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}></span>
            <span className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 top-3' : 'top-5'
            }`}></span>
          </div>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-500 overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-slate-900/95 backdrop-blur-xl py-4 px-6 border-t border-slate-800/50">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? 'bg-blue-500/20 text-blue-400 border-l-4 border-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

// Ultimate Hero Section with 3D Matrix Effect
const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "WEB DEVELOPER & DESIGNER";
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 50);
    
    return () => clearInterval(typingEffect);
  }, []);

  // Matrix Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0ea5e9';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Matrix Background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-20 opacity-40" />
      
      {/* Animated Gradient Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)`
        }}
      ></div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Content */}
        <div className="lg:w-1/2 mb-16 lg:mb-0 text-center lg:text-left">
          {/* Elite Badge */}
          <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-blue-300 text-sm font-semibold">AVAILABLE FOR FREELANCE PROJECTS</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">
              DANIEL
            </span>
            <span className="block text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text">
              SHELEME
            </span>
          </h1>
          
          {/* Typing Animation */}
          <div className="text-2xl lg:text-4xl font-bold mb-8 h-12">
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
              {displayText}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 text-xl mb-12 max-w-2xl leading-relaxed">
            Passionate web developer specializing in creating <span className="text-cyan-400 font-bold">modern, responsive websites</span> and 
            <span className="text-cyan-400 font-bold"> web applications</span>. I transform ideas into digital reality with clean code and 
            innovative solutions.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#projects" className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl transform group-hover:translate-y-1 transition-transform duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg transform group-hover:-translate-y-1 transition-transform duration-300 shadow-2xl shadow-blue-500/25">
                <span className="flex items-center justify-center">
                  VIEW MY WORK
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </a>
            
            <a href="#contact" className="group relative overflow-hidden border-2 border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-400 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-cyan-500/10 backdrop-blur-sm">
              <span className="flex items-center justify-center">
                HIRE ME
                <svg className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </a>
          </div>

          {/* CV Download Buttons - WORKING VERSION */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
            {/* Download CV Button */}
            <a 
              href={cvPdf}
              download="Daniel-Sheleme-CV.pdf"
              className="group relative overflow-hidden border-2 border-green-400/50 text-green-300 hover:text-white hover:border-green-400 px-6 py-3 rounded-xl font-bold text-md transition-all duration-300 hover:scale-105 hover:bg-green-500/10 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOWNLOAD CV
              </span>
            </a>
            
            {/* View CV Button */}
            <a 
              href={cvPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden border-2 border-purple-400/50 text-purple-300 hover:text-white hover:border-purple-400 px-6 py-3 rounded-xl font-bold text-md transition-all duration-300 hover:scale-105 hover:bg-purple-500/10 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                VIEW CV
              </span>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-16 justify-center lg:justify-start">
            {[
              { value: '20+', label: 'PROJECTS COMPLETED', color: 'from-blue-400 to-cyan-400' },
              { value: '3+', label: 'YEARS EXPERIENCE', color: 'from-green-400 to-emerald-400' },
              { value: '100%', label: 'CLIENT SATISFACTION', color: 'from-purple-400 to-pink-400' },
              { value: '15+', label: 'TECHNOLOGIES', color: 'from-orange-400 to-red-400' }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center group cursor-pointer">
                <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm font-semibold tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 3D Hero Visual */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative">
            {/* Main Orbital System */}
            <div className="w-96 h-96 relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl"></div>
              
              {/* Rotating Rings */}
              <div className="absolute inset-0">
                <div className="absolute inset-8 border-2 border-blue-400/30 rounded-full"></div>
                <div className="absolute inset-16 border-2 border-cyan-400/20 rounded-full"></div>
                <div className="absolute inset-24 border-2 border-blue-300/10 rounded-full"></div>
              </div>
              
              {/* Central Core */}
              <div className="absolute inset-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-full flex items-center justify-center shadow-2xl border border-slate-700/50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-cyan-400/25">
                    <i className="fas fa-code text-white text-2xl"></i>
                  </div>
                  <div className="text-white font-black text-lg">WEB DEVELOPER</div>
                  <div className="text-cyan-400 text-sm font-semibold">& DESIGNER</div>
                </div>
              </div>

              {/* Orbiting Elements */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50"></div>
            </div>

            {/* Floating Tech Elements */}
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl rotate-45 opacity-80 flex items-center justify-center">
              <i className="fas fa-code text-white text-xl -rotate-45"></i>
            </div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl opacity-80 flex items-center justify-center">
              <i className="fas fa-palette text-white text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center group cursor-pointer">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-bounce group-hover:bg-cyan-300"></div>
        </div>
      </div>
    </section>
  );
};

// Elite About Section
const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-sm"></div>
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(30deg, transparent 24%, rgba(56, 189, 248, 0.1) 25%, rgba(56, 189, 248, 0.1) 26%, transparent 27%, transparent 74%, rgba(56, 189, 248, 0.1) 75%, rgba(56, 189, 248, 0.1) 76%, transparent 77%, transparent), linear-gradient(60deg, transparent 24%, rgba(56, 189, 248, 0.1) 25%, rgba(56, 189, 248, 0.1) 26%, transparent 27%, transparent 74%, rgba(56, 189, 248, 0.1) 75%, rgba(56, 189, 248, 0.1) 76%, transparent 77%, transparent)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-7xl font-black mb-6">
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
              ABOUT ME
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Passionate web developer dedicated to creating exceptional digital experiences
          </p>
        </div>
        
        <div className="flex flex-col xl:flex-row items-center gap-16">
          {/* Profile Visual */}
          <div className="xl:w-2/5 flex justify-center">
            <div className="relative group">
              <div className="w-96 h-96 relative">
                {/* Holographic Effect */}
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-2xl"></div>
                
                {/* Rotating Frame */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-1">
                  <div className="w-full h-full bg-slate-900 rounded-3xl"></div>
                </div>
                
                {/* Profile Content */}
                <div className="absolute inset-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 group-hover:border-cyan-400/50 transition-colors duration-300">
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-cyan-400/25">
                       <div className='relative group'>
  {/* Outer glow */}
  <div className='absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500'></div>
  
  {/* Animated ring */}
  <div className='absolute -inset-2 border-2 border-cyan-400/30 rounded-full animate-spin-slow'>
    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent'></div>
  </div>
  
  {/* Main image */}
  <img 
    src={bg} 
    alt='Daniel sheleme' 
    className='relative w-32 h-32 rounded-full border-2 border-cyan-400/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-cyan-400/20 transform transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-400/80 z-10'
  />
  
  {/* Inner glow */}
  <div className='absolute inset-0 rounded-full bg-cyan-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
</div>
                      </div>
                      <div className="text-white font-black text-2xl mb-2">DANIEL SHELEME</div>
                      <div className="text-cyan-400 text-lg font-semibold">WEB DEVELOPER</div>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center justify-center mt-6 space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="text-green-400 text-sm font-semibold">OPEN FOR NEW PROJECTS</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badges */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                  <i className="fas fa-award text-white text-xl"></i>
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <i className="fas fa-heart text-white text-lg"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="xl:w-3/5">
            <h3 className="text-4xl lg:text-5xl font-black mb-8 text-white">
              <span className="text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                CREATING
              </span>
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text block">
                DIGITAL SOLUTIONS
              </span>
            </h3>
            
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p>
                Hello! I'm <span className="text-cyan-400 font-black">Daniel Sheleme</span>, a dedicated web developer with 
                <span className="text-cyan-400 font-black"> 3+ years</span> of experience crafting beautiful, functional websites 
                and web applications. My passion lies in turning complex problems into simple, elegant solutions.
              </p>
              
              <p>
                I specialize in modern web technologies including React, JavaScript, HTML5, CSS3, and responsive design. 
                I believe in writing clean, maintainable code and creating user experiences that are both intuitive and engaging.
              </p>
              
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
                or sharing my knowledge with the developer community. I'm always excited to take on new challenges and 
                help bring innovative ideas to life.
              </p>
            </div>

            {/* Tech Focus */}
            <div className="mt-12 p-8 bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
              <h4 className="text-2xl font-black mb-6 text-white">WHAT I DO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { service: 'Frontend Development', desc: 'React, JavaScript, HTML5, CSS3', icon: 'fas fa-code' },
                  { service: 'Responsive Design', desc: 'Mobile-first, cross-browser compatible', icon: 'fas fa-mobile-alt' },
                  { service: 'Web Applications', desc: 'Interactive and dynamic web solutions', icon: 'fas fa-laptop-code' },
                  { service: 'UI/UX Implementation', desc: 'Converting designs to functional code', icon: 'fas fa-paint-brush' }
                ].map((item, index) => (
                  <div 
                    key={item.service}
                    className="p-4 rounded-xl border-2 border-cyan-400/30 bg-slate-800/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
                  >
                    <i className={`${item.icon} text-cyan-400 text-xl mb-2`}></i>
                    <div className="text-white font-bold text-lg mb-1">{item.service}</div>
                    <div className="text-slate-400 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                { metric: 'Projects Completed', value: '20+', icon: 'fas fa-check-circle' },
                { metric: 'Happy Clients', value: '15+', icon: 'fas fa-smile' },
                { metric: 'Years Coding', value: '3+', icon: 'fas fa-clock' },
                { metric: 'Coffee Cups', value: '1000+', icon: 'fas fa-coffee' }
              ].map((stat, index) => (
                <div 
                  key={stat.metric}
                  className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group"
                >
                  <i className={`${stat.icon} text-cyan-400 text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}></i>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm font-semibold">{stat.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Skills Section with Dropdown
const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');
  
  const skillCategories = {
    frontend: {
      title: 'Frontend Development',
      skills: [
        { name: 'HTML5', level: 95, icon: 'fab fa-html5', color: 'from-orange-500 to-red-500' },
        { name: 'CSS3', level: 90, icon: 'fab fa-css3-alt', color: 'from-blue-500 to-cyan-500' },
        { name: 'JavaScript', level: 88, icon: 'fab fa-js', color: 'from-yellow-400 to-yellow-600' },
        { name: 'React', level: 85, icon: 'fab fa-react', color: 'from-cyan-400 to-blue-500' },
        { name: 'TypeScript', level: 80, icon: 'fas fa-code', color: 'from-blue-400 to-indigo-500' },
        { name: 'Bootstrap', level: 90, icon: 'fab fa-bootstrap', color: 'from-purple-500 to-pink-500' }
      ]
    },
    backend: {
      title: 'Backend Development',
      skills: [
        { name: 'Node.js', level: 82, icon: 'fab fa-node-js', color: 'from-green-500 to-emerald-500' },
        { name: 'Next.js', level: 78, icon: 'fas fa-cube', color: 'from-yellow-400 to-blue-500' },
        { name: 'Express.js', level: 75, icon: 'fas fa-server', color: 'from-purple-400 to-indigo-500' },
        { name: 'MySQL', level: 85, icon: 'fas fa-database', color: 'from-blue-400 to-cyan-500' },
        { name: 'MongoDB', level: 80, icon: 'fas fa-server', color: 'from-green-400 to-emerald-400' },
        { name: 'REST APIs', level: 88, icon: 'fas fa-cloud', color: 'from-teal-400 to-cyan-500' }
      ]
    },
    tools: {
      title: 'Tools & Technologies',
      skills: [
        { name: 'Git', level: 90, icon: 'fab fa-git-alt', color: 'from-orange-500 to-red-500' },
        { name: 'Webpack', level: 75, icon: 'fas fa-cube', color: 'from-blue-500 to-cyan-500' },
        { name: 'Figma', level: 85, icon: 'fas fa-pen-fancy', color: 'from-purple-500 to-pink-500' },
        { name: 'VS Code', level: 95, icon: 'fas fa-code', color: 'from-blue-400 to-indigo-500' },
        { name: 'Photoshop', level: 70, icon: 'fas fa-palette', color: 'from-blue-500 to-purple-500' },
        { name: 'Linux', level: 80, icon: 'fab fa-linux', color: 'from-yellow-400 to-black' }
      ]
    }
  };

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
      
      {/* Binary Rain Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(transparent 0%, rgba(56, 189, 248, 0.1) 50%, transparent 100%)`
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-7xl font-black mb-6">
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
              MY SKILLS
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Skills Category Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(skillCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl shadow-cyan-500/25'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-cyan-400/50 hover:text-cyan-300'
              }`}
            >
              {skillCategories[category].title}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories[activeCategory].skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="group relative bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              {/* Holographic Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                {/* Skill Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${skill.color} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                    <i className={`${skill.icon} text-white text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{skill.name}</h3>
                    <div className={`text-transparent bg-gradient-to-r ${skill.color} bg-clip-text text-lg font-bold`}>
                      {skill.level}%
                    </div>
                  </div>
                </div>
                
                {/* Animated Progress */}
                <div className="space-y-4">
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  
                  {/* Skill Level Indicator */}
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">BASIC</span>
                    <span className="text-slate-500">INTERMEDIATE</span>
                    <span className={`text-transparent bg-gradient-to-r ${skill.color} bg-clip-text`}>ADVANCED</span>
                  </div>
                </div>
              </div>

              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                <div className="absolute inset-[2px] rounded-3xl bg-slate-900"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills Info */}
        <div className="mt-20 bg-slate-800/30 rounded-3xl p-12 border border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-4xl font-black text-center mb-8 text-white">
            CONTINUOUS LEARNING
          </h3>
          <p className="text-slate-300 text-xl text-center max-w-4xl mx-auto leading-relaxed mb-8">
            Technology evolves rapidly, and I'm committed to staying current with the latest trends and best practices. 
            I regularly explore new frameworks, tools, and methodologies to enhance my skills and deliver better solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <i className="fas fa-book text-cyan-400 text-4xl mb-4"></i>
              <h4 className="text-2xl font-black text-white mb-2">Always Learning</h4>
              <p className="text-slate-400">Continuously updating my skills with new technologies</p>
            </div>
            <div className="p-6">
              <i className="fas fa-lightbulb text-cyan-400 text-4xl mb-4"></i>
              <h4 className="text-2xl font-black text-white mb-2">Problem Solver</h4>
              <p className="text-slate-400">Finding creative solutions to complex challenges</p>
            </div>
            <div className="p-6">
              <i className="fas fa-hands-helping text-cyan-400 text-4xl mb-4"></i>
              <h4 className="text-2xl font-black text-white mb-2">Team Player</h4>
              <p className="text-slate-400">Collaborating effectively with designers and developers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Projects = () => {
  const projects = [
    {
      title: 'Tullu Dimtu School Website',
      description: 'A fully responsive e-commerce platform with shopping cart, user authentication, and payment integration.',
      image: image1,
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveLink: 'https://tuludimtuschool.vercel.app/home',
      githubLink: 'https://github.com/danidan902/Tullu-dimtu-school-frontend',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Web Chatting platform',
      description: 'Modern portfolio website with smooth animations, responsive design, and contact form functionality.',
      image: magic,
      tags: ['React', 'Tailwind CSS', 'EmailJS', 'Framer Motion'],
      liveLink: 'https://danichatting.vercel.app/',
      githubLink: 'https://github.com/danidan902/Dani-Frontend-Chatting',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Personal Portfolio Website',
      description: 'Productivity application for task management with drag-and-drop functionality and real-time updates.',
      image: port,
      tags: ['JavaScript', 'Firebase', 'CSS3', 'HTML5'],
      liveLink: 'https://danidanportfolio.vercel.app/',
      githubLink: 'https://github.com/danidan902',
      gradient: 'from-green-500 to-emerald-500'
    },
  
  ];

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-7xl font-black mb-6">
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              MY PROJECTS
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            A collection of projects that showcase my skills and passion for web development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.title}
              className="group relative bg-slate-800/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
            >
              {/* Project Header */}
              <div className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                                  {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                      {project.icon}
                    </div>
                  </div>
                )}
                </div>

                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>

             
              <div className="p-8 relative">
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 mb-6 leading-relaxed text-lg">
                  {project.description}
                </p>

                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 text-sm font-semibold hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-4">


                   <a 
                    href={project.liveLink}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-4 px-6 rounded-xl font-black hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 text-lg"
                  >
                    View Project
                  </a>
                  
                  <a 
                    href={project.githubLink}
                    className="flex-1 border-2 border-slate-600 text-slate-300 text-center py-4 px-6 rounded-xl font-black hover:border-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105 text-lg"
                  >
                    SOURCE CODE
                  </a>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                <div className="absolute inset-[2px] rounded-3xl bg-slate-900"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="text-slate-400 text-xl mb-8">
            Interested in working together?
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
          >
            START A PROJECT
            <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

// Contact Section



const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Send form data to backend using Axios directly
      const response = await axios.post('https://api-node-backend.onrender.com/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Success handling
      setSubmitStatus({
        type: 'success',
        message: response.data.message || 'Thank you for your message! I will get back to you soon.'
      });
      
      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        message: '' 
      });

    } catch (error) {
      // Error handling
      console.error('Contact form submission error:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred.';
      }

      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 backdrop-blur-sm"></div>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-7xl font-black mb-6">
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
              GET IN TOUCH
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Let's discuss your next project and bring your ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h3 className="text-4xl font-black text-white mb-6">Let's Work Together</h3>
              <p className="text-slate-300 text-xl leading-relaxed">
                I'm always excited to take on new projects and collaborate with amazing people. 
                Whether you need a website, web application, or just want to chat about technology, 
                I'd love to hear from you.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {[
                {
                  icon: 'fas fa-map-marker-alt',
                  title: 'LOCATION',
                  content: 'Addis Ababa, Ethiopia',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: 'fas fa-envelope',
                  title: 'EMAIL',
                  content: 'daniel@example.com',
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  icon: 'fas fa-phone',
                  title: 'PHONE',
                  content: '+251 912 345 678',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: 'fas fa-clock',
                  title: 'AVAILABILITY',
                  content: 'Available for new projects',
                  gradient: 'from-orange-500 to-yellow-500'
                }
              ].map((item, index) => (
                <div 
                  key={item.title}
                  className="flex items-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${item.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <div className="text-white font-black text-lg mb-1">{item.title}</div>
                    <div className="text-slate-300 text-lg">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-2xl font-black text-white mb-6">FOLLOW ME</h4>
              <div className="flex space-x-4">
                {[
                  { icon: 'fab fa-github', href: 'https://github.com/danidan902', gradient: 'from-gray-600 to-gray-800' },
                  { icon: 'fab fa-tiktok', href: 'https://www.tiktok.com/@dani.dan195', gradient: 'from-blue-600 to-blue-800' },
                  { icon: 'fab fa-twitter', href: 'https://x.com/DaniDan43961658', gradient: 'from-sky-500 to-sky-700' },
                  { icon: 'fab fa-instagram', href: 'https://www.instagram.com/dan2122n/', gradient: 'from-pink-500 to-rose-600' }
                ].map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-16 h-16 bg-gradient-to-r ${social.gradient} rounded-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl`}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-12 border border-slate-700/50">
            {/* Status Message */}
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-2xl text-center font-bold text-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-slate-300 mb-4 font-black text-lg">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300 text-lg"
                    placeholder="Enter your name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-slate-300 mb-4 font-black text-lg">
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300 text-lg"
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-slate-300 mb-4 font-black text-lg">
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300 text-lg resize-none"
                  placeholder="Tell me about your project..."
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-6 px-8 rounded-2xl font-black text-xl transition-all duration-300 ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    SENDING...
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <i className="fas fa-paper-plane ml-3"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
















// Footer
const Footer = () => {
  return (
    <footer className="relative bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="mb-8 lg:mb-0 text-center lg:text-left">
            <a href="#" className="group relative">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                DANIEL<span className="text-white">.</span>
              </div>
              <div className="absolute -inset-2 bg-blue-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <p className="text-slate-400 mt-4 text-lg">WEB DEVELOPER & DESIGNER</p>
          </div>
          
          <div className="flex space-x-8 mb-8 lg:mb-0">
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 font-semibold text-lg"
              >
                {item}
              </a>
            ))}
          </div>
          
          <div className="text-slate-400 text-center lg:text-right">
            <p className="text-lg">&copy; {new Date().getFullYear()} DANIEL SHELEME. ALL RIGHTS RESERVED.</p>
            <p className="mt-2 text-slate-500">BUILT WITH REACT AND TAILWIND CSS</p>
          </div>
        </div>
        
        {/* SEO Footer Content */}
        <div className="mt-12 pt-12 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            Daniel Sheleme - Web Developer & Designer specializing in React.js, JavaScript, HTML5, CSS3, 
            responsive web design, and modern web development. Based in Addis Ababa, Ethiopia.
            Available for freelance projects and web development collaborations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default App;
