
import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';

const VolunteerInPerson: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        interest_area: 'Field Volunteering (Nigeria)',
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
            icon: "walking",
            items: [
                "Support field operations and community programs in Nigeria",
                "Assist with event planning, setup, and execution",
                "Help with daily office operations and administrative tasks",
                "Engage directly with community members and beneficiaries",
                "Provide on-site support for programs and initiatives",
                "Collaborate with staff and fellow volunteers on various projects"
            ]
        },
        {
            title: "What You'll Gain",
            icon: "medal",
            items: [
                "Direct, meaningful impact in communities served",
                "Hands-on experience in nonprofit operations",
                "Personal growth and leadership development",
                "Cultural exchange and global perspective",
                "Strong sense of community and purpose",
                "Professional references and skill development"
            ]
        }
    ];

    const locations = [
        {
            place: "Nigeria Field Teams",
            icon: "globe-africa",
            desc: "Join us on the ground where our primary programs serve communities in need.",
            tasks: [
                "Community outreach and program delivery",
                "Educational workshops and training sessions",
                "Distribution events for food and supplies",
                "Health and wellness initiatives",
                "Youth mentorship activities",
                "Infrastructure and maintenance projects"
            ]
        },
        {
            place: "Chicago Support Office",
            icon: "building",
            desc: "Support our operations from our US-based hub.",
            tasks: [
                "Front desk and visitor services",
                "Data entry and database management",
                "Donation processing and acknowledgment",
                "Event coordination and logistics",
                "Materials preparation and mailings",
                "Communications support"
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
                    <h1 className="text-4xl md:text-7xl font-bold mb-6">Volunteer in <span className="text-gold">Person</span></h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Make a hands-on impact by joining our field teams in Nigeria or supporting our operations at our Chicago office. Your presence makes a direct difference.
                    </p>
                </div>
            </section>

            {/* Overview Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
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

            {/* Locations Section */}
            <section className="py-24 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Service Hubs</h2>
                        <h3 className="text-4xl font-bold text-white">Volunteer Locations</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {locations.map((loc, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-primary text-xl mb-6">
                                    <i className={`fas fa-${loc.icon}`}></i>
                                </div>
                                <h4 className="text-2xl font-bold mb-2 text-gold">{loc.place}</h4>
                                <p className="text-gray-300 mb-8 text-sm">{loc.desc}</p>
                                <ul className="space-y-3">
                                    {loc.tasks.map((task, i) => (
                                        <li key={i} className="text-gray-100 text-sm flex items-center">
                                            <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3"></div>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-3xl font-bold text-primary mb-12 text-center">Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-primary flex items-center">
                                <span className="w-8 h-8 bg-gold/20 text-gold rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                                General Requirements
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600 ml-11">
                                <li>• Minimum age of 18 (16 with consent for Chicago)</li>
                                <li>• Completion of orientation and training</li>
                                <li>• Background check clearance</li>
                                <li>• Physical ability for assigned tasks</li>
                                <li>• Positive, team-oriented mindset</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-primary flex items-center">
                                <span className="w-8 h-8 bg-gold/20 text-gold rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                                Nigeria Field Team Plus
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600 ml-11">
                                <li>• Valid passport & travel documentation</li>
                                <li>• Vaccinations & health clearance</li>
                                <li>• Travel insurance coverage</li>
                                <li>• Cultural sensitivity and adaptability</li>
                                <li>• Ability to work in resource-limited settings</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Provided */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-primary mb-8 text-center">Support Provided</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h5 className="font-bold text-gold mb-4 uppercase text-xs tracking-widest">For Nigeria Volunteers</h5>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Pre-departure orientation, in-country accommodation, local transport, 24/7 staff support, and fundraising guidance.
                                </p>
                            </div>
                            <div>
                                <h5 className="font-bold text-gold mb-4 uppercase text-xs tracking-widest">For Chicago Volunteers</h5>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Comprehensive training, dedicated coordinator, flexible scheduling, and transit assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-primary text-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
                                    <i className="fas fa-heart"></i>
                                </div>
                                <h4 className="text-3xl font-bold text-primary">Ready for Action!</h4>
                                <p className="text-gray-500 mt-4 leading-relaxed">
                                    Your interest in field/office volunteering has been noted. A coordinator will reach out to schedule your interview and orientation.
                                </p>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-bold text-primary">In-Person Application</h3>
                                    <p className="text-gray-400 mt-2">Let us know where your heart is leading you to serve.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary transition-all outline-none"
                                        placeholder="Full Name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary transition-all outline-none"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <select
                                        required
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary transition-all outline-none md:col-span-2 text-gray-500"
                                        value={formData.interest_area}
                                        onChange={(e) => setFormData({ ...formData, interest_area: e.target.value })}
                                    >
                                        <option value="Field Volunteering (Nigeria)">Nigeria Field Teams</option>
                                        <option value="Administrative Support (USA)">Chicago Support Office</option>
                                    </select>
                                </div>
                                <textarea
                                    required
                                    className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary transition-all outline-none h-32"
                                    placeholder="Tell us about your background and why you want to serve in person..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white font-bold py-6 rounded-2xl hover:bg-secondary transition-all shadow-xl text-xl disabled:opacity-50"
                                >
                                    {loading ? 'SUBMITTING...' : 'START YOUR SERVICE JOURNEY'}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-2 pt-4">
                                    <i className="fas fa-shield-alt"></i> Background check required for all in-person roles.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VolunteerInPerson;
