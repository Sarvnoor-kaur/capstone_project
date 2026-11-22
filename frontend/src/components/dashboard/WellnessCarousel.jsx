import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./WellnessCarousel.css";

const WellnessCarousel = () => {
  const wellnessCategories = [
    {
      id: 1,
      title: "Meditation",
      description: "Find peace and clarity",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      color: "#DCD6F7",
      icon: "🧘‍♀️",
    },
    {
      id: 2,
      title: "Sleep Wellness",
      description: "Rest better, feel better",
      image: "https://images.unsplash.com/photo-1541480551145-2370a440d585?w=800&q=80",
      color: "#B8E6D5",
      icon: "😴",
    },
    {
      id: 3,
      title: "Stress Relief",
      description: "Manage daily pressures",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      color: "#FFE5D9",
      icon: "🌊",
    },
    {
      id: 4,
      title: "Mindful Journaling",
      description: "Express your thoughts",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
      color: "#F4CDBB",
      icon: "📝",
    },
    {
      id: 5,
      title: "Nature Therapy",
      description: "Connect with outdoors",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      color: "#B8E6D5",
      icon: "🌿",
    },
    {
      id: 6,
      title: "Breathing Exercises",
      description: "Calm your mind instantly",
      image: "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800&q=80",
      color: "#DCD6F7",
      icon: "💨",
    },
    {
      id: 7,
      title: "Positive Affirmations",
      description: "Build self-confidence",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
      color: "#A99BEA",
      icon: "✨",
    },
    {
      id: 8,
      title: "Mindful Movement",
      description: "Yoga and stretching",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
      color: "#FFE5D9",
      icon: "🤸‍♀️",
    },
  ];

  return (
    <section className="wellness-carousel-section">
      <motion.div
        className="carousel-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="carousel-title">Explore Wellness Activities</h2>
          <p className="carousel-subtitle">
            Discover personalized activities to support your mental well-being
          </p>
        </div>
        <button className="view-all-btn">
          <span>View All</span>
          <ChevronRight size={20} />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1440: {
              slidesPerView: 4,
            },
          }}
          className="wellness-swiper"
        >
          {wellnessCategories.map((category) => (
            <SwiperSlide key={category.id}>
              <div className="wellness-card">
                <div className="card-image-wrapper">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="card-image"
                    loading="lazy"
                  />
                  <div
                    className="card-overlay"
                    style={{ background: `linear-gradient(180deg, transparent 0%, ${category.color} 100%)` }}
                  />
                  <div className="card-icon">{category.icon}</div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{category.title}</h3>
                  <p className="card-description">{category.description}</p>
                  <button className="card-action">
                    <span>Start Now</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default WellnessCarousel;
