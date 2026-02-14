'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShieldCheck, Users, Target, Award, Smile } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Compassion First',
    description:
      'We treat every family member as if they were our own, with dignity and kindness.',
  },
  {
    icon: ShieldCheck,
    title: 'Uncompromising Safety',
    description:
      ' rigorous background checks and continuous monitoring ensure peace of mind.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'We are building a network of trust between families and caregivers.',
  },
  {
    icon: Target,
    title: 'Reliability',
    description:
      'When you book with us, we show up. No excuses, just consistent care.',
  },
];

const team = [
  {
    name: 'Dr. Sarah Ahmed',
    role: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    bio: 'Former pediatrician with 15 years of experience in family health.',
  },
  {
    name: 'James Wilson',
    role: 'Head of Safety',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop',
    bio: 'Ensuring every caregiver meets our strict security standards.',
  },
  {
    name: 'Emily Chen',
    role: 'Care Coordinator',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
    bio: 'Dedicated to matching families with their perfect care match.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative py-24 bg-secondary/30 overflow-hidden">
        <div className="container px-4 md:px-8 mx-auto text-center relative z-10">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4 px-4 py-1">
            Our Story
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            We Are Reimagining <br className="hidden md:block" />
            <span className="text-primary">Family Care</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Care.xyz was born from a simple belief: finding trusted care for
            your loved ones should not be a struggle. It should be safe, simple,
            and full of heart.
          </motion.p>
        </div>
      </section>

      <section className="py-20 container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-100 rounded-2xl transform rotate-3" />
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
                alt="Friends/Family laughing"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              More Than Just a Platform
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                In 2023, we noticed a gap. Families were struggling to find
                reliable help for their aging parents and young children, often
                relying on unverified sources or word-of-mouth.
              </p>
              <p>
                We built Care.xyz to bridge that gap. We utilize technology to
                verify identities, track visits, and ensure seamless
                communication, but our core remains human.
              </p>
              <p className="font-medium text-gray-900">
                Today, we have facilitated over 50,000 hours of care, helping
                thousands of families balance work, life, and love.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-3xl font-bold text-blue-600 mb-1">5k+</h3>
                <p className="text-sm text-gray-600">Active Families</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <h3 className="text-3xl font-bold text-green-600 mb-1">98%</h3>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="text-gray-600 mt-2">
              The principles that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <Card
                key={i}
                className="border-none shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <val.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">{val.title}</h3>
                  <p className="text-sm text-gray-600">{val.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container px-4 md:px-8 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
          <p className="text-gray-600 mt-2">
            The people working behind the scenes for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group text-center space-y-4">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
