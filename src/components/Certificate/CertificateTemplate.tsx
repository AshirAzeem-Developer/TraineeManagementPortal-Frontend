import React, { forwardRef } from 'react';

interface CertificateTemplateProps {
  recipientName: string;
  courseName?: string;
  date: string;
  instructorName?: string;
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ recipientName, courseName = "Trainee Management Course", date, instructorName = "Ashir Azeem" }, ref) => {
    return (
      <div className="w-full overflow-x-auto p-4 md:p-8 flex justify-center bg-[#f3f4f6] dark:bg-[#111827]">
        {/* Certificate Container - Fixed Aspect Ratio (roughly A4 landscape) */}
        <div 
          ref={ref}
          className="relative w-[1123px] h-[794px] bg-[#1a1b2e] text-white overflow-hidden flex-shrink-0 certificate-container"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          }}
        >
          {/* Top Right Triangle Graphic */}
          <div className="absolute top-10 right-16 w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 15px rgba(45,212,191,0.5))' }}>
               <defs>
                 <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" style={{stopColor:'rgb(45,212,191)', stopOpacity:1}} />
                   <stop offset="100%" style={{stopColor:'rgb(250,204,21)', stopOpacity:1}} />
                 </linearGradient>
               </defs>
               {/* Simplified triangle logo representation */}
               <path d="M50 15 L85 85 L15 85 Z" fill="none" stroke="url(#grad1)" strokeWidth="8" />
               <path d="M50 25 L75 75 L25 75 Z" fill="none" stroke="cyan" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>

          {/* Header */}
          <div className="absolute top-16 left-16">
            <h2 className="text-3xl font-bold tracking-widest text-[#E5E7EB] uppercase">
              CERTIFICATE
            </h2>
            <h1 className="text-4xl font-extrabold tracking-widest text-white uppercase mt-1">
              OF COMPLETION
            </h1>
          </div>

          {/* Main Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
            {/* Name */}
            <h1 className="text-7xl font-light tracking-wide text-white mb-8 font-serif">
              {recipientName}
            </h1>

            {/* Separator Line */}
            <div className="w-3/4 h-px bg-[#6B7280] mb-8"></div>

            {/* Description Text */}
            <p className="text-[#D1D5DB] text-lg max-w-2xl text-center leading-relaxed">
              This is to certify that the above mentioned person has successfully completed the
              <span className="text-[#FACC15] font-semibold mx-1">{courseName}</span>
              program. They have demonstrated dedication, hard work, and proficiency in the required skills.
            </p>

            {/* Badge */}
            <div className="mt-12 relative">
               <div className="w-24 h-24 rounded-full border-2 border-[#EAB308] flex items-center justify-center relative z-10 bg-[#1a1b2e]">
                  <div className="text-center">
                    <div className="text-[#EAB308] text-[10px] tracking-widest uppercase">Best</div>
                    <div className="text-[#FACC15] font-bold text-sm tracking-wider uppercase">Award</div>
                    <div className="text-[#EAB308] text-[10px] mt-0.5">★★★★★</div>
                  </div>
               </div>
               {/* Laurel Wreath SVG Placeholder/Simulation - Static for PDF */}
               <div className="absolute -inset-4 border border-dashed border-[rgba(202,138,4,0.3)] rounded-full"></div>
            </div>

            {/* Signatures */}
            <div className="absolute bottom-20 w-3/4 flex justify-between px-10">
              <div className="text-center">
                <div className="w-64 h-px bg-[rgba(255,255,255,0.5)] mb-4"></div>
                <p className="text-lg text-[#D1D5DB] uppercase tracking-widest">{date}</p>
                <p className="text-sm text-[#9CA3AF]">Date</p>
              </div>

              <div className="text-center">
                <div className="w-64 h-px bg-[rgba(255,255,255,0.5)] mb-4"></div>
                {/* Simulated Signature */}
                <p className="text-2xl text-[#EAB308] font-cursive -mt-10 mb-2 transform -rotate-6" style={{fontFamily: 'cursive'}}>
                    {instructorName}
                </p>
                <p className="text-lg text-[#D1D5DB] uppercase tracking-widest">Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = "CertificateTemplate";

export default CertificateTemplate;
