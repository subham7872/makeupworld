import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PackageItem } from '../types';
import { trackEvent } from '../utils/analytics';

interface PackagesSectionProps {
  onSelectPackage: (pkg: PackageItem) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  const [packages, setPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch(() => {});
  }, []);

  const handlePackageClick = (pkg: PackageItem) => {
    trackEvent('service_view', { package_id: pkg.id, package_name: pkg.name });
    onSelectPackage(pkg);
  };

  return (
    <section id="packages" className="py-16 md:py-24 bg-[#F5EFEB] border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Curated Bridal Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1A18] font-normal">
            Signature Bridal Packages
          </h2>
          <p className="text-sm text-[#5A554E] leading-relaxed">
            Transparent pricing without surprise add-on fees. Every collection is tailored to your unique ceremony timeline.
          </p>
        </div>

        {/* Packages Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isSignature = pkg.is_signature;

            return (
              <div
                key={pkg.id}
                className={`bg-white border flex flex-col justify-between p-6 sm:p-8 transition-all relative ${
                  isSignature
                    ? 'border-[#B89668] shadow-xl ring-2 ring-[#B89668]/40 scale-[1.02] z-10'
                    : 'border-[#DFD3C4] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B89668] text-white text-[10px] uppercase tracking-widest font-semibold px-4 py-1 shadow-md whitespace-nowrap flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FAF8F5]" />
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Tier & Name */}
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8C6D45] block">
                      {pkg.tier}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1A18] font-medium">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#736B62] leading-relaxed pt-1">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="py-4 border-y border-[#E8DFD5]">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1A18] tabular-nums">
                        ${pkg.price}
                      </span>
                      <span className="text-xs uppercase text-[#736B62] font-medium">
                        USD / All In
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8C6D45] block mt-1">
                      {pkg.ideal_for}
                    </span>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#3D3833] block">
                      Inclusions:
                    </span>
                    <ul className="space-y-2.5">
                      {pkg.deliverables.map((item, idx) => (
                        <li key={idx} className="text-xs text-[#4A453F] flex items-start gap-2.5 leading-snug">
                          <Check className="w-4 h-4 text-[#8C6D45] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-8 mt-6">
                  <button
                    type="button"
                    onClick={() => handlePackageClick(pkg)}
                    className={`w-full py-3.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSignature
                        ? 'bg-[#1C1A18] hover:bg-[#332F2A] text-white shadow-md'
                        : 'bg-[#FAF8F5] hover:bg-[#1C1A18] hover:text-white text-[#1C1A18] border border-[#D8CEBF]'
                    }`}
                  >
                    <span>Check Availability For This Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-center text-[#736B62] mt-2">
                    Secured with official atelier contract
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
