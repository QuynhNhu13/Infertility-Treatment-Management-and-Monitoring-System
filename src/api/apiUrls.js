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
export const LIST_SERVICE_MANAGE = `${BASE_URL}api/manage/services`;
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
export const LIST_BLOG = `${BASE_URL}api/blogs/for-user`;

//Appointment-Management
export const GET_ALL_APPOINTMENT = `${BASE_URL}api/appointments/test`; //lấy api hiển thị cho doctor appointment manager
export const GET_LAST_APPOINTMENT = `${BASE_URL}api/appointments/last-appointment`; //cua nhan
export const APPOINTMENT_DOCTOR = `${BASE_URL}api/user/appointments/available-doctors`; //nhan
export const APPOINTMENT_DATE = `${BASE_URL}api/schedules/available-dates-by-date`; //nhan
export const AVAILABLE_DATES_BY_DOCTOR = `${BASE_URL}api/schedules/available-dates-by-doctor`; //nhan
export const SCHEDULE_SLOTS_BY_DOCTOR_AND_DATE = `${BASE_URL}api/schedules/slots`; //nhan
export const SCHEDULE_SLOTS_BY_DATE = `${BASE_URL}api/schedules/slots-by-date`; //nhan
export const CREATE_APPOINTMENT = `${BASE_URL}api/appointments/create`;//nhan
export const PAYMENT_VNPAY = `${BASE_URL}api/payment/vn-pay`;//nhan
export const PAYMENT_VNPAY_CALLBACK = `${BASE_URL}api/payment/vn-pay-callback`;//nhan
export const CONFIRM_APPOINTMENT = `${BASE_URL}api/appointments/confirm-appointment`;//nhan

//Medical-Record
// export const MEDICAL_RECORD = (accountId) => `${BASE_URL}api/medical-record/${accountId}`; //trang thông tin 
// export const MEDICAL_RECORD_CREATE = (medicalRecordId) => `${BASE_URL}api/medical-record/${medicalRecordId}`; //tạo

// export const LAB_TEST = `${BASE_URL}api/lab-test`;
// export const LAB_TEST_RESULT_INIT = (recordId) => `${BASE_URL}api/lab-test-result/init/${recordId}`;
// export const GET_LAB_TEST_RESULTS = (recordId) => `${BASE_URL}api/lab-test-result/init/${recordId}`;
// export const LAB_TEST_RESULT_SEARCH = `${BASE_URL}api/lab-test-result/search`;
// export const LAB_TEST_RESULT_FROM = (id) => `${BASE_URL}api/lab-test-result/${id}/staff`;
// export const GET_LAB_TEST_RESULT_VIEW = (id) => `${BASE_URL}api/lab-test-result/${id}/staff`;
// export const SEARCH_LAB_TEST_RESULT = (params) => {
//   const query = new URLSearchParams(params).toString();
//   return `${BASE_URL}api/lab-test-result/search?${query}`;
// };

// export const INIT_ULTRASOUND_FORM = `${BASE_URL}api/init-ultrasounds`;
// export const ULTRASOUND_IMAGE = (id) => `${BASE_URL}api/ultrasounds/images/${id}`;

// export const GET_TREATMENT_PLAN = (medicalRecordId) => `${BASE_URL}api/medical-record/${medicalRecordId}/treatment-plan`;
// export const CREATE_TREATMENT_PLAN = `${BASE_URL}api/medical-record/treatment-plan`;
// export const TREATMENT_UPDATE = (id) => `${BASE_URL}api/medical-record/treatment-stage-progress/${id}`;
// export const CREATE_TREATMENT_SESSION = (progressId) => `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions`;
// export const GET_TREATMENT_SESSION = (progressId) => `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions`;
// export const UPDATE_TREATMENT_SESSION = (progressId, sessionId) => `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions/${sessionId}`;
// export const DELETE_TREATMENT_SESSION = (progressId, sessionId) => `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions/${sessionId}`;

// export const GET_TREATMENT_DETAIL = (sessionId) => `${BASE_URL}api/treatment-sessions/${sessionId}/details`;
// export const LAB_TEST_FOLLOW_UP = (recordId, sessionId) => `${BASE_URL}api/medical-record/${recordId}/treatment-sessions/${sessionId}/lab-test-results`;
// export const ULTRASOUND_FOLLOW_UP = (sessionId) => `${BASE_URL}api/treatment-sessions/${sessionId}/follow-up-ultrasound`;
// export const UPDATE_ULTRASOUND = (id) => `${BASE_URL}api/ultrasounds/${id}`;
// export const DELETE_ULTRASOUND = (id) => `${BASE_URL}api/ultrasounds/${id}`;

//Medical-Record-New
export const GET_MEDICAL_RECORD_HISTORY = (accountId) => `${BASE_URL}api/medical-record/history/${accountId}`;
export const CREATE_MEDICAL_RECORD = (accountId) => `${BASE_URL}api/medical-record/new/${accountId}`;
export const GET_MEDICAL_RECORD = (recordId) => `${BASE_URL}api/medical-record/${recordId}`;
export const UPDATE_MEDICAL_RECORD = (id) => `${BASE_URL}api/medical-record/${id}`;

//Labtest - Management
export const LAB_TEST = `${BASE_URL}api/lab-test`;
export const LAB_TEST_FOLLOW_UP = (recordId, sessionId) => `${BASE_URL}api/medical-record/${recordId}/treatment-sessions/${sessionId}/lab-test-results`;
export const LAB_TEST_RESULT_INIT = (recordId) => `${BASE_URL}api/lab-test-result/init/${recordId}`;
export const LAB_TEST_RESULT_FROM = (id) => `${BASE_URL}api/lab-test-result/${id}/staff`;
export const SEARCH_LAB_TEST_RESULT = (params) => {
    const query = new URLSearchParams(params).toString();
    return `${BASE_URL}api/lab-test-result/search?${query}`;
};
export const GET_LAB_TEST_RESULT_VIEW = (id) => `${BASE_URL}api/lab-test-result/${id}/staff`;

//Ultrasound - Mangement
export const INIT_ULTRASOUND_FORM = `${BASE_URL}api/init-ultrasounds`;
export const UPDATE_ULTRASOUND = (id) => `${BASE_URL}api/ultrasounds/${id}`;
export const DELETE_ULTRASOUND = (id) => `${BASE_URL}api/ultrasounds/${id}`;
export const ULTRASOUND_IMAGE = (id) => `${BASE_URL}api/ultrasounds/images/${id}`;




//Schedule-Management
export const CREATE_SCHEDULE = `${BASE_URL}api/schedules`;
export const CREATE_SCHEDULE_TEMPLATE = `${BASE_URL}api/schedule-template`;
export const UPDATE_SCHEDULE_TEMPLATE = (id) => `${BASE_URL}api/schedule-template?id=${id}`;
export const GET_ALL_SCHEDULE_TEMPLATE = `${BASE_URL}api/schedule-template`;

//Consultation - Management
export const CONSULTATION_FORM = `${BASE_URL}api/consultation`;
