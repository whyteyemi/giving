
import React from 'react';
import { Program, ImpactStat, TeamMember } from './types';

export const PROGRAMS: Program[] = [
  {
    id: 'feeding',
    title: 'Feeding Program',
    tagline: 'No child deserves to go hungry',
    description: 'To defend the defenseless through nutritional support for children and individuals with no access to food. We provide daily/weekly feeding programs and food distribution networks.',
    image: '/feeding_impact.jpeg',
    metrics: '50,000+ Meals Served Annually'
  },
  {
    id: 'recovery',
    title: 'Addiction Recovery',
    tagline: 'Raise leaders of tomorrow',
    description: 'Rehabilitating and helping street-dwelling drug and alcohol addicts fulfill their purpose through love and care, street outreach, and counseling services.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
    metrics: '500+ Recovered Individuals'
  },
  {
    id: 'widows',
    title: 'Widow Support',
    tagline: 'They must celebrate Christmas',
    description: 'Restoring life and hope to widows lacking family support through financial assistance, skills training, and holiday support packages to ensure holiday dignity.',
    image: '/widow_impact.jpeg',
    metrics: '1,200+ Widows Empowered'
  },
  {
    id: 'education',
    title: 'Educational Support',
    tagline: 'Identify and develop skills',
    description: 'Providing opportunities and empowerment support for underprivileged youth through tuition assistance, school supplies, scholarships, and vocational training.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    metrics: '2,500+ Students Supported'
  },
  {
    id: 'kids-club',
    title: 'Kids Club',
    tagline: 'Catch them young',
    description: 'Early intervention and character development for children from disadvantaged backgrounds through mentorship, life skills training, and recreational activities.',
    image: '/kids_club_impact.jpeg',
    metrics: '8 Active Community Hubs'
  }
];

export const IMPACT_STATS: ImpactStat[] = [
  { label: 'People Fed', value: 125000 },
  { label: 'Children Educated', value: 5000 },
  { label: 'Widows Supported', value: 3500 },
  { label: 'Lives Transformed', value: 150000, suffix: '+' }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Oladoyin Ogunleye',
    role: 'Founder & Initiator',
    bio: 'A health professional based in Chicago, USA, with a deep passion for humanitarian work in Nigeria.',
    image: '/team/founder.jpeg',
    location: 'Chicago, USA'
  },
  {
    name: 'Oluyemi Ayagboye',
    role: 'Secretary',
    bio: 'Dedicated to ensuring the smooth operation and administrative integrity of Giving Without Limit.',
    image: '/team/secretary.jpeg',
    location: 'Nigeria'
  },
  {
    name: 'Tunde Alli',
    role: 'Board of Trustees',
    bio: 'Providing strategic direction and oversight to ensure our mission serves the vulnerable effectively.',
    image: '/team/trustee_tunde.jpeg',
    location: 'Chicago, Illinois, USA'
  },
  {
    name: 'Kemi Adamson',
    role: 'Board of Trustees',
    bio: 'A dedicated registered nurse based in Chicago, Illinois, bringing her expertise in healthcare and compassionate service to the board of Giving Without Limit.',
    image: '/team/trustee_kemi.jpeg',
    location: 'Chicago, Illinois, USA'
  },
  {
    name: 'Mary Ogunoiki',
    role: 'Board of Trustees',
    bio: 'A seasoned nursing professional from Chicago, Illinois, whose commitment to health and humanity strengthens our mission to serve the vulnerable and the forgotten.',
    image: '/team/trustee_mary.jpeg',
    location: 'Chicago, Illinois, USA'
  },
  {
    name: 'Adeboye Ogunleye',
    role: 'Board of Trustees',
    bio: 'A professional accountant based in Chicago, Illinois, bringing financial expertise and strategic oversight to ensure transparency and accountability in our humanitarian mission.',
    image: '/team/trustee_adeboye.jpeg',
    location: 'Chicago, Illinois, USA'
  },
  {
    name: 'Olufunmilayo Ayebae',
    role: 'Board of Trustees',
    bio: 'A Non-Executive Director with Nigeria’s leading pharmaceutical company, Fidson Healthcare Plc, bringing extensive corporate governance and healthcare industry experience to the board.',
    image: '/team/trustee_olufunmilayo.jpeg',
    location: 'Nigeria'
  }
];
