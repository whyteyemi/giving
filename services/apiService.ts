
const API_BASE = import.meta.env.VITE_API_BASE || '';
const API_URL = `${API_BASE}/api.php`; // cPanel: keep api.php in web root (or set VITE_API_BASE)

function getAuthToken(): string {
    return localStorage.getItem('giving_token') || '';
}

function withAuth(headers: Record<string, string> = {}) {
    const token = getAuthToken();
    return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

export const apiService = {
    async get(action: string) {
        const response = await fetch(`${API_URL}?action=${action}`, {
            headers: withAuth()
        });
        if (!response.ok) {
            let msg = `API request failed (${response.status})`;
            try {
                const text = await response.text();
                if (text) {
                    const err = JSON.parse(text);
                    msg = err.error || err.message || msg;
                }
            } catch (_) { }
            throw new Error(msg);
        }
        return response.json();
    },

    async post(action: string, data: any) {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: withAuth({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            // Safely parse error — body may be empty if server crashed
            let errMessage = `Server error (${response.status})`;
            try {
                const text = await response.text();
                if (text) {
                    const err = JSON.parse(text);
                    errMessage = err.error || err.message || errMessage;
                }
            } catch (_) { /* keep default message */ }
            throw new Error(errMessage);
        }
        return response.json();
    },

    async upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_URL}?action=upload_media`, {
            method: 'POST',
            headers: withAuth(),
            body: formData
        });

        if (!response.ok) {
            let msg = 'Upload failed';
            try {
                const err = await response.json();
                msg = err.error || err.message || msg;
            } catch (_) { }
            throw new Error(msg);
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    },

    // Specific methods
    async fetchEvents() { return this.get('get_events'); },
    async fetchAllEventMedia() { return this.get('get_all_event_media'); },
    async fetchEventMedia(eventId: string) { return this.get(`get_event_media&event_id=${eventId}`); },
    async fetchImpact() { return this.get('get_impact'); },
    async fetchProfiles() { return this.get('get_profiles'); },
    async fetchVolunteers() { return this.get('get_volunteers'); },

    async login(credentials: any) { return this.post('login', credentials); },
    async signup(userInfo: any) { return this.post('signup', userInfo); },
    async forgotPassword(email: string) { return this.post('forgot_password', { email }); },
    async updatePassword(token: string, password: string) { return this.post('reset_password', { token, password }); },

    async submitVolunteerApplication(formData: any) { return this.post('submit_volunteer_application', formData); },

    async createEvent(eventData: any) { return this.post('add_event', eventData); },
    async deleteEvent(id: string) { return this.post('delete_event', { id }); },
    async addEventMedia(mediaData: any) { return this.post('add_event_media', mediaData); },
    async deleteEventMedia(id: string) { return this.post('delete_event_media', { id }); },

    async updateProfile(id: string, updates: any) { return this.post('update_profile', { id, ...updates }); },
    async deleteProfile(id: string) { return this.post('delete_profile', { id }); },

    async updateVolunteerStatus(id: string, status: string) { return this.post('update_volunteer', { id, status }); },
    async deleteVolunteer(id: string) { return this.post('delete_volunteer', { id }); },

    // Donation methods (uses donate.php)
    async donatePost(action: string, data: any) {
        const response = await fetch(`${API_BASE}/donate.php?action=${action}`, {
            method: 'POST',
            headers: withAuth({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errMessage = `Server error (${response.status})`;
            try {
                const text = await response.text();
                if (text) {
                    const err = JSON.parse(text);
                    errMessage = err.error || err.message || errMessage;
                }
            } catch (_) { }
            throw new Error(errMessage);
        }
        return response.json();
    },
    async initializeTransaction(data: any) { return this.donatePost('initialize_transaction', data); },
    async verifyTransaction(reference: string) {
        const response = await fetch(`${API_BASE}/donate.php?action=verify_transaction&reference=${reference}`);
        if (!response.ok) throw new Error('Verification failed');
        return response.json();
    },
    async fetchDonations() {
        const response = await fetch(`${API_BASE}/donate.php?action=get_donations`, {
            headers: withAuth()
        });
        if (!response.ok) throw new Error('Failed to fetch donations');
        return response.json();
    },
    async fetchFieldReports() { return this.get('get_field_reports'); },
    async createFieldReport(reportData: any) { return this.post('add_field_report', reportData); },
    async updateFieldReport(reportData: any) { return this.post('update_field_report', reportData); },
    async deleteFieldReport(id: string) { return this.post('delete_field_report', { id }); },
    async submitAILead(leadData: any) { return this.post('submit_ai_lead', leadData); }
};
