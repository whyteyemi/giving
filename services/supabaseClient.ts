import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
    try {
        return url.startsWith('http');
    } catch (e) {
        return false;
    }
};

const supabaseUrl = isValidUrl(envUrl) ? envUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = envKey || 'placeholder-key';

if (!isValidUrl(envUrl)) {
    console.warn('⚠️ Supabase credentials are missing or invalid! Authentication will not work.');
    console.warn('Please update .env.local with your actual Supabase URL and Key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type UserRole = 'admin' | 'staff' | 'volunteer' | 'user';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    location?: string;
    phone?: string;
    department?: string;
    position?: string;
    bio?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    status: 'upcoming' | 'past' | 'cancelled';
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface EventMedia {
    id: string;
    event_id: string;
    media_url: string;
    media_type: 'image' | 'video' | 'audio';
    title?: string;
    created_at: string;
}

export interface HelpMeCampaign {
    id: string;
    title: string;
    description: string;
    target_amount: number;
    current_amount: number;
    closing_date?: string;
    status: 'active' | 'completed' | 'closed';
    beneficiary_name?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface VolunteerApplication {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    interest_area?: string;
    bio?: string;
    status: 'pending' | 'approved' | 'disapproved';
    created_at: string;
    updated_at: string;
}

export interface Donation {
    id: string;
    donor_name: string;
    email: string;
    amount: number;
    campaign_id?: string;
    status: 'pending' | 'success' | 'failed';
    payment_id?: string;
    message?: string;
    created_at: string;
}

export interface ImpactRecord {
    id: string;
    type: 'image' | 'video' | 'story';
    title: string;
    content?: string;
    media_url?: string;
    thumbnail_url?: string;
    category: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}
