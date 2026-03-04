import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PROGRAMS } from '../constants';

const Programs: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-20">
            {/* Header */}
            <section className="bg-primary py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full -translate-y-1/2 -translate-x-1/2 opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">What We Do</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Core Programs</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                        Targeted humanitarian interventions designed to break the cycle of poverty and restore human dignity.
                    </p>
                </div>
            </section>

            {/* Programs List */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-32">
                        {PROGRAMS.map((program, idx) => (
                            <div key={program.id} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                                <div className="flex-1 w-full relative">
                                    <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl relative group">
                                        <img
                                            src={program.image}
                                            alt={program.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <div className="bg-gold text-primary font-bold px-4 py-1 rounded-full text-sm inline-block mb-2">
                                                {program.metrics}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Decorative element */}
                                    <div className={`absolute -z-10 -bottom-6 ${idx % 2 === 1 ? '-left-6' : '-right-6'} w-32 h-32 bg-gold/20 rounded-full blur-2xl`}></div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="inline-block px-4 py-1 border border-gold text-gold text-xs font-bold uppercase tracking-widest rounded-full">
                                        {program.tagline}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-primary">{program.title}</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        {program.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        <div className="flex items-center space-x-3 text-gray-700">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                                <i className="fas fa-heart text-sm"></i>
                                            </div>
                                            <span className="font-semibold">Human-Centered</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-700">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                                <i className="fas fa-check-circle text-sm"></i>
                                            </div>
                                            <span className="font-semibold">Impact Tracked</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-700">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                                <i className="fas fa-users text-sm"></i>
                                            </div>
                                            <span className="font-semibold">Community Based</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-700">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                                <i className="fas fa-star text-sm"></i>
                                            </div>
                                            <span className="font-semibold">Faith Rooted</span>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            onClick={() => navigate(`/donate?program=${encodeURIComponent(program.title)}`)}
                                            className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-secondary transition-all flex items-center group"
                                        >
                                            SUPPORT THIS PROGRAM
                                            <i className="fas fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">Want to see the beauty of our impact?</h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Explore our mission vault to see real stories, snapshots, and milestones from our fieldwork across Nigeria.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => navigate('/impact')}
                            className="bg-gold text-primary font-bold px-10 py-4 rounded-full hover:bg-yellow-400 transition-all shadow-lg"
                        >
                            VIEW IMPACT REPORT
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-white border-2 border-primary text-primary font-bold px-10 py-4 rounded-full hover:bg-primary/5 transition-all"
                        >
                            CONTACT US
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Programs;
