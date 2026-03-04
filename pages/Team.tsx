
import React, { useEffect, useState } from 'react';
import { TEAM } from '../constants';
import { apiService } from '../services/apiService';
import { Profile } from '../services/supabaseClient';

const Team: React.FC = () => {
    const [team, setTeam] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchProfiles();
            // Filter non-users and exclude static TEAM
            const staticNames = TEAM.map(m => m.name);
            const filtered = (data || [])
                .filter((p: Profile) => p.role !== 'user' && !staticNames.includes(p.full_name));
            setTeam(filtered);
        } catch (error: any) {
            console.error('Error fetching team:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    return (
        <div className="pt-20">
            {/* Header */}
            <section className="bg-primary py-24 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Our People</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Meet the Team</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                        Connecting passionate leaders and volunteers from around the world to drive humanitarian impact.
                    </p>
                </div>
            </section>

            {/* Core Leadership Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Featured Founder Card */}
                    {TEAM.filter(m => m.role.includes('Founder')).map((founder, idx) => (
                        <div key={`founder-${idx}`} className="mb-20">
                            <div className="text-center mb-12">
                                <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">The Visionary</h3>
                                <h4 className="text-3xl md:text-4xl font-bold text-primary">Founder & Initiator</h4>
                            </div>
                            <div className="bg-primary rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row items-stretch">
                                <div className="lg:w-2/5 aspect-[4/5] lg:aspect-auto">
                                    <img
                                        src={founder.image}
                                        alt={founder.name}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="lg:w-3/5 p-12 md:p-16 flex flex-col justify-center bg-[radial-gradient(circle_at_top_right,rgba(255,184,0,0.1),transparent)]">
                                    <div className="flex items-center text-gold/80 font-semibold uppercase tracking-widest text-xs mb-6">
                                        <i className="fas fa-map-marker-alt mr-2"></i>
                                        {founder.location}
                                    </div>
                                    <h4 className="text-white font-bold text-4xl mb-6">{founder.name}</h4>
                                    <p className="text-gray-300 text-lg leading-relaxed italic border-l-4 border-gold pl-8 mb-8">
                                        {founder.bio}
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold">
                                            <i className="fab fa-linkedin-in"></i>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="text-center mb-16 pt-10 border-t border-gray-100">
                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Strategic Oversight</h3>
                        <h4 className="text-3xl md:text-4xl font-bold text-primary">Board of Trustees</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-fr">
                        {TEAM.filter(m => !m.role.includes('Founder')).map((member, idx) => (
                            <div key={idx} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:-translate-y-2 transition-all duration-500 h-full group">
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-gold font-bold text-[10px] uppercase tracking-widest mb-1">{member.role}</p>
                                        <h4 className="text-white font-bold text-xl">{member.name}</h4>
                                    </div>
                                </div>
                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="flex items-center text-primary/70 font-bold uppercase tracking-tighter text-[10px] mb-6">
                                        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center mr-3">
                                            <i className="fas fa-map-marker-alt text-[8px] text-gold"></i>
                                        </div>
                                        {member.location || 'Global Operations'}
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        {member.bio}
                                    </p>
                                    <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-gold">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
                                        <div className="flex gap-4">
                                            <i className="fab fa-linkedin text-xs cursor-pointer hover:text-primary transition-colors"></i>
                                            <i className="fas fa-envelope text-xs cursor-pointer hover:text-primary transition-colors"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Volunteers & Staff Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Global Network</h3>
                        <h4 className="text-3xl md:text-4xl font-bold text-primary">Volunteers & Dedicated Staff</h4>
                        <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-center">
                                <p className="text-primary font-bold text-xl">1</p>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Director General</p>
                            </div>
                            <div className="text-center">
                                <p className="text-primary font-bold text-xl">5</p>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Directors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-primary font-bold text-xl">4</p>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Coordinators</p>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-8 max-w-2xl mx-auto">
                            Over 50 leading professionals in business, government, and academia providing research and operational support.
                        </p>
                    </div>
                    {loading ? (
                        <div className="py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                            {team.length > 0 ? (
                                team.map((member) => (
                                    <div key={member.id} className="group text-center">
                                        <div className="aspect-square rounded-full overflow-hidden mb-6 border-4 border-white group-hover:border-gold transition-colors shadow-lg bg-gray-100">
                                            {member.avatar_url ? (
                                                <img
                                                    src={member.avatar_url}
                                                    alt={member.full_name}
                                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary text-3xl font-bold">
                                                    {member.full_name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <h6 className="font-bold text-primary text-sm">{member.full_name}</h6>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.position || member.role}</p>
                                        {member.location && <p className="text-[9px] text-gray-400 mt-1">{member.location}</p>}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
                                    <i className="fas fa-users text-4xl text-gray-200 mb-4 block"></i>
                                    <p className="text-gray-400">Join our growing team of global changemakers!</p>
                                    <button className="mt-4 text-primary font-bold text-sm underline hover:text-gold">Apply as Volunteer</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-primary py-24 text-white overflow-hidden relative">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Make an Impact?</h2>
                    <p className="text-xl text-gray-300 mb-12">
                        We are always looking for passionate individuals to join our mission as volunteers, directors, or coordinators.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="bg-gold text-primary font-bold px-10 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-xl">
                            VOLUNTEER WITH US
                        </button>
                        <button className="bg-transparent border-2 border-gold text-gold font-bold px-10 py-4 rounded-full hover:bg-gold hover:text-primary hover:scale-105 transition-all">
                            VIEW OPPORTUNITIES
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Team;
