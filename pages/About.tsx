
import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="bg-primary py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Our Mission</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Giving Without Limit</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Serving as "father to the fatherless, husband to the widows, family to the destitute, and friend to the despised and distorted."
                    </p>
                </div>
            </section>

            {/* Executive Summary */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Executive Summary</h3>
                            <h4 className="text-3xl font-bold text-primary mb-6">Who We Are</h4>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6">
                                Giving Without Limit (operating as Good Acts) is a Christian-motivated, non-governmental organization established to provide humanitarian aid to the less privileged.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Founded in 2016 by Deaconess Oladoyin Ogunleye, who coordinates operations from Chicago, USA, the organization addresses the growing global crisis of economic inequality by providing direct support to vulnerable populations in Nigeria with plans for international expansion.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-inner">
                            <h5 className="text-primary font-bold text-xl mb-6 flex items-center">
                                <i className="fas fa-quote-left text-gold mr-4"></i>
                                Our Strategic Context
                            </h5>
                            <p className="text-gray-600 italic leading-relaxed">
                                Operating under the conceptual framework of "Economic Democracy," the organization addresses the growing crisis where increasing global populations live in poverty (under $2 per day). As economic inequality expands, it erodes political and social equality, threatening democratic stability in impoverished societies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-all group">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-3xl mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <i className="fas fa-eye"></i>
                            </div>
                            <h4 className="text-2xl font-bold text-primary mb-4">Our Vision</h4>
                            <p className="text-gray-600 leading-relaxed">
                                "Spreading the Kindness" - Global humanitarian impact reaching vulnerable populations worldwide.
                            </p>
                            <p className="text-gold font-bold mt-4 uppercase tracking-widest text-xs italic">Tagline: Giving Without Limit</p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-all group">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-3xl mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <i className="fas fa-bullseye"></i>
                            </div>
                            <h4 className="text-2xl font-bold text-primary mb-4">Our Mission</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Driven by passion to do good and past life experience for humanitarian reach-out, addressing economic inequality through direct aid, rehabilitation, and empowerment programs.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-all group">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-3xl mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <i className="fas fa-infinity"></i>
                            </div>
                            <h4 className="text-2xl font-bold text-primary mb-4">Duration</h4>
                            <p className="text-gray-600 leading-relaxed">
                                "Till Jesus Come" - Perpetual operations commitment to serving the brokenhearted and the needy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Core Values & Motivations</h3>
                        <h4 className="text-3xl md:text-5xl font-bold">The Pillars of Our Service</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h5 className="text-gold font-bold text-lg mb-4 flex items-center">
                                <i className="fas fa-bible mr-3"></i> Biblical Foundation
                            </h5>
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "And do not forget to do good and to share with others, for with such sacrifices God is pleased" - Hebrews 13:16
                            </p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h5 className="text-gold font-bold text-lg mb-4 flex items-center">
                                <i className="fas fa-seedling mr-3"></i> Perseverance
                            </h5>
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "And let us not grow weary of doing good, for in due season we will reap, if we do not give up" - Galatians 6:9
                            </p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h5 className="text-gold font-bold text-lg mb-4 flex items-center">
                                <i className="fas fa-heart mr-3"></i> Passion
                            </h5>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Christian passion for humanitarian service and experiential motivation from founder's past life experiences.
                            </p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h5 className="text-gold font-bold text-lg mb-4 flex items-center">
                                <i className="fas fa-hand-holding-heart mr-3"></i> Kindness
                            </h5>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                A commitment to selfless giving and spreading love to the most vulnerable members of society.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Organizational Goals */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Our Goals</h3>
                        <h4 className="text-3xl md:text-4xl font-bold text-primary">Strategic Objectives</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { goal: "Father to the fatherless", objective: "To defend the defenseless (Care)" },
                            { goal: "Husband to the widows", objective: "To restore life and hope (Hopeless)" },
                            { goal: "Family to the destitutes", objective: "To rehabilitate and help fulfill purpose (Raise leaders of tomorrow)" },
                            { goal: "Friend to the despised and distorted", objective: "To give opportunities and empowerment support (Identify and develop skills)" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start p-8 bg-gray-50 rounded-2xl border-l-4 border-gold">
                                <div className="mr-6">
                                    <span className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </span>
                                </div>
                                <div>
                                    <h5 className="text-primary font-bold text-lg mb-1">{item.goal}</h5>
                                    <p className="text-gray-600">{item.objective}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder Section - The only picture allowed */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            <div className="relative aspect-[4/5] lg:aspect-auto">
                                <img
                                    src="/team/founder.jpeg"
                                    alt="Deaconess Oladoyin Ogunleye"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent lg:hidden"></div>
                                <div className="absolute bottom-10 left-10 lg:hidden">
                                    <h4 className="text-white text-3xl font-bold">Oladoyin Ogunleye</h4>
                                    <p className="text-gold font-bold tracking-widest uppercase text-sm">Founder & Initiator</p>
                                </div>
                            </div>
                            <div className="p-12 md:p-16 lg:p-20 flex flex-col justify-center">
                                <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Founder Profile</h3>
                                <h4 className="text-4xl md:text-5xl font-bold text-primary mb-6 hidden lg:block">Oladoyin Ogunleye</h4>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8 italic border-l-4 border-gold pl-6">
                                    "Giving Without Limit was born from a divine mandate and my own past life experiences. We are committed to making a difference in the lives of those surviving on less than $2 a day."
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mr-4">
                                            <i className="fas fa-briefcase"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-400">Profession</p>
                                            <p className="font-semibold text-primary">Professional Health Assistant</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mr-4">
                                            <i className="fas fa-location-dot"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-400">Base Location</p>
                                            <p className="font-semibold text-primary">Chicago, USA</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mr-4">
                                            <i className="fas fa-history"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-400">Founding Date</p>
                                            <p className="font-semibold text-primary">Established in 2016</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Operational Framework */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Operational Framework</h3>
                        <h4 className="text-3xl md:text-5xl font-bold text-primary">How We Operate</h4>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                            <h5 className="font-bold text-primary text-xl mb-4">Geographic Scope</h5>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <i className="fas fa-check text-gold mt-1 mr-3"></i>
                                    <span>Current Focus: Nigeria (primary base)</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-gold mt-1 mr-3"></i>
                                    <span>Future Vision: Global expansion</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-gold mt-1 mr-3"></i>
                                    <span>Hub: Chicago, USA (Strategic Coordination)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                            <h5 className="font-bold text-primary text-xl mb-4">Legal Structure</h5>
                            <p className="text-gray-600 mb-4">Main Registration: Nigeria (NGO status)</p>
                            <p className="text-gray-600 italic">Affiliation Model: International country chapters affiliate to the Nigerian main body.</p>
                        </div>
                        <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                            <h5 className="font-bold text-primary text-xl mb-4">Governance Policies</h5>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <i className="fas fa-clock text-gold mt-1 mr-3"></i>
                                    <span>Tenure: 4 years per term (2 terms max)</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-user-tie text-gold mt-1 mr-3"></i>
                                    <span>Board: Nominated based on expertise</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-handshake text-gold mt-1 mr-3"></i>
                                    <span>Resignation: 6 months notice required</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Funding Strategy */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="h-full w-full bg-[radial-gradient(circle,rgba(255,184,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-12">Funding Strategy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-white/10 p-10 rounded-3xl border border-white/20">
                            <h4 className="text-gold font-bold text-3xl mb-2">Primary</h4>
                            <p className="text-white font-bold mb-4">External Donations</p>
                            <p className="text-gray-400 text-sm">Individual and corporate donor contributions from around the world.</p>
                        </div>
                        <div className="bg-white/10 p-10 rounded-3xl border border-white/20">
                            <h4 className="text-gold font-bold text-3xl mb-2">Secondary</h4>
                            <p className="text-white font-bold mb-4">Member Contributions</p>
                            <p className="text-gray-400 text-sm">Internal fundraising from our dedicated organizational members.</p>
                        </div>
                        <div className="bg-white/10 p-10 rounded-3xl border border-white/20">
                            <h4 className="text-gold font-bold text-3xl mb-2">30%</h4>
                            <p className="text-white font-bold mb-4">Founder Commitment</p>
                            <p className="text-gray-400 text-sm">Percentage of founder's income from books and honoraria is dedicated to the mission.</p>
                        </div>
                    </div>

                    <div className="bg-white text-primary p-12 rounded-[3rem] max-w-4xl mx-auto shadow-2xl">
                        <h4 className="text-2xl font-bold mb-8">Transparency & Accountability</h4>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            The organization demonstrates unwavering commitment to transparency through detailed financial reporting, donor appreciation, and public accountability for all humanitarian initiatives.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                                    <i className="fas fa-file-invoice-dollar"></i>
                                </div>
                                <p className="font-bold text-sm">Annual Comprehensive Reports</p>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                                    <i className="fas fa-magnifying-glass-chart"></i>
                                </div>
                                <p className="font-bold text-sm">Impact Metrics & Benchmarks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gold py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-primary text-3xl font-bold mb-8 uppercase tracking-tight italic">Giving without limit... Till Jesus Come.</h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/donate')}
                            className="bg-primary text-white font-bold px-12 py-4 rounded-full hover:bg-secondary transition-all shadow-xl transform hover:scale-105"
                        >
                            SUPPORT OUR MISSION
                        </button>
                        <button
                            onClick={() => navigate('/impact#media-vault')}
                            className="bg-white text-primary font-bold px-12 py-4 rounded-full hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105"
                        >
                            VIEW OUR IMPACT
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
