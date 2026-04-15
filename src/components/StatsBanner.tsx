import { Award, Truck, Package, MapPin } from 'lucide-react';

interface Stat {
  icon: typeof Award;
  value: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: Award,
    value: '60+',
    label: 'ans d\'expérience',
  },
  {
    icon: Truck,
    value: '26 000 kg',
    label: 'capacité maximale',
  },
  {
    icon: Package,
    value: '100 m³',
    label: 'volume maximum',
  },
  {
    icon: MapPin,
    value: 'Toute l\'Europe',
    label: 'zone de couverture',
  },
];

export function StatsBanner() {
  return (
    <section className="bg-gradient-to-r from-gramme-blue to-gramme-dark-blue py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 mb-4 group-hover:bg-gramme-yellow/20 transition-colors">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-gramme-yellow" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gramme-yellow mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
