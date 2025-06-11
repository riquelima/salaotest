import React, { useRef } from 'react';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // Approximate width of one item (w-80 -> 320px) plus spacing (space-x-4 -> 16px)
      const scrollAmount = 320 + 16; 
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
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
      <div className="relative bg-[#2C2C3B] rounded-xl p-3 md:p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
        {images.length > 1 && ( // Only show buttons if there's more than one image
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-70 hover:opacity-100 text-xl md:text-2xl leading-none flex items-center justify-center h-10 w-10 md:h-12 md:w-12"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-70 hover:opacity-100 text-xl md:text-2xl leading-none flex items-center justify-center h-10 w-10 md:h-12 md:w-12"
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
          aria-label="Galeria de imagens de cortes"
        >
          {images.map((image, index) => (
            <div key={index} className="shrink-0 transform hover:scale-105 transition-transform duration-300 group" role="group" aria-label={`Imagem ${index + 1} de ${images.length}`}>
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
