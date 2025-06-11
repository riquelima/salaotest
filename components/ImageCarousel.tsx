import React, { useRef, useState } from 'react';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // Approximate width of one item (w-80 -> 320px for larger screens)
      // For mobile, it might be closer to screen width if only one image is shown.
      // Let's use a dynamic scroll amount based on the first item's width or a fixed value.
      const firstItem = carouselRef.current.firstChild as HTMLElement;
      const scrollAmount = firstItem ? firstItem.offsetWidth + 16 : 320 + 16; // 16 for space-x-4
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
      <p className="text-purple-400 dark:text-purple-400 text-sm font-semibold uppercase mb-3 text-center sm:text-left">
        ✨ Galeria de Cortes ✨
      </p>
      <div 
        className="relative bg-[#2C2C3B] rounded-xl p-3 md:p-5 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCarouselClick} // Show buttons on click in the carousel area
        role="button" // Indicates the area is clickable
        tabIndex={0} // Makes it focusable
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCarouselClick();}} // Accessibility for keyboard
        aria-label="Galeria de cortes, clique para mostrar controles de navegação"
      >
        {buttonsVisible && images.length > 1 && ( 
          <>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('left'); }} // Stop propagation to prevent re-triggering handleCarouselClick
              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-80 hover:opacity-100 text-xl md:text-2xl leading-none flex items-center justify-center h-10 w-10 md:h-12 md:w-12"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('right'); }} // Stop propagation
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-80 hover:opacity-100 text-xl md:text-2xl leading-none flex items-center justify-center h-10 w-10 md:h-12 md:w-12"
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
          aria-label="Imagens dos cortes de cabelo" // More specific label for the image container
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
                className="rounded-lg border border-white/10 object-cover h-48 md:h-56 w-80 group-hover:shadow-xl transition-shadow"
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