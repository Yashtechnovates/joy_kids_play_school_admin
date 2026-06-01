import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryCarousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, images.length]);

  const nextSlide = () => {
    setIsAutoScrolling(false);
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoScrolling(false);
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {images.map((image, idx) => (
            <div key={idx} className="w-full flex-shrink-0 relative">
              <img src={image.url} alt={image.title} className="w-full h-[400px] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">{image.title}</h3>
                <p className="text-white/80">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white">
        <ChevronRight size={24} />
      </button>
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setIsAutoScrolling(false); setCurrentSlide(idx); setTimeout(() => setIsAutoScrolling(true), 5000); }}
            className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryCarousel;