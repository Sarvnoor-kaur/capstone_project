import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles, ArrowRight, Zap } from "lucide-react";
import "./AICompanionPromo.css";

const AICompanionPromo = () => {
  const navigate = useNavigate();

  const features = [
    "24/7 Emotional Support",
    "Personalized Guidance",
    "Private & Confidential",
  ];

  return (
    <motion.section
      className="ai-companion-promo"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="promo-content">
        {/* Left Content */}
        <div className="promo-text">
          <motion.div
            className="promo-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles size={16} />
            <span>AI-Powered</span>
          </motion.div>

          <motion.h2
            className="promo-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Meet Your AI Wellness Companion
          </motion.h2>

          <motion.p
            className="promo-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Get personalized mental health support whenever you need it. Our AI companion is trained to understand, support, and guide you through your wellness journey.
          </motion.p>

          {/* Features List */}
          <motion.ul
            className="promo-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {features.map((feature, index) => (
              <li key={index} className="promo-feature-item">
                <div className="feature-icon">
                  <Zap size={16} />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </motion.ul>

          {/* CTA Button */}
          <motion.button
            className="promo-cta"
            onClick={() => navigate("/ai-chat")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={20} />
            <span>Start Conversation</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>

        {/* Right Illustration */}
        <motion.div
          className="promo-illustration"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="illustration-wrapper">
            {/* 3D-style Illustration using Image */}
            <img
              src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80"
              alt="AI Companion Illustration"
              className="companion-image"
            />

            {/* Floating Elements */}
            <motion.div
              className="floating-element element-1"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              💬
            </motion.div>

            <motion.div
              className="floating-element element-2"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              ✨
            </motion.div>

            <motion.div
              className="floating-element element-3"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              💜
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AICompanionPromo;
