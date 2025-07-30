export const BASE_URL = "http://localhost:8080/";

export const UP_IMG = `${BASE_URL}api/upload-image`;

//Login-Register
export const LOGIN = `${BASE_URL}api/auth/login`;
export const GG_LOGIN = `${BASE_URL}oauth2/authorization/google`; //bug
export const PROFILE = `${BASE_URL}api/user/profile`;
export const UPDATE_PROFILE = `${BASE_URL}api/user/profile`;
export const REGISTER = `${BASE_URL}api/auth/register`;
export const REGISTER_CONFIRM_EMAIL = `${BASE_URL}api/auth/register/confirm-email`;
export const RESEND_VERIFICATION_EMAIL = `${BASE_URL}api/auth/register/resend-verification-email`;
export const FORGOT_PASSWORD = `${BASE_URL}api/auth/forgot-password`;
export const RESET_PASSWORD = `${BASE_URL}api/auth/reset-password`;
export const CHANGE_PASSWORD = `${BASE_URL}api/auth/change-password`;
export const PROFILE_LOGIN = `${BASE_URL}api/accounts/login-info`;


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
export const LIST_SERVICE_STAGES = (serviceId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage`; //thiếu
export const EDIT_SERVICE_STAGES = (serviceId, stageId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage/${stageId}`;
export const DELETE_SERVICE_STAGE = (serviceId, stageId) => `${BASE_URL}api/manage/services/${serviceId}/service-stage/${stageId}`;

//Blog-Management
export const CREATE_BLOG = `${BASE_URL}api/blogs`;
export const GET_DOCTOR_BLOGS = `${BASE_URL}api/blogs/mine`;
export const GET_ALL_BLOGS = `${BASE_URL}api/blogs`; //cùng link với put 
export const APPROVE_BLOG = (id) => `${BASE_URL}api/blogs/${id}/approve`;
export const REJECT_BLOG = (id) => `${BASE_URL}api/blogs/${id}/reject`;
export const LIST_BLOG = `${BASE_URL}api/blogs/for-user`; //thiếu

//Appointment-Management
// export const GET_ALL_APPOINTMENT = `${BASE_URL}api/appointments/test`; //lấy api hiển thị cho doctor appointment manager
export const GET_ALL_APPOINTMENT = `${BASE_URL}api/appointments/doctor/filter-appointment`;

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
export const STAFF_GET_DOCTOR = `${BASE_URL}api/doctor/account`;
export const STAFF_GET_APPOINTMENT = `${BASE_URL}api/appointments/staff/filter-appointment`;
export const USER_GET_APPOINTMENT = `${BASE_URL}api/appointments/me`;
export const UPDATE_APPOINTMENT_STATUS = (id) =>
  `${BASE_URL}api/appointments/update-status?id=${id}`;



//Medical-Record-New
export const GET_MEDICAL_RECORD_HISTORY = (accountId) => `${BASE_URL}api/medical-record/history/${accountId}`;
export const CREATE_MEDICAL_RECORD = (accountId) => `${BASE_URL}api/medical-record/new/${accountId}`;
export const GET_MEDICAL_RECORD = (recordId) => `${BASE_URL}api/medical-record/${recordId}`;
export const UPDATE_MEDICAL_RECORD = (id) => `${BASE_URL}api/medical-record/${id}`;

export const GET_MEDICAL_RECORD_HISTORY_USER = `${BASE_URL}api/medical-record/history/me`;
export const GET_MEDICAL_RECORD_USER = (recordId) => `${BASE_URL}api/medical-record/me/${recordId}`;

export const DOCTOR_LIST_PATIENT = `${BASE_URL}api/patient/me`;

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
export const GET_LAB_TEST_SESSION = (sessionId) => `${BASE_URL}api/session/${sessionId}/lab-test-results`;
export const GET_LAB_TEST_FOLLOW = (sessionId) => `${BASE_URL}api/session/${sessionId}/lab-test-results`;

export const SEARCH_GROUPED_LAB_TEST_RESULT = `${BASE_URL}api/lab-test-result/grouped`;
export const GET_GROUPED_DETAILS = `${BASE_URL}api/lab-test-result/grouped/details`;

//Ultrasound - Mangement
export const INIT_ULTRASOUND_FORM = `${BASE_URL}api/init-ultrasounds`;
export const UPDATE_ULTRASOUND = (id) => `${BASE_URL}api/ultrasounds/${id}`;
export const DELETE_ULTRASOUND = (id) => `${BASE_URL}api/ultrasounds/${id}`;
export const ULTRASOUND_IMAGE = (id) => `${BASE_URL}api/ultrasounds/images/${id}`;

export const FOLLOW_UP_ULTRASOUND = (sessionId) => `${BASE_URL}api/treatment-sessions/${sessionId}/follow-up-ultrasound`;
export const GET_FOLLOW_UP_ULTRASOUND = (sessionId) => `${BASE_URL}api/session/${sessionId}/ultrasound`;

//Treatment - Plan
export const GET_TREATMENT_PLAN = (medicalRecordId) => `${BASE_URL}api/medical-record/${medicalRecordId}/treatment-plan`;
export const CREATE_TREATMENT_PLAN = `${BASE_URL}api/medical-record/treatment-plan`;
export const UPDATE_TREATMENT_PLAN = (planId) => `${BASE_URL}api/medical-record/treatment-plan/${planId}`;
export const GET_TREATMENT_SESSION = (progressId) => `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions`;
export const UPDATE_STAGE_PROGRESS = (stageId) => `${BASE_URL}api/medical-record/treatment-stage-progress/${stageId}`;

export const GET_AVAILABLE_DATES = `${BASE_URL}api/schedules/my-available-dates`;
export const GET_SLOTS_BY_DATE = `${BASE_URL}api/schedules/available-slots-by-date`;
export const CREATE_TREATMENT_SESSION = (progressId) => `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions`;
export const GET_SESSION_DETAIL = (sessionId) => `${BASE_URL}api/treatment-sessions/${sessionId}/follow-up-details`;
export const UPDATE_SESSION = (sessionId) => `${BASE_URL}api/treatment-sessions/${sessionId}`;
export const UPDATE_TREATMENT_SESSION = (progressId, sessionId) =>
  `${BASE_URL}api/treatment-stage-progress/${progressId}/treatment-sessions/${sessionId}`;
export const GET_TREATMENT_SESSION_RESULT = (sessionId) => `${BASE_URL}api/treatment-sessions/${sessionId}`;

export const TREATMENT_PLAN_UPDATE = (planId) => `${BASE_URL}api/medical-record/treatment-plan/${planId}`

//Schedule-Management
export const CREATE_SCHEDULE = `${BASE_URL}api/schedules`;
export const CREATE_SCHEDULE_TEMPLATE = `${BASE_URL}api/schedule-template`;
export const UPDATE_SCHEDULE_TEMPLATE = (id) => `${BASE_URL}api/schedule-template?id=${id}`;
export const GET_ALL_SCHEDULE_TEMPLATE = `${BASE_URL}api/schedule-template`;

//Consultation - Management
export const CONSULTATION_FORM = `${BASE_URL}api/consultation`;

//Prescription - Management
export const GET_PRESCRIPTION = (sessionId) => `${BASE_URL}api/prescription/${sessionId}`;
export const CREATE_PRESCRIPTION = `${BASE_URL}api/prescription`;
export const GET_ALL_MEDICATIONS = `${BASE_URL}api/medications`;
export const UPDATE_PRESCRIPTION = (id) => `${BASE_URL}api/prescription/${id}`;

//NotificationContext
export const GET_NOTI = `${BASE_URL}api/notifications`;
export const READ_NOTI = `${BASE_URL}api/notifications/mark-read`;

//Account - Management
export const GET_STAFF_ACC = `${BASE_URL}api/staff/direct-patients`;
export const CREATE_STAFF_ACC = `${BASE_URL}api/staff/direct-patients`;
export const GET_ALL_ACCOUNT = `${BASE_URL}api/accounts/manage`;
export const ADMIN_CREATE_ACC = `${BASE_URL}api/accounts/manage/create`;

// Doctor-Management
export const GET_DOCTORS_IN_HOME = `${BASE_URL}api/home/doctors`;
export const GET_DOCTOR_BY_ID = (id) => `${BASE_URL}api/doctors/${id}`;
export const GET_DOCTOR_BY_EMAIL = (email) => `${BASE_URL}api/manage/doctors/details?email=${email}`;
export const UPDATE_DOCTOR = (id) => `${BASE_URL}api/manage/doctors/details/${id}`;
export const CREATE_DOCTOR = `${BASE_URL}api/manage/doctors/details`;
export const GET_DOCTOR_DETAIL_BY_ID = (id) => `${BASE_URL}api/doctors/${id}`;