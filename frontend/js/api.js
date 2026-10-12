
const API_BASE = "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("foodiehub_token");

    const headers = {
        ...options.headers
    };

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

function requireLogin() {
    if (!localStorage.getItem("foodiehub_token")) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function logout() {
    localStorage.removeItem("foodiehub_token");
    window.location.href = "index.html";
}
