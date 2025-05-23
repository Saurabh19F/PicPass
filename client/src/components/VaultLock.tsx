import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

export default function VaultLock() {
  const [locked, setLocked] = useState(true);

  const isLocked = locked;
  const tooltipText = isLocked ? "Vault is Secured 🔒" : "Vault is Open 🔓";

  return (
    <div className="fixed top-4 right-4 z-50">
      <Tooltip id="vault-tooltip" place="left" />

      <motion.button
        onClick={() => setLocked(!locked)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        data-tooltip-id="vault-tooltip"
        data-tooltip-content={tooltipText}
        aria-label={tooltipText}
        title={tooltipText}
        className={`p-3 rounded-full shadow-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isLocked
            ? "bg-green-600 border-green-400 hover:bg-green-700"
            : "bg-red-600 border-red-400 hover:bg-red-700 animate-pulse"
        }`}
      >
        {isLocked ? (
          <Lock className="text-white" size={24} />
        ) : (
          <Unlock className="text-white" size={24} />
        )}
      </motion.button>
    </div>
  );
}
