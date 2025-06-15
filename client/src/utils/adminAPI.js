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

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  getAuthHeadersForFormData() {
    const localStorageToken = localStorage.getItem("adminToken");
    const accessTokenCookie = this.getCookie("accessToken");
    const adminTokenCookie = this.getCookie("adminToken");
    const refreshTokenCookie = this.getCookie("refreshToken");

    const token =
      localStorageToken ||
      accessTokenCookie ||
      adminTokenCookie ||
      refreshTokenCookie;

    return {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type for FormData, let browser set it
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

  async requestWithFormData(endpoint, formData, method = "POST") {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      });

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

  // Property Management APIs
  async getProperties(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams
      ? `/properties/all?${queryParams}`
      : "/properties/all";
    return this.request(endpoint);
  }

  async getProperty(id) {
    return this.request(`/properties/${id}`);
  }

  async getPropertyById(id) {
    const response = await this.request(`/properties/${id}`);
    return response.data || response;
  }

  async createProperty(formData) {
    return this.requestWithFormData("/properties/create", formData);
  }

  async updateProperty(id, formData) {
    return this.requestWithFormData(`/properties/${id}`, formData, "PUT");
  }

  async deleteProperty(id) {
    return this.request(`/properties/${id}`, {
      method: "DELETE",
    });
  }

  async togglePropertyStatus(id, isActive) {
    return this.request(`/properties/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  }

  async updatePropertyHighlight(id, highlight) {
    return this.request(`/properties/${id}/highlight`, {
      method: "PATCH",
      body: JSON.stringify({ highlight }),
    });
  }

  async bulkUpdateHighlights(propertyIds, highlight) {
    return this.request("/properties/bulk/highlights", {
      method: "PATCH",
      body: JSON.stringify({ propertyIds, highlight }),
    });
  }

  async getPropertyAnalytics(id) {
    return this.request(`/properties/${id}/analytics`);
  }

  async getFeaturedProperties(limit = 12) {
    return this.request(`/properties/featured?limit=${limit}`);
  }

  async getTrendingProperties(limit = 12) {
    return this.request(`/properties/trending?limit=${limit}`);
  }

  async getPropertiesByHighlight(highlight, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams
      ? `/properties/highlight/${highlight}?${queryParams}`
      : `/properties/highlight/${highlight}`;
    return this.request(endpoint);
  }

  // Property Images & Videos
  async addPropertyImages(propertyId, formData) {
    return this.requestWithFormData(
      `/properties/${propertyId}/images`,
      formData
    );
  }

  async deletePropertyImage(imageId) {
    return this.request(`/properties/images/${imageId}`, {
      method: "DELETE",
    });
  }

  async addPropertyVideos(propertyId, formData) {
    return this.requestWithFormData(
      `/properties/${propertyId}/videos`,
      formData
    );
  }

  async deletePropertyVideo(videoId) {
    return this.request(`/properties/videos/${videoId}`, {
      method: "DELETE",
    });
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

  // Inquiry Management APIs
  async getAllInquiries(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/inquiries?${queryParams}` : "/inquiries";
    return this.request(endpoint);
  }

  async getInquiryById(id) {
    return this.request(`/inquiries/${id}`);
  }

  async updateInquiryStatus(id, status) {
    return this.request(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async respondToInquiry(id, response) {
    return this.request(`/inquiries/${id}/respond`, {
      method: "POST",
      body: JSON.stringify({ response }),
    });
  }

  async deleteInquiry(id) {
    return this.request(`/inquiries/${id}`, {
      method: "DELETE",
    });
  }

  async markInquiryAsSpam(id) {
    return this.request(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "SPAM" }),
    });
  }
}

export const adminAPI = new AdminAPI();
export default adminAPI;
