
import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';

const SkillBasedSupport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        interest_area: 'Skill-Based Support',
        bio: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.submitVolunteerApplication(formData);
            setSubmitted(true);
        } catch (error: any) {
            alert('Submission failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        {
            title: "What You'll Do",
            icon: "laptop-code",
            items: [
                "Provide remote professional support in your area of expertise",
                "Work on specific projects aligned with your skills and availability",
                "Collaborate with our team to implement best practices and innovative solutions",
                "Help build and maintain our organizational infrastructure"
            ]
        },
        {
            title: "Requirements",
            icon: "check-double",
            items: [
                "Proven experience in your professional field",
                "Reliable internet connection and necessary equipment",
                "Strong communication and self-management skills",
                "Commitment to our mission and values",
                "Ability to work independently with minimal supervision"
            ]
        },
        {
            title: "What You'll Gain",
            icon: "chart-line",
            items: [
                "Opportunity to use your professional skills for social impact",
                "Experience working with a mission-driven organization",
                "Portfolio pieces and professional references",
                "Networking opportunities within the nonprofit sector",
                "Volunteer appreciation and recognition"
            ]
        }
    ];

    const needs = [
        {
            area: "Administration",
            icon: "folder-open",
            tasks: [
                "Database management and record keeping",
                "Volunteer coordination and scheduling",
                "Grant writing and research",
                "Event planning and logistics support"
            ]
        },
        {
            area: "Social Media & Marketing",
            icon: "hashtag",
            tasks: [
                "Content creation and copywriting",
                "Social media strategy and management",
                "Graphic design and visual communications",
                "Email marketing campaigns",
                "Photography and videography"
            ]
        },
        {
            area: "Technical Fields",
            icon: "code",
            tasks: [
                "Website development and maintenance",
                "IT support and systems management",
                "Data analysis and reporting",
                "Software development and automation",
                "Cybersecurity and data protection"
            ]
        }
    ];

    return (
        <div className="pt-20 bg-white">
            {/* Hero Section */}
            <section className="bg-primary py-24 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <Link to="/get-involved" className="text-gold font-bold text-sm uppercase tracking-widest mb-8 inline-block hover:text-white transition-colors">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Getting Involved
                    </Link>
                    <h1 className="text-4xl md:text-7xl font-bold mb-6">Skill-Based <span className="text-gold">Support</span></h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Share your professional expertise to help us grow and serve our community more effectively. Your knowledge can make a lasting impact from anywhere in the world.
                    </p>
                </div>
            </section>

            {/* Overview & Doing Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-gold text-2xl mb-8">
                                    <i className={`fas fa-${section.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-6">{section.title}</h3>
                                <ul className="space-y-4">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex items-start text-gray-600 text-sm">
                                            <i className="fas fa-check-circle text-gold mt-1 mr-3 shrink-0"></i>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Areas of Need Section */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Professional Expertise</h2>
                        <h3 className="text-4xl font-bold">Areas of Need</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {needs.map((act, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10">
                                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-primary text-xl mb-6">
                                    <i className={`fas fa-${act.icon}`}></i>
                                </div>
                                <h4 className="text-xl font-bold mb-6 text-gold">{act.area}</h4>
                                <ul className="space-y-3">
                                    {act.tasks.map((task, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex items-center">
                                            <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3 shrink-0"></div>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gray-50 rounded-[3rem] p-12 md:p-16 border border-gray-100 flex flex-col md:flex-row items-center gap-12 shadow-inner">
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-3xl font-bold text-primary mb-4">Time Commitment</h3>
                            <p className="text-gray-600 leading-relaxed italic">
                                "Flexible and project-based. Most volunteers contribute 2-10 hours per month, but we can work with your schedule. Short-term projects and ongoing support roles are both available."
                            </p>
                        </div>
                        <div className="w-40 h-40 bg-white rounded-full border-8 border-gold flex items-center justify-center text-primary text-4xl shadow-xl">
                            <div className="text-center">
                                <p className="text-2xl font-black">2-10</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Hrs/Mo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Section */}
            <section className="pb-24" id="apply-now">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Drive the Mission</h2>
                        <h3 className="text-4xl font-bold text-primary mb-6">Skill-Based Volunteer Form</h3>
                        <p className="text-gray-500">Ready to lend your expertise? Fill out the form below to show your interest.</p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
                                    <i className="fas fa-hand-holding-heart"></i>
                                </div>
                                <h4 className="text-3xl font-bold text-primary">Application Received!</h4>
                                <p className="text-gray-500 mt-4 leading-relaxed">
                                    Thank you for offering your professional skills! Our team will review your application and match you with a project that fits your expertise.
                                </p>
                                <div className="mt-8 space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Coordinator Contact</p>
                                    <p className="text-primary font-bold">volunteer@givingwithoutlimit.org</p>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="Your Name"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Professional Background & Skilled Area</label>
                                    <textarea
                                        required
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none h-32"
                                        placeholder="What are your areas of expertise?"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white font-bold py-6 rounded-2xl hover:bg-secondary transition-all shadow-xl text-xl flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? 'PROCESSING...' : 'APPLY AS SKILL-BASED VOLUNTEER'}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest italic pt-4">
                                    "Let the good works continue."
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Coordinator */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h4 className="text-primary font-bold mb-4">Still have questions?</h4>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-envelope text-gold"></i>
                            <span className="text-gray-500">volunteer@givingwithoutlimit.org</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <i className="fas fa-phone text-gold"></i>
                            <span className="text-gray-500">+234-8027386181</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SkillBasedSupport;
