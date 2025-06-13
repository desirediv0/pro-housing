import apiClient from "./api";

// Admin API functions
export const adminAPI = {
  // Auth
  login: (credentials) => apiClient.post("/admin/login", credentials),
  logout: () => apiClient.post("/admin/logout"),
  getProfile: () => apiClient.get("/admin/profile"),

  // Properties
  createProperty: (formData) =>
    apiClient.post("/properties/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAllProperties: (params) => apiClient.get("/properties/all", { params }),
  getProperty: (id) => apiClient.get(`/properties/${id}`),
  updateProperty: (id, formData) =>
    apiClient.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProperty: (id) => apiClient.delete(`/properties/${id}`),
  updatePropertyHighlight: (id, highlight) =>
    apiClient.patch(`/properties/${id}/highlight`, { highlight }),
  bulkUpdateHighlights: (propertyIds, highlight) =>
    apiClient.patch("/properties/bulk/highlights", { propertyIds, highlight }),

  // Analytics
  getDashboardStats: () => apiClient.get("/analytics/dashboard"),
  getRecentActivities: (limit = 10) =>
    apiClient.get(`/analytics/recent-activities?limit=${limit}`),
  getPropertyAnalytics: (id) => apiClient.get(`/analytics/property/${id}`),
  exportAnalytics: (format) =>
    apiClient.get(`/analytics/export?format=${format}`),

  // Inquiries
  getAllInquiries: (params) => apiClient.get("/inquiries", { params }),
  updateInquiryStatus: (id, status) =>
    apiClient.put(`/inquiries/${id}`, { status }),
  respondToInquiry: (id, response) =>
    apiClient.post(`/inquiries/${id}/respond`, { response }),
  deleteInquiry: (id) => apiClient.delete(`/inquiries/${id}`),
  bulkUpdateInquiries: (ids, action) =>
    apiClient.post("/inquiries/bulk", { ids, action }),

  // Sidebar Content
  getSidebarContent: () => apiClient.get("/sidebar"),
  createSidebarContent: (content) => apiClient.post("/sidebar", content),
  updateSidebarContent: (id, content) =>
    apiClient.put(`/sidebar/${id}`, content),
  deleteSidebarContent: (id) => apiClient.delete(`/sidebar/${id}`),
  uploadSidebarImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post("/sidebar/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadSidebarVideo: (file) => {
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.post("/sidebar/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteSidebarFile: (fileUrl) =>
    apiClient.delete("/sidebar/upload/delete", {
      data: { fileUrl },
    }),
};

// Public API functions
export const publicAPI = {
  // Properties
  getAllProperties: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/properties/public?${queryString}`);
  },
  getProperty: (id) => apiClient.get(`/properties/public/${id}`),
  getPropertyById: (id) => apiClient.get(`/properties/public/${id}`),
  getFeaturedProperties: () => apiClient.get("/properties/public/featured"),

  // Inquiries
  submitInquiry: (inquiry) => apiClient.post("/inquiries", inquiry),
  submitGeneralInquiry: (inquiry) =>
    apiClient.post("/inquiries/general", inquiry),

  // Sidebar Content
  getSidebarContent: () => apiClient.get("/sidebar/public"),
};

export default { adminAPI, publicAPI };
