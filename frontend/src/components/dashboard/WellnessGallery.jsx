import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, Eye, Sparkles, Wind, Maximize2, Check,
  Compass, Bookmark,
} from "lucide-react";
import "./WellnessGallery.css";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Morning Mountain Meditation",
    category: "Meditation",
    categoryIcon: "🧘",
    duration: "5 min practice",
    quote: "Begin each sunrise with stillness. Your inner peace sets the tone for the day.",
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85",
    alt: "Meditating peacefully facing morning mountain mist",
    featured: true,
    likes: 42,
  },
  {
    id: 2,
    title: "Forest Breathing & Grounding",
    category: "Nature & Calm",
    categoryIcon: "🌿",
    duration: "Soundscape • 8 min",
    quote: "Breathe in the tranquility of the trees. Let your racing thoughts settle like leaves.",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=85",
    alt: "Sunlight streaming through tall green forest pines",
    featured: false,
    likes: 29,
  },
  {
    id: 3,
    title: "Mindful Journaling & Reflection",
    category: "Mindfulness",
    categoryIcon: "✍️",
    duration: "Reflection • 10 min",
    quote: "Put pen to paper. Release what worries you and celebrate three small wins.",
    src: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&q=85",
    alt: "Open journal notebook with warm tea and sunlight",
    featured: false,
    likes: 38,
  },
  {
    id: 4,
    title: "Ocean Tide Rhythmic Calm",
    category: "Nature & Calm",
    categoryIcon: "🌊",
    duration: "Breathing pace • 4 min",
    quote: "Inhale with the incoming wave, exhale with the outgoing tide. Steady and boundless.",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=85",
    alt: "Crystal clear turquoise ocean waves washing over soft sand",
    featured: false,
    likes: 56,
  },
  {
    id: 5,
    title: "Golden Hour Solitude",
    category: "Meditation",
    categoryIcon: "🌅",
    duration: "Sunset pause • 6 min",
    quote: "Give yourself permission to pause. You don't have to carry the whole world today.",
    src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=700&q=85",
    alt: "Golden sunset light bathing peaceful mountain horizon",
    featured: false,
    likes: 31,
  },
  {
    id: 6,
    title: "Restful Night Sanctuary",
    category: "Sleep & Rest",
    categoryIcon: "🌙",
    duration: "Sleep wind-down • 15 min",
    quote: "Dim the lights and quiet your mind. Sleep is the foundation of mental strength.",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=85",
    alt: "Cozy serene bedroom with ambient candlelight and lavender",
    featured: false,
    likes: 47,
  },
];

const CATEGORIES = [
  "All",
  "Meditation",
  "Nature & Calm",
  "Mindfulness",
  "Sleep & Rest",
];

const WellnessGallery = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});

  const filteredItems = activeCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSave = (e, id) => {
    e.stopPropagation();
    setSavedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="gallery-section" className="wellness-gallery-section" data-section="gallery-section">
      {/* ── Section Header ── */}
      <div className="gallery-header">
        <div className="gallery-header-left">
          <div className="gallery-badge">
            <Sparkles size={15} />
            <span>Curated Visual Sanctuary</span>
          </div>
          <h2 className="gallery-title">Wellness Inspiration</h2>
          <p className="gallery-subtitle">
            Visual sanctuary to ground your thoughts, inspire mindfulness, and invite calm
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="gallery-filter-tabs" role="tablist">
          {CATEGORIES.map((cat) => {
            const count = cat === "All"
              ? GALLERY_ITEMS.length
              : GALLERY_ITEMS.filter((i) => i.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                className={`gallery-filter-pill ${isActive ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Structured Editorial Grid ── */}
      <div className="gallery-grid-layout">
        {filteredItems.map((item, index) => {
          const isLiked = !!likedMap[item.id];
          const isSaved = !!savedMap[item.id];
          const currentLikes = item.likes + (isLiked ? 1 : 0);

          return (
            <motion.article
              key={item.id}
              className={`gallery-card ${item.featured && activeCategory === "All" ? "featured-card" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              onClick={() => setSelectedImage(item)}
            >
              {/* Image Container */}
              <div className="card-media-wrapper">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="card-media-img"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay for text readability */}
                <div className="card-media-gradient" />

                {/* Top Floating Badges */}
                <div className="card-top-bar">
                  <span className="card-category-pill">
                    <span className="cat-icon">{item.categoryIcon}</span>
                    <span>{item.category}</span>
                  </span>

                  <div className="card-actions-group">
                    <button
                      className={`card-icon-btn ${isSaved ? "saved" : ""}`}
                      onClick={(e) => toggleSave(e, item.id)}
                      aria-label="Save to favorites"
                      title={isSaved ? "Saved" : "Save"}
                    >
                      <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <button
                      className={`card-icon-btn ${isLiked ? "liked" : ""}`}
                      onClick={(e) => toggleLike(e, item.id)}
                      aria-label="Like"
                      title={isLiked ? "Liked" : "Like"}
                    >
                      <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                      <span className="like-counter">{currentLikes}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Permanent Content */}
                <div className="card-bottom-info">
                  <div className="card-duration-badge">
                    <span>{item.duration}</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-quote">"{item.quote}"</p>

                  <div className="card-hover-footer">
                    <span className="expand-hint">
                      <Maximize2 size={13} />
                      <span>View in Fullscreen</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="gallery-lightbox-modal"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setSelectedImage(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>

              <div className="lightbox-image-pane">
                <img
                  src={selectedImage.src.replace("w=700", "w=1400").replace("w=900", "w=1400")}
                  alt={selectedImage.alt}
                  className="lightbox-big-img"
                />
              </div>

              <div className="lightbox-details-pane">
                <div className="lightbox-meta-top">
                  <span className="lightbox-cat-badge">
                    {selectedImage.categoryIcon} {selectedImage.category}
                  </span>
                  <span className="lightbox-duration">{selectedImage.duration}</span>
                </div>

                <h3 className="lightbox-title-text">{selectedImage.title}</h3>

                <blockquote className="lightbox-quote-block">
                  <p>"{selectedImage.quote}"</p>
                </blockquote>

                <p className="lightbox-description">
                  Take a moment to absorb this scenery. Soften your shoulders, unclench your jaw,
                  and inhale slowly for 4 seconds, then release.
                </p>

                <div className="lightbox-actions-row">
                  <button
                    className="lightbox-action-primary"
                    onClick={() => {
                      setSelectedImage(null);
                      navigate("/breathing");
                    }}
                  >
                    <Wind size={16} />
                    <span>Practice Breathing With This Visual</span>
                  </button>

                  <button
                    className={`lightbox-action-secondary ${likedMap[selectedImage.id] ? "active" : ""}`}
                    onClick={(e) => toggleLike(e, selectedImage.id)}
                  >
                    <Heart size={16} fill={likedMap[selectedImage.id] ? "currentColor" : "none"} />
                    <span>{likedMap[selectedImage.id] ? "Liked" : "Like This Space"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WellnessGallery;
