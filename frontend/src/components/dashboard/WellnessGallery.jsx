import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Eye } from "lucide-react";
import "./WellnessGallery.css";

const WellnessGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState(new Set());

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
      title: "Morning Meditation",
      category: "Meditation",
      span: "tall",
      alt: "Person meditating peacefully at sunrise",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
      title: "Journaling Practice",
      category: "Journaling",
      span: "normal",
      alt: "Open journal with pen on a wooden desk",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      title: "Campus Life Balance",
      category: "Student Life",
      span: "wide",
      alt: "Students walking on a sunny campus pathway",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=80",
      title: "Forest Bathing",
      category: "Nature",
      span: "normal",
      alt: "Sunlight streaming through lush green forest",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1540206395-68808572332f?w=600&q=80",
      title: "Ocean Calm",
      category: "Relaxation",
      span: "tall",
      alt: "Calm ocean waves at golden hour",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
      title: "Healthy Living",
      category: "Self-Care",
      span: "normal",
      alt: "Fresh fruits and healthy breakfast setup",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=600&q=80",
      title: "Peaceful Sleep",
      category: "Sleep",
      span: "wide",
      alt: "Cozy bedroom with soft lighting",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1529693662653-9d480530a697?w=600&q=80",
      title: "Mindful Reading",
      category: "Mindfulness",
      span: "normal",
      alt: "Person reading a book in a comfortable setting",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=600&q=80",
      title: "Sunrise Walk",
      category: "Nature",
      span: "normal",
      alt: "Beautiful sunrise over a mountain landscape",
    },
  ];

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="wellness-gallery-section">
      <motion.div
        className="gallery-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="gallery-title">Wellness Inspiration</h2>
          <p className="gallery-subtitle">
            Visual inspiration for your mental wellness journey
          </p>
        </div>
      </motion.div>

      <motion.div
        className="masonry-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            className={`masonry-item ${image.span}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => setSelectedImage(image)}
          >
            <div className="masonry-image-wrapper">
              <img
                src={image.src}
                alt={image.alt}
                className="masonry-image"
                loading="lazy"
              />
              <div className="masonry-overlay">
                <div className="overlay-content">
                  <span className="image-category">{image.category}</span>
                  <h3 className="image-title">{image.title}</h3>
                </div>
                <div className="overlay-actions">
                  <button
                    className={`gallery-action-btn ${likedImages.has(image.id) ? "liked" : ""}`}
                    onClick={(e) => toggleLike(e, image.id)}
                    aria-label="Like"
                  >
                    <Heart
                      size={18}
                      fill={likedImages.has(image.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="gallery-action-btn" aria-label="View">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
              <img
                src={selectedImage.src.replace("w=600", "w=1200")}
                alt={selectedImage.alt}
                className="lightbox-image"
              />
              <div className="lightbox-info">
                <span className="lightbox-category">
                  {selectedImage.category}
                </span>
                <h3 className="lightbox-title">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WellnessGallery;
