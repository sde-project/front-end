export default class http {
    static post(url, data = {}, headers = {}) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                ...headers
            },
            body: JSON.stringify(data)
        });
    }

    static put(url, data = {}, headers = {}) {
        return fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                ...headers
            },
            body: JSON.stringify(data)
        });
    }

    static delete(url, headers = {}) {
        return fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                ...headers
            }
        });
    }

    static get(url, headers = {}) {
        return fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                ...headers
            }
        });
    }
};