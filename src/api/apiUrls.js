export const BASE_URL = "http://localhost:8080/";

export const UP_IMG = `${BASE_URL}api/upload-image`;

//Login-Register
export const LOGIN = `${BASE_URL}api/auth/login`;
export const GG_LOGIN = `${BASE_URL}oauth2/authorization/google`; //bug
export const PROFILE = `${BASE_URL}api/user/profile`;
export const REGISTER = `${BASE_URL}api/auth/register`;
export const REGISTER_CONFIRM_EMAIL = `${BASE_URL}api/auth/register/confirm-email`;
export const RESEND_VERIFICATION_EMAIL = `${BASE_URL}api/auth/register/resend-verification-email"`;
export const FORGOT_PASSWORD = `${BASE_URL}api/auth/forgot-password`;
export const RESET_PASSWORD = `${BASE_URL}api/auth/reset-password`;


//Service-Management
export const LIST_SERVICE_HOME = `${BASE_URL}api/home/services`;
export const LIST_SERVICE = `${BASE_URL}api/list/services`;
export const CREATE_SERVICE = `${BASE_URL}api/manage/services`;
export const LIST_SERVICE_MANAGE =`${BASE_URL}api/manage/services`;
export const EDIT_SERVICE = (id) => `${BASE_URL}api/manage/services/${id}`;
export const CREATE_SERVICE_DETAILS = (serviceId) => `${BASE_URL}api/manage/services/${serviceId}/service-details`;
export const LIST_SERVICE_DETAILS = (serviceId) => `${BASE_URL}api/services/${serviceId}/service-details`;
export const EDIT_SERVICE_DETAILS = (serviceId, id) => `${BASE_URL}api/manage/services/${serviceId}/service-details/${id}`;
export const CREATE_SERVICE_STAGE = (serviceId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage`;
export const LIST_SERVICE_STAGES = (serviceId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage`;
export const EDIT_SERVICE_STAGES = (serviceId, stageId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage/${stageId}`;
export const DELETE_SERVICE_STAGE = (serviceId, stageId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage/${stageId}`;

//Blog-Management
export const CREATE_BLOG = `${BASE_URL}api/blogs`;
export const GET_DOCTOR_BLOGS = `${BASE_URL}api/blogs/mine`;
export const GET_ALL_BLOGS = `${BASE_URL}api/blogs`; //cùng link với put 
export const APPROVE_BLOG = (id) => `${BASE_URL}api/blogs/${id}/approve`;
export const REJECT_BLOG = (id) => `${BASE_URL}api/blogs/${id}/reject`;
