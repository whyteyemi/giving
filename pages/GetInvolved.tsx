
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const GetInvolved: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        interest_area: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    const waysToHelp = [
        {
            title: 'Volunteer in Person',
            icon: 'hands-helping',
            color: 'bg-primary',
            desc: 'Join our field teams in Nigeria or our support office in Chicago for events and daily operations.',
            action: () => navigate('/volunteer-in-person')
        },
        {
            title: 'Skill-Based Support',
            icon: 'laptop-code',
            color: 'bg-gold',
            desc: 'Donate your professional skills in administration, social media, or technical fields remotely.',
            action: () => navigate('/skill-based-support')
        },
        {
            title: 'Be an Ambassador',
            icon: 'bullhorn',
            color: 'bg-primary',
            desc: 'Spread awareness in your church, school, or workplace and help us reach more partners.',
            action: () => navigate('/ambassador')
        }
    ];

    return (
        <div className="pt-20">
            {/* Header */}
            <section className="bg-primary py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Join the Movement</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Hands-on Compassion</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                        There are many ways to spread the kindness. Find the one that matches your heart and availability.
                    </p>
                </div>
            </section>

            {/* Ways to Help Cards */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {waysToHelp.map((item, idx) => (
                            <div key={idx} className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500">
                                <div className={`w-16 h-16 ${item.color} ${item.color === 'bg-gold' ? 'text-primary' : 'text-white'} rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform`}>
                                    <i className={`fas fa-${item.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-8">{item.desc}</p>
                                <button
                                    onClick={item.action}
                                    className="text-primary font-bold border-b-2 border-gold pb-1 hover:border-primary transition-colors"
                                >
                                    START HERE <i className="fas fa-arrow-right ml-2 text-sm"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="pb-24 bg-white" id="volunteer-form">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-inner">
                        {submitted ? (
                            <div className="text-center py-12 animate-fade-in">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h4 className="text-3xl font-bold text-primary">Request Received</h4>
                                <p className="text-gray-500 mt-4 leading-relaxed">
                                    Thank you for your willingness to serve. Our mission coordinators will review your profile and reach out via email shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-primary font-bold border-b-2 border-gold pb-1"
                                >
                                    SUBMIT ANOTHER REQUEST
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-12">
                                    <h4 className="text-3xl font-bold text-primary">Involvement Request</h4>
                                    <p className="text-gray-500 mt-2">Fill out this quick form and our team will be in touch.</p>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        className="p-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="p-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <select
                                        required
                                        className="p-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none md:col-span-2 text-gray-600"
                                        value={formData.interest_area}
                                        onChange={(e) => setFormData({ ...formData, interest_area: e.target.value })}
                                    >
                                        <option value="">Select Interest Area</option>
                                        <option value="Field Volunteering (Nigeria)">Field Volunteering (Nigeria)</option>
                                        <option value="Administrative Support (USA)">Administrative Support (USA)</option>
                                        <option value="Social Media & Media">Social Media & Media</option>
                                        <option value="Ambassadors Program">Ambassadors Program</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <textarea
                                        placeholder="Tell us about yourself and why you'd like to join us..."
                                        required
                                        className="p-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none md:col-span-2 h-32"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="md:col-span-2 bg-primary text-white font-bold py-5 rounded-2xl hover:bg-secondary transition-all shadow-xl text-lg disabled:opacity-50"
                                    >
                                        {loading ? 'SUBMITTING...' : 'SUBMIT VOLUNTEER REQUEST'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GetInvolved;

