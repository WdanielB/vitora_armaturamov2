import React from 'react';

interface SectionWrapperProps {
    step: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ step, title, subtitle, children }) => {
    return (
        <section>
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#DCBBA0] text-gray-800 text-lg sm:text-xl font-bold rounded-full shadow-md">
                    {step}
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-100">{title}</h2>
                    <p className="text-sm sm:text-md text-gray-400">{subtitle}</p>
                </div>
            </div>
            <div>{children}</div>
        </section>
    );
};

export default SectionWrapper;