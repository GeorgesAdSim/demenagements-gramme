import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Truck, Package2, Star } from 'lucide-react';
import type { HomepageContent } from '../lib/types';

const DEFAULT_STATS = [
  { icon: Award,    value: 75,  suffix: '+',   label: "Ans d'expérience" },
  { icon: Truck,    value: 40,  suffix: '+',   label: 'Déménagements / mois' },
  { icon: Package2, value: 100, suffix: ' m³', label: 'Capacité par trajet' },
  { icon: Star,     value: 5,   suffix: '/5',  label: 'Note moyenne clients' },
];

function useCountUp(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);
  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const steps = 24;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else { setCount(Math.floor(current)); }
    }, 800 / steps);
    return () => clearInterval(interval);
  }, [inView, target]);
  return count;
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  last,
}: {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  last: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="relative flex flex-col items-center py-10 px-6">
      <div className="w-14 h-14 rounded-full bg-yellow/15 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-yellow" />
      </div>
      <span className="font-black text-5xl md:text-6xl leading-none text-yellow tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-white/60 text-xs uppercase tracking-[0.15em] mt-2 text-center">
        {label}
      </span>
      {!last && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-yellow/20" />
      )}
    </div>
  );
}

interface Props {
  data?: HomepageContent['stats'] | null;
}

export default function StatsStrip({ data }: Props) {
  // data prop kept for CMS compatibility — defaulting to internal stats
  void data;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="bg-[#0C2094] py-4 md:py-0"
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
        {DEFAULT_STATS.map((stat, i) => (
          <StatCard
            key={stat.label}
            {...stat}
            last={i === DEFAULT_STATS.length - 1}
          />
        ))}
      </div>
    </motion.section>
  );
}
