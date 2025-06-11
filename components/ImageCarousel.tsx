
import React, { useRef, useState } from 'react';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const firstItem = carouselRef.current.firstChild as HTMLElement;
      const scrollAmount = firstItem ? firstItem.offsetWidth + 16 : 320 + 16; 
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCarouselClick = () => {
    if (!buttonsVisible) {
      setButtonsVisible(true);
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <p className="text-[#8B5CF6] dark:text-[#A78BFA] text-sm font-semibold uppercase mb-3 text-center sm:text-left">
        ✨ Galeria de Cortes ✨
      </p>
      <div 
        className="relative bg-[#F9FAFB] dark:bg-[#2C2C3B] rounded-xl p-3 md:p-5 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCarouselClick}
        role="button" 
        tabIndex={0} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCarouselClick();}}
        aria-label="Galeria de cortes, clique para mostrar controles de navegação"
      >
        {buttonsVisible && images.length > 1 && ( 
          <>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('left'); }} 
              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 dark:bg-black/70 text-white p-2 rounded-full hover:bg-black/70 dark:hover:bg-black/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] opacity-80 hover:opacity-100 text-xl md:text-2xl leading-none flex items-center justify-center h-10 w-10 md:h-12 md:w-12"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('right'); }} 
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 dark:bg-black/70 text-white p-2 rounded-full hover:bg-black/70 dark:hover:bg-black/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] opacity-80 hover:opacity-100 text-xl md:text-2xl leading-none flex items-center justify-center h-10 w-10 md:h-12 md:w-12"
              aria-label="Scroll right"
            >
              ›
            </button>
          </>
        )}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4 py-2" 
          role="region"
          aria-label="Imagens dos cortes de cabelo"
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className="shrink-0 transform hover:scale-105 transition-transform duration-300 group" 
              role="group" 
              aria-label={`Imagem ${index + 1} de ${images.length}: ${image.alt}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="rounded-lg border border-[#E5E7EB] dark:border-[#374151] object-cover h-48 md:h-56 w-80 group-hover:shadow-xl transition-shadow"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;