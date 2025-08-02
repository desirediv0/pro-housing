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
  getAnalyticsData: (params) => apiClient.get("/analytics/data", { params }),
  getPropertyAnalytics: (params) =>
    apiClient.get("/analytics/properties", { params }),
  exportAnalytics: (params) => apiClient.get("/analytics/export", { params }),
  getRecentActivities: (limit = 10) =>
    apiClient.get(`/analytics/recent-activities?limit=${limit}`),

  // Inquiries
  getAllInquiries: (params) => apiClient.get("/inquiries", { params }),
  getInquiryById: (id) => apiClient.get(`/inquiries/${id}`),
  updateInquiryStatus: (id, status) =>
    apiClient.patch(`/inquiries/${id}/status`, { status }),
  respondToInquiry: (id, response) =>
    apiClient.post(`/inquiries/${id}/respond`, { response }),
  deleteInquiry: (id) => apiClient.delete(`/inquiries/${id}`),
  bulkUpdateInquiries: (inquiryIds, data) =>
    apiClient.patch("/inquiries/bulk", { inquiryIds, ...data }),
  getInquiryStats: (params) => apiClient.get("/inquiries/stats", { params }),

  // Expertise Inquiries
  getAllExpertiseInquiries: (params) => apiClient.get("/expertise", { params }),
  updateExpertiseInquiryStatus: (id, status) =>
    apiClient.put(`/expertise/${id}`, { status }),
  respondToExpertiseInquiry: (id, response) =>
    apiClient.post(`/expertise/${id}/respond`, { response }),
  deleteExpertiseInquiry: (id) => apiClient.delete(`/expertise/${id}`),
  bulkUpdateExpertiseInquiries: (ids, action) =>
    apiClient.post("/expertise/bulk", { ids, action }),

  // Reviews
  getAllReviews: (params) => apiClient.get("/reviews", { params }),
  getReview: (id) => apiClient.get(`/reviews/${id}`),
  updateReviewStatus: (id, status) =>
    apiClient.put(`/reviews/${id}`, { status }),
  respondToReview: (id, response) =>
    apiClient.put(`/reviews/${id}`, { adminResponse: response }),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
  bulkUpdateReviews: (ids, action) =>
    apiClient.post("/reviews/bulk", { reviewIds: ids, action }),
  getReviewStats: () => apiClient.get("/reviews/stats"),

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

  // Categories
  getPropertiesByCategory: (category, limit = 6) =>
    apiClient.get(`/properties/public/category/${category}?limit=${limit}`),
  getCategoryStats: () => apiClient.get("/properties/public/categories/stats"),

  // Inquiries
  submitInquiry: (inquiry) => apiClient.post("/inquiries", inquiry),
  submitGeneralInquiry: (inquiry) =>
    apiClient.post("/inquiries/general", inquiry),
  submitExpertiseInquiry: (inquiry) => apiClient.post("/expertise", inquiry),

  // Reviews
  submitReview: (review) => apiClient.post("/reviews", review),
  getPropertyReviews: (propertyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/reviews/property/${propertyId}?${queryString}`);
  },

  // Sidebar Content
  getSidebarContent: () => apiClient.get("/sidebar/public"),
};

const apiExports = { adminAPI, publicAPI };
export default apiExports;
