const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

async function request(path, { method = "GET", body, token, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (formData) {
    payload = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, { method, headers, body: payload });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  base: BASE_URL,
  signup: (payload) => request("/api/auth/signup", { method: "POST", body: payload }),
  verify: (payload) => request("/api/auth/verify", { method: "POST", body: payload }),
  resendCode: (payload) => request("/api/auth/resend-code", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/api/auth/me", { token }),

  listComplaints: (token, params = "") => request(`/api/complaints${params}`, { token }),
  getComplaint: (token, id) => request(`/api/complaints/${id}`, { token }),
  createComplaint: (token, formData) =>
    request("/api/complaints", { method: "POST", token, body: formData, formData: true }),
  updateComplaint: (token, id, payload) =>
    request(`/api/complaints/${id}`, { method: "PATCH", token, body: payload }),

  wards: (token) => request("/api/wards", { token }),
  sensors: (token) => request("/api/sensors", { token }),
  ackSensor: (token, id) => request(`/api/sensors/${id}/ack`, { method: "POST", token }),
};
