const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

class AdminAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const localStorageToken = localStorage.getItem("adminToken");
    const accessTokenCookie = this.getCookie("accessToken");
    const adminTokenCookie = this.getCookie("adminToken");
    const refreshTokenCookie = this.getCookie("refreshToken");

    const token =
      localStorageToken ||
      accessTokenCookie ||
      adminTokenCookie ||
      refreshTokenCookie;

    console.log("🔍 AdminAPI Token Debug:");
    console.log("Selected token:", token ? "Found" : "Not found");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  getCookie(name) {
    if (typeof document === "undefined") return null;
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop().split(";").shift();
        return cookieValue && cookieValue !== "undefined" ? cookieValue : null;
      }
      return null;
    } catch (error) {
      console.error(`Error reading cookie ${name}:`, error);
      return null;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Sidebar Content APIs
  async getSidebarContent() {
    return this.request("/sidebar");
  }

  async getSidebarContentById(id) {
    return this.request(`/sidebar/${id}`);
  }

  async createSidebarContent(data) {
    return this.request("/sidebar", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSidebarContent(id, data) {
    return this.request(`/sidebar/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSidebarContent(id) {
    return this.request(`/sidebar/${id}`, {
      method: "DELETE",
    });
  }

  async uploadSidebarImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${this.baseURL}/sidebar/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Upload failed");
    }

    return await response.json();
  }

  async uploadSidebarVideo(file) {
    const formData = new FormData();
    formData.append("video", file);

    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${this.baseURL}/sidebar/upload/video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Upload failed");
    }

    return await response.json();
  }

  async deleteFile(fileUrl) {
    return this.request("/sidebar/upload/delete", {
      method: "DELETE",
      body: JSON.stringify({ fileUrl }),
    });
  }

  async bulkUpdateSidebarStatus(contentIds, isActive) {
    return this.request("/sidebar/bulk-status", {
      method: "PATCH",
      body: JSON.stringify({ contentIds, isActive }),
    });
  }

  // Public APIs (no authentication required)
  async getPublicSidebarContent() {
    const response = await fetch(`${this.baseURL}/sidebar/public`);

    if (!response.ok) {
      throw new Error("Failed to fetch public sidebar content");
    }

    return await response.json();
  }
}

export const adminAPI = new AdminAPI();
export default adminAPI;
