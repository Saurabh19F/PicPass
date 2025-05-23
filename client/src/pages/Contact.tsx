import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6">Contact Me</h1>
      <p className="text-lg mb-10 text-center max-w-xl">
        Feel free to reach out to me via email or connect on the following platforms.
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* Email */}
        <a
          href="mailto:saurabhke4@gmail.com"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Mail className="w-5 h-5" />
          Mail
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/saurabh19f/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-700 hover:underline"
        >
          <Linkedin className="w-5 h-5" />
          LinkedIn
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/Saurabh19F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:underline"
        >
          <Github className="w-5 h-5" />
          GitHub
        </a>
      </div>
    </motion.div>
  );
}
