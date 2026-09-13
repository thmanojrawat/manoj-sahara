import purtiLogo from "../assets/brands/purti-logo.svg";
import orbitGroupLogo from "../assets/brands/orbit-group-logo.svg";
import psGroupLogo from "../assets/brands/PS-Group.svg";
import merlinLogo from "../assets/brands/merlin-logo.svg";
import emamiRealtyLogo from "../assets/brands/emami-realty-logo.svg";
import primarcLogo from "../assets/brands/primarc-logo.svg";
import unimarkLogo from "../assets/brands/unimark-logo.svg";
import rajatGroupLogo from "../assets/brands/rajat-group-logo.svg";
import surekaLogo from "../assets/brands/sureka-logo.svg";
import siddhaLogo from "../assets/brands/siddha-logo.svg";

const Testimonial = () => {
  const topBrands = [
    { name: "Purti", logo: purtiLogo },
    { name: "Orbit Group", logo: orbitGroupLogo },
    { name: "PS Group", logo: psGroupLogo },
    { name: "Merlin", logo: merlinLogo },
    { name: "Emami Realty", logo: emamiRealtyLogo },
  ];
  const bottomBrands = [
    { name: "Primarc", logo: primarcLogo },
    { name: "Unimark", logo: unimarkLogo },
    { name: "Rajat Group", logo: rajatGroupLogo },
    { name: "Sureka", logo: surekaLogo },
    { name: "Siddha", logo: siddhaLogo },
  ];

  const BrandCard = ({ brand }) => (
    <div className="mx-4 flex h-32 w-72 shrink-0 items-center justify-center rounded-lg bg-white p-6 shadow transition-shadow duration-200 hover:shadow-lg">
      <img
        src={brand.logo}
        alt={`${brand.name} logo`}
        className="max-h-20 max-w-full object-contain"
      />
    </div>
  );

  return (
    <section className="max-padd-container py-16 xl:py-22">
      <h2 className="h2 text-center">Brands and Associates</h2>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="marquee-row relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#fffbee] to-transparent" />
        <div className="marquee-inner flex min-w-[200%] transform-gpu pt-10 pb-5">
          {[...topBrands, ...topBrands].map((brand, index) => (
            <BrandCard key={`${brand.name}-${index}`} brand={brand} />
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent md:w-40" />
      </div>

      <div className="marquee-row relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#fffbee] to-transparent" />
        <div className="marquee-inner marquee-reverse flex min-w-[200%] transform-gpu pt-10 pb-5">
          {[...bottomBrands, ...bottomBrands].map((brand, index) => (
            <BrandCard key={`${brand.name}-${index}`} brand={brand} />
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white via-transparent to-transparent md:w-40" />
      </div>
    </section>
  );
};

export default Testimonial;
