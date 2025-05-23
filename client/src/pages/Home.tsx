import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";



export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans">
    {/* ✅ Background video */}
    
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="fixed top-0 left-0 w-full h-full object-cover -z-20"
    >
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* ✅ Dark overlay for readability */}
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl -z-10" />
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-30 bg-black/30 backdrop-blur-md shadow-md">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">PicPass</h1>
          <span className="text-xs text-gray-400">Your Secure Digital Vault</span>
        </div>
        <div className="space-x-5 text-sm font-medium">
          <Link to="/login" className="hover:text-pink-400 transition">Login</Link>
          <Link to="/signup" className="hover:text-yellow-400 transition">Signup</Link>
          <a href="#contact" className="hover:text-green-400 transition">Contact</a>
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl"
        >
          Visual Security Meets Digital Vault
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-gray-300"
        >
          PicPass is your personal digital vault — store your important files and documents securely
          and access them anytime, anywhere. With visual login and OTP, your data stays safe and private.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex gap-6"
        >
          <Link
            to="/signup"
            className="px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 text-lg font-semibold rounded-full border border-white hover:bg-white hover:text-black transition duration-300"
          >
            Log In
          </Link>
        </motion.div>
      </div>

      {/* ✅ Features Section */}
      <div className="relative z-10 py-20 px-6 md:px-16 bg-black/30 backdrop-blur-lg">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12">
          Why Choose PicPass?
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Visual + OTP Login",
              desc: "PicPass combines graphical passwords and OTP for bulletproof security every time you log in.",
            },
            {
              title: "Secure Digital Vault",
              desc: "Safely upload and manage documents, PDFs, and files — encrypted and always accessible.",
            },
            {
              title: "Anytime Access",
              desc: "View your vault from any device, anytime — with blazing-fast file access and secure retrieval.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ Call to Action */}
      <div
        className="relative z-10 py-20 text-center px-6"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text mb-6"
        >
          Ready to protect your digital world with PicPass?
        </motion.h2>
        <Link
          to="/signup"
          className="px-8 py-4 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full shadow-xl hover:scale-105 transition"
        >
          Create Account
        </Link>
      </div>

      {/* ✅ Footer */}
      <footer
        id="contact"
        className="bg-black/80 text-white px-6 py-16 text-center border-t border-white/20"
      >
        <h3 className="text-3xl font-bold mb-4">Contact Us</h3>
        <p className="text-gray-400 max-w-xl mx-auto">
          Have questions or feedback? Reach out to our team through any of the platforms below.
        </p>

        <div className="mt-8 flex justify-center gap-8 flex-wrap">
          {/* Mail */}
          <a
            href="mailto:Saurabhke4@gmail.com" aria-label="Send email"
            className="hover:text-pink-400 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" />
            </svg>
            Mail
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/saurabh19f/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.6v2.2h.05c.5-.95 1.73-2.2 3.55-2.2 3.8 0 4.5 2.5 4.5 5.8V24h-4v-7.6c0-1.8 0-4.2-2.55-4.2-2.55 0-2.95 2-2.95 4.1V24h-4V8z" />
            </svg>
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Saurabh19F"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56v-1.94c-3.2.7-3.87-1.38-3.87-1.38-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.04 1.79 2.74 1.27 3.4.97.1-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.18 1.19.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.5 3.17-1.19 3.17-1.19.63 1.58.23 2.74.11 3.03.74.81 1.19 1.85 1.19 3.11 0 4.43-2.7 5.4-5.27 5.69.42.36.8 1.08.8 2.18v3.24c0 .31.21.68.8.56C20.71 21.4 24 17.08 24 12 24 5.65 18.35.5 12 .5z" />
            </svg>
            GitHub
          </a>
        </div>

        <div className="mt-10 text-sm text-gray-500">© 2025 PicPass. All rights reserved.</div>
      </footer>
    </div>
  );
}
