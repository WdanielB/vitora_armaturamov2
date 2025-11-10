import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-[#1E212B]/60 backdrop-blur-lg sticky top-0 z-10 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex items-center gap-4">
                    <img 
                        src="https://cdn.shopify.com/s/files/1/0649/4083/4883/files/log_blanco.png?v=1762755701" 
                        alt="Vitora Logo" 
                        className="h-10 sm:h-12"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
                            Crea tu Ramo
                        </h1>
                        <p className="text-base sm:text-lg text-[#DCBBA0] font-semibold tracking-wide">
                            by Vitora
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;