import AboutSection from '@/components/home/AboutSection/AboutSection';
import HeroSection from '@/components/home/HeroSlider/HeroSlider';
import ServiceOverview from '@/components/home/ServicesOverview/ServicesOverview';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <HeroSection></HeroSection>
      <div className="container py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
        {/* <p className="text-gray-600 mt-4">More sections coming next...</p> */}
      </div>
      <AboutSection></AboutSection>
      <ServiceOverview></ServiceOverview>
    </div>
  );
}
