
export interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  metrics: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  location?: string;
}

export interface ImpactStat {
  label: string;
  value: number;
  suffix?: string;
}

export enum Page {
  Home = 'home',
  About = 'about',
  Programs = 'programs',
  Team = 'team',
  Impact = 'impact',
  GetInvolved = 'get-involved',
  Donate = 'donate',
  Contact = 'contact',
  Admin = 'admin',
  Auth = 'auth',
  Profile = 'profile'
}
