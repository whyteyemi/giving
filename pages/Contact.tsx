
import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="pt-20 bg-white">
            {/* Header */}
            <section className="bg-primary py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Get in Touch</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">We'd Love to Hear from You</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                        Whether you have a question about our operations, want to partner, or just want to share a word of encouragement.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-12">
                            <div>
                                <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-6">Our Offices</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 mr-4 border border-gray-100">
                                            <i className="fas fa-map-marker-alt"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary">Chicago Headquarters</h4>
                                            <p className="text-gray-500 text-sm mt-1">Chicago, Illinois, USA</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 mr-4 border border-gray-100">
                                            <i className="fas fa-satellite-dish"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary">Nigeria Operations</h4>
                                            <p className="text-gray-500 text-sm mt-1">Lagos, Ibadan & Abuja Hubs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-6">Communication Corner</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 mr-4 border border-gray-100">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary">Email Support</h4>
                                            <p className="text-gray-500 text-sm mt-1">bisowilly@yahoo.com</p>
                                            <p className="text-gray-500 text-sm mt-1">givingwithoutlimit24@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 mr-4 border border-gray-100">
                                            <i className="fas fa-phone-alt"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary">Phone / Whatsapp / Zelle</h4>
                                            <p className="text-gray-500 text-sm mt-1">312-479-3840 (USA / Zelle)</p>
                                            <p className="text-gray-500 text-sm mt-1">0906 333 3525 (NGR)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <h4 className="font-bold text-primary mb-4">Social Media</h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Email Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-primary mb-8 text-center md:text-left">Send us a Message</h3>
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input type="email" className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                        <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none" placeholder="How can we help?" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                        <textarea className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white transition-all outline-none h-48" placeholder="Share your thoughts..."></textarea>
                                    </div>
                                    <button className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-secondary transition-all shadow-xl text-lg flex items-center justify-center">
                                        <i className="fas fa-paper-plane mr-3"></i> SEND MESSAGE
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Gallery Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
                    <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Faces of the Mission</h2>
                    <h3 className="text-3xl font-bold text-primary">Why We Serve</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
                    <div className="h-80 overflow-hidden relative group">
                        <img
                            src="/feeding_contact.jpeg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Feeding Program Outreach"
                        />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-bold text-sm uppercase tracking-widest">Hope Restored</p>
                        </div>
                    </div>
                    <div className="h-80 overflow-hidden relative group">
                        <img
                            src="/widow_contact.jpeg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Widow Support Mission"
                        />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-bold text-sm uppercase tracking-widest">Divine Support</p>
                        </div>
                    </div>
                    <div className="h-80 overflow-hidden relative group bg-gray-200">
                        <img
                            src="/kids_club_contact.jpeg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Kids Club Activities"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-bold text-sm uppercase tracking-widest">Life Without Limits</p>
                        </div>
                    </div>
                    <div className="h-80 overflow-hidden relative group bg-gray-300">
                        <img
                            src="/easter_contact.jpeg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Easter Giveaway Event"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-bold text-sm uppercase tracking-widest">Spreading Kindness</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
