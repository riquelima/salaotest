
import React, { useState, useCallback, Children, ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { useTheme } from '../../contexts/ThemeContext';

interface CarouselProps {
  items: ReactNode[];
  className?: string;
  slideWrapperClassName?: string;
  slideHeightClass?: string; // e.g., 'h-80' or 'h-96'
}

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  className = '', 
  slideWrapperClassName = '',
  slideHeightClass = 'h-auto' // Default to auto height
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme, colors: themeColors } = useTheme();

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  }, [items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) {
    return null; 
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`overflow-hidden relative ${slideWrapperClassName} ${slideHeightClass}`}>
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Children.map(items, (child, index) => (
            <div key={index} className={`flex-shrink-0 w-full h-full ${slideHeightClass}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`absolute bottom-8 sm:bottom-10 left-2 md:left-[-48px] p-2 rounded-full 
                        bg-black/30 hover:bg-black/50 text-white
                        dark:bg-white/20 dark:hover:bg-white/40 dark:text-gray-200
                        transition-all duration-200 z-10 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-offset-transparent 
                        focus:ring-${theme === 'dark' ? themeColors.focusRing : themeColors.primary}`}
            aria-label="Slide anterior"
          >
            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            className={`absolute bottom-8 sm:bottom-10 right-2 md:right-[-48px] p-2 rounded-full 
                        bg-black/30 hover:bg-black/50 text-white
                        dark:bg-white/20 dark:hover:bg-white/40 dark:text-gray-200
                        transition-all duration-200 z-10 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-offset-transparent 
                        focus:ring-${theme === 'dark' ? themeColors.focusRing : themeColors.primary}`}
            aria-label="Próximo slide"
          >
            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300
                            ${currentIndex === index ? 
                              `bg-${theme === 'dark' ? 'white' : themeColors.primary} scale-125` : 
                              `bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50`} `}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;