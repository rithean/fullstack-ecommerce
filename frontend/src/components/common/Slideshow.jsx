import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import { gsap } from "gsap";

const Slideshow = () => {
  const [slides, setSlides] = useState([]);
  const baseUrl = "http://localhost:8000";

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/slideshows`);
        if (res.data.status) {
          setSlides(res.data.data.filter((slide) => slide.status === 1));
        }
      } catch (error) {
        console.error("Failed to fetch slideshow data", error);
      }
    };

    fetchSlides();
  }, []);

  const handleSlideEnter = (el) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" }
    );
  };

  const handleCaptionEnter = (el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power4.out" }
    );
  };

  return (
    <Carousel
      fade
      interval={5000}
      pause="hover"
      wrap={true} 
      className="custom-carousel"
      onSelect={(selectedIndex) => {
        const slides = document.querySelectorAll(".carousel-item");
        slides.forEach((slide, index) => {
          if (index === selectedIndex) {
            handleSlideEnter(slide);
          }
        });
      }}
    >
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <img
            className="d-block w-100 slide-image"
            src={`${baseUrl}${slide.image}`}
            alt={slide.title}
            onLoad={(e) => handleSlideEnter(e.target)} 
          />
          <Carousel.Caption className="custom-caption" onLoad={(e) => handleCaptionEnter(e.target)}>
            <h2 className="slide-title">{slide.title}</h2>
            <h5 className="slide-subtitle">{slide.subtitle}</h5>
            <p className="slide-description">{slide.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Slideshow;
