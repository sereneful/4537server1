class API {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        } catch (error) {
            console.error("Error in POST request:", error);
            return { message: `Error: ${error.message}` };
        }
    }

    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        } catch (error) {
            console.error("Error in GET request:", error);
            return { message: `Error: ${error.message}` };
        }
    }
}

class PatientApp {
    constructor(api) {
        this.api = api;
        this.init();
    }

    init() {
        document.getElementById('insert-btn').addEventListener('click', () => this.insertPatients());
        document.getElementById('submit-query').addEventListener('click', () => this.submitQuery());
    }

    async insertPatients() {
        const patientsData = [
            { patientName: 'Sara Brown', birthDate: '1901-01-01' },
            { patientName: 'John Smith', birthDate: '1941-01-01' },
            { patientName: 'Jack Ma', birthDate: '1961-01-30' },
            { patientName: 'Elon Musk', birthDate: '1999-01-01' }
        ];

        const result = await this.api.post('/api/insert-multiple', { patients: patientsData });

        this.displayResponse('insert-response', result.message || 'Unknown error occurred');
    }

    async submitQuery() {
        const query = document.getElementById('sql-query').value.trim();

        try {
            let result;
            if (query.startsWith("INSERT")) {
                result = await this.api.post('/api/query', { sql: query });
            } else if (query.startsWith("SELECT")) {
                const encodedQuery = encodeURIComponent(query);
                result = await this.api.get(`/api/query?sql=${encodedQuery}`);
            } else {
                throw new Error("Only INSERT or SELECT queries are allowed.");
            }

            if (result.error) {
                throw new Error(result.error);
            }

            this.displayResponse('query-response', `Response: ${JSON.stringify(result)}`);
        } catch (error) {
            this.displayResponse('query-response', `Error: ${error.message}`);
        }
    }

    displayResponse(elementId, message) {
        document.getElementById(elementId).innerText = message;
    }
}

// Initialize the app
const api = new API('hammerhead-app-2-audps.ondigitalocean.app');
const patientApp = new PatientApp(api);
