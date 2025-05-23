import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";

export default function HomeButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-5 left-5 z-20"
    >
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-white/80 dark:bg-pink-800/80 backdrop-blur-sm text-indigo-700 dark:text-white font-medium hover:scale-105 hover:shadow-lg hover:bg-white dark:hover:bg-purple-700 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <FaHome className="text-lg" />
        <span className="hidden sm:inline">Home</span>
      </Link>
    </motion.div>
  );
}

