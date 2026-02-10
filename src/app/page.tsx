import HeroSection from '@/components/home/HeroSlider/HeroSlider';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <HeroSection></HeroSection>
    </div>
  );
}
