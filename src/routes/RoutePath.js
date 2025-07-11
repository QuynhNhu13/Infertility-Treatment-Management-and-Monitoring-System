
const ROUTES = {
  HOME: '/',
  STAFF: '/nhan-vien',
  DOCTOR: '/bac-si', 
  MANAGER: '/quan-ly',
  ADMIN: '/admin',


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

  // appointment -management
  DOCTOR_APPOINTMENT_MANAGER: 'quan-ly-lich-hen', 

  // medical-record-management
  MEDICAL_RECORD: (accountId) => `/ho-so-benh-nhan/${accountId}`,
  LAB_TEST_RESULT_LIST: `quan-ly-ket-qua-xet-nghiem`,

  // schedule-management
  SCHEDULE_TEMPLATE_FORM: `/form-tao`, //test
  SCHEDULE_GENERATOR_FORM: `/form`,

};

export default ROUTES;
