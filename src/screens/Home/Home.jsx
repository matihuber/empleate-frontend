import React, { useState, useEffect, useRef } from 'react';
import HomeHeader from '../../components/layout/HomeHeader';

const Home = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const sectionsRef = useRef([]);
    const isScrolling = useRef(false);

    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrolling.current) return;

            e.preventDefault();
      
            const direction = e.deltaY > 0 ? 1 : -1;
            const nextSection = currentSection + direction;

            if (nextSection >= 0 && nextSection < 4) {
                isScrolling.current = true;
                setCurrentSection(nextSection);
        
                sectionsRef.current[nextSection]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling.current = false;
                }, 100);
            }
        };

        // Add wheel event listener
        window.addEventListener('wheel', handleWheel, { passive: false });

        // Handle keyboard navigation
        const handleKeyDown = (e) => {
            if (isScrolling.current) return;

            let nextSection = currentSection;

            if (e.key === 'ArrowDown' && currentSection < 3) {
                e.preventDefault(); // ⬅️ Esto evita el scroll nativo
                nextSection = currentSection + 1;
            } else if (e.key === 'ArrowUp' && currentSection > 0) {
                e.preventDefault(); // ⬅️ Esto también
                nextSection = currentSection - 1;
            } else {
                return;
            }

            isScrolling.current = true;
            setCurrentSection(nextSection);
            sectionsRef.current[nextSection]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => {
                isScrolling.current = false;
            }, 100);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentSection]);

  return (
    <div className="min-h-screen overflow-hidden">
      <HomeHeader />

      {/* Sección 1: Slogan con mision */}
      <section 
        ref={(el) => sectionsRef.current[0] = el}
        className="h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/src/assets/images/background-home.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      > 
        <div className="relative z-10 text-center text-gray-800 px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Impulsá tu carrera<br />
            con inteligencia artificial
          </h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
            Nuestra misión
          </button>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Sección 2: Funcionalidad - Generador de CV */}
      <section 
        ref={(el) => sectionsRef.current[1] = el}
        className="h-screen flex items-center bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sección 2: Generador de CV
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Creá un CV optimizado en segundos
            </p>
          </div>
        </div>
      </section>

      {/* Sección 3: Funcionalidad - Calculadora de Salario */}
      <section 
        ref={(el) => sectionsRef.current[2] = el}
        className="h-screen flex items-center bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sección 3: Calculadora de Salario
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ¿Cuánto podrías ganar?
            </p>
          </div>
        </div>
      </section>

      {/* Sección 4: Funcionalidad - Cursos Recomendados */}
      <section 
        ref={(el) => sectionsRef.current[3] = el}
        className="h-screen flex items-center bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sección 4: Cursos Recomendados
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Aprendé con los cursos recomendados
            </p>
          </div>
        </div>
      </section>

      {/* Indicador de secciones */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling.current) {
                isScrolling.current = true;
                setCurrentSection(index);
                sectionsRef.current[index]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                setTimeout(() => {
                  isScrolling.current = false;
                }, 100);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-blue-600 scale-125' 
                : 'bg-blue-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;