
const ROUTES = {
  HOME: '/',
  STAFF: '/nhan-vien',
  DOCTOR: '/bac-si',
  MANAGER: '/quan-ly',
  ADMIN: '/admin',
  USER: '/ho-so-ca-nhan',


  // login - register
  LOGIN: '/dang-nhap',
  REGISTER: '/dang-ky',
  REGISTER_CONFIRM_EMAIL: '/xac-nhan-email',
  FORGOT_PASSWORD: '/quen-mat-khau',
  RESET_PASSWORD: '/cap-nhat-mat-khau',

  // service - management
  SERVICE_MANAGE: 'quan-ly-phuong-phap',
  LIST_SERVICE_HOME: '/danh-sach-phuong-phap-home', //test
  LIST_SERVICE: '/danh-sach-phuong-phap',
  CREATE_SERVICE: '/tao-moi-phuong-phap',
  EDIT_SERVICE: '/chinh-sua-phuong-phap',
  CREATE_SERVICE_DETAILS: '/tao-moi-chi-tiet-phuong-phap',
  SERVICE_DETAIL_PAGE: (id) => `/chi-tiet-phuong-phap/${id}`,

  // blog - management
  DOCTOR_BLOG_MANAGER: 'goc-chia-se-cua-toi',
  CREATE_BLOG: '/tao-moi-bai-viet',
  LIST_BLOG_MANA: 'quan-ly-goc-chia-se',
  BLOG_LIST: '/goc-chia-se',

  // appointment -management
  DOCTOR_APPOINTMENT_MANAGER: 'quan-ly-lich-hen',
  BOOKING_FORM: 'dat-lich-kham',
  PAYMENT_RESULT: '/payment-result',
  STAFF_APPOINTMENT_LIST: 'danh-sach-lich-kham',
  USER_APPOINTMENT_LIST: 'danh-sach-lich-kham-cua-toi',

  //medical-record-management
  GET_MEDICAL_RECORD_HISTORY: (accountId) => `/ho-so-benh-nhan/${accountId}`,
  MEDICAL_RECORD_DETAIL: `/chi-tiet-ho-so/:recordId`,
  MEDICAL_RECORD_DETAIL_VIEW: `/ho-so-ca-nhan/lich-su-benh-an/chi-tiet-ho-so/:recordId`,
  MEDICAL_RECORD_HISTORY_VIEW: `lich-su-benh-an`,
  DOCTOR_LIST_PATIENT: `danh-sach-benh-nhan`,

  //lab-test-management
  LAB_TEST_RESULT_LIST: `quan-ly-ket-qua-xet-nghiem`,

  // schedule-management
  CREATE_SCHEDULE: `/tao-lich-lam-viec`,
  SCHEDULE_TEMPLATE_LIST: `mau-lich-lam-viec`,
  SCHEDULE_TEMPLATE_FORM_MODAL: `/tao-mau-lich-lam-viec`,

  // consultation - management
  CONSULTATION_FORM: `/don-tu-van-kham`,

  //Account - management
  DIRECT_PATIENT_MANA: `quan-ly-tai-khoan-nguoi-dung-truc-tiep`,
  PROFILE_VIEW: `thong-tin-ca-nhan`,
  ADMIN_MANA_ACC: `quan-ly-tai-khoan`,

};

export default ROUTES;
