import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, FileText, Video, Headphones,
  ChevronRight, ArrowUpRight,
} from "lucide-react";
import "./WellnessResources.css";

const WellnessResources = () => {
  const navigate = useNavigate();

  const resources = [
    {
      id: 1,
      title: "Understanding Anxiety in College",
      type: "Article",
      icon: FileText,
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80",
      color: "#DCD6F7",
      description:
        "Learn about common anxiety triggers in academic settings and how to manage them effectively.",
    },
    {
      id: 2,
      title: "Mindfulness for Beginners",
      type: "Video Guide",
      icon: Video,
      readTime: "12 min watch",
      image:
        "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&q=80",
      color: "#B8E6D5",
      description:
        "A step-by-step introduction to mindfulness practices for everyday student life.",
    },
    {
      id: 3,
      title: "Building Healthy Sleep Habits",
      type: "Guide",
      icon: BookOpen,
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1515894203077-d1b3b5355eb6?w=500&q=80",
      color: "#F4CDBB",
      description:
        "Practical strategies to improve your sleep quality and establish a consistent routine.",
    },
    {
      id: 4,
      title: "Stress-Relief Soundscapes",
      type: "Audio",
      icon: Headphones,
      readTime: "20 min listen",
      image:
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80",
      color: "#A99BEA",
      description:
        "Curated ambient sounds and calming music to help you focus and de-stress.",
    },
  ];

  return (
    <section className="wellness-resources-section">
      <motion.div
        className="resources-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="resources-title">Learn & Grow</h2>
          <p className="resources-subtitle">
            Educational resources to support your mental wellness
          </p>
        </div>
        <button
          className="resources-view-all"
          onClick={() => navigate("/resources")}
        >
          <span>Browse Library</span>
          <ChevronRight size={20} />
        </button>
      </motion.div>

      <div className="resources-grid">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.article
              key={resource.id}
              className="resource-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/resources")}
            >
              <div className="resource-image-section">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="resource-image"
                  loading="lazy"
                />
                <div
                  className="resource-type-badge"
                  style={{ background: resource.color }}
                >
                  <Icon size={14} />
                  <span>{resource.type}</span>
                </div>
              </div>

              <div className="resource-content">
                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-description">{resource.description}</p>
                <div className="resource-footer">
                  <span className="resource-read-time">
                    {resource.readTime}
                  </span>
                  <button className="resource-link-btn">
                    <span>Read More</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default WellnessResources;
