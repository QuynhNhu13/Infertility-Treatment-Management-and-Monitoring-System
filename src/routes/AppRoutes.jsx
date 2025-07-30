import React from "react";
import { Routes, Route } from "react-router-dom";
import ROUTES from "../routes/RoutePath";
import { Navigate } from "react-router-dom";

import Home from "../pages/Home"
import LoginForm from "../pages/login-register/LoginForm";
import RegisterForm from "../pages/login-register/RegisterForm";
import ConfirmEmailPage from "../pages/login-register/ConfirmEmailPage";
import ForgotPassword from "../pages/login-register/ForgotPassword";
import ResetPassword from "../pages/login-register/ResetPassword";
import ListServiceHome from "../pages/service-management/ListServiceHome";
import ListService from "../pages/service-management/ListService";
import ServiceManage from "../pages/service-management/ServiceManage";
import ManagerDashboard from "../pages/ManagerDashboard";
import CreateService from "../pages/service-management/CreateService";
import EditService from "../pages/service-management/EditService";
import CreateServiceDetails from "../pages/service-management/CreateServiceDetails";
import ServiceDetailsPage from "../pages/service-management/ServiceDetailsPage";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorBlogManager from "../pages/blog-management/DoctorBlogManager";
import CreateBlog from "../pages/blog-management/CreateBlog";
import ListBlogMana from "../pages/blog-management/ListBlogMana";
import DoctorAppointmentManager from "../pages/appointment-management/DoctorAppointmentManager";
import StaffDashboard from "../pages/StaffDashboard";
import PublicBlogList from "../pages/blog-management/PublicBlogList";
import CreateSchedule from "../pages/schedule-management/CreateSchedule";
import ScheduleTemplateList from "../pages/schedule-management/ScheduleTemplateList";
import DatLichKhamBenh from "../pages/appointment-management/DatLichKhamBenh";
import PaymentResult from "../pages/appointment-management/PaymentResult";
import ScheduleTemplateFormModal from "../pages/schedule-management/ScheduleTemplateFormModal";
import ConsultationForm from "../pages/consultation-management/ConsultationForm";
import MedicalRecordHistory from "../pages/medical-record-management/MedicalRecordHistory";
import MedicalRecordDetail from "../pages/medical-record-management/MedicalRecordDetail";
import LabTestResultList from "../pages/lab-test-management/LabTestResultList";
import FollowUpDetail from "../pages/treatment-plan-management/FollowUpDetail";
import TreatmentSessionPage from "../pages/treatment-plan-management/TreatmentSessionPage";
import MedicalRecordDetailView from "../pages/medical-record-management/MedicalRecordDetailView";
import UserDashboard from "../pages/UserDashboard";
import MedicalRecordHistoryView from "../pages/medical-record-management/MedicalRecordHistoryView";
import TreatmentSessionPageView from "../pages/treatment-plan-management/TreatmentSessionPageView";
import NotificationPage from "../pages/NotificationPage";
import DirectPatientManager from "../pages/account-management/DirectPatientManager";
import StaffAppointmentList from "../pages/appointment-management/StaffAppointmentList";
import UserAppointmentList from "../pages/appointment-management/UserAppointmentList";
import DoctorListPatient from "../pages/medical-record-management/DoctorListPatient";
import ProfileView from "../pages/account-management/ProfileView";
import AdminDashboard from "../pages/AdminDashboard";
import AdminManageAcc from "../pages/account-management/AdminManageAcc";
import DoctorManager from "../pages/doctor-management/DoctorManager";
import DoctorList from "../pages/doctor-management/DoctorList";
import DoctorDetail from "../pages/doctor-management/DoctorDetail";
import AchievementPage from "../components/achievement/AchievementPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />

      <Route path={ROUTES.MANAGER} element={<ManagerDashboard />}>
        <Route path={ROUTES.SERVICE_MANAGE} element={<ServiceManage />} />
        <Route path={ROUTES.LIST_BLOG_MANA} element={<ListBlogMana />} />
        <Route path={ROUTES.SCHEDULE_TEMPLATE_LIST} element={<ScheduleTemplateList />} />
      </Route>

      <Route path={ROUTES.DOCTOR} element={<DoctorDashboard />}>
        <Route path={ROUTES.DOCTOR_BLOG_MANAGER} element={<DoctorBlogManager />} />
        <Route path={ROUTES.DOCTOR_APPOINTMENT_MANAGER} element={<DoctorAppointmentManager />} />
        <Route path={ROUTES.DOCTOR_LIST_PATIENT} element={<DoctorListPatient />} />
      </Route>

      <Route path={ROUTES.STAFF} element={<StaffDashboard />} >
        <Route path={ROUTES.LAB_TEST_RESULT_LIST} element={<LabTestResultList />} />
        <Route path={ROUTES.DIRECT_PATIENT_MANA} element={<DirectPatientManager />} />
        <Route path={ROUTES.STAFF_APPOINTMENT_LIST} element={<StaffAppointmentList />} />
      </Route>

      <Route path={ROUTES.USER} element={<UserDashboard />}>
        <Route index element={<Navigate to={ROUTES.PROFILE_VIEW} replace />} />
        <Route path={ROUTES.MEDICAL_RECORD_HISTORY_VIEW} element={<MedicalRecordHistoryView />} />
        <Route path={ROUTES.USER_APPOINTMENT_LIST} element={<UserAppointmentList />} />
        <Route path={ROUTES.PROFILE_VIEW} element={<ProfileView />} />
      </Route>

      <Route path={ROUTES.ADMIN} element={<AdminDashboard />}>
        <Route path={ROUTES.ADMIN_MANA_ACC} element={<AdminManageAcc />} />
      </Route>


      {/* Login - Register */}
      <Route path={ROUTES.LOGIN} element={<LoginForm />} />
      <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
      <Route path={ROUTES.REGISTER_CONFIRM_EMAIL} element={<ConfirmEmailPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

      {/* Service - Management */}
      <Route path={ROUTES.LIST_SERVICE_HOME} element={<ListServiceHome />} />
      <Route path={ROUTES.LIST_SERVICE} element={<ListService />} />
      <Route path={ROUTES.CREATE_SERVICE} element={<CreateService />} />
      <Route path={ROUTES.EDIT_SERVICE} element={<EditService />} />
      <Route path={ROUTES.CREATE_SERVICE_DETAILS} element={<CreateServiceDetails />} />
      <Route path="/chi-tiet-phuong-phap/:serviceId" element={<ServiceDetailsPage />} />

      {/* Blog - Management */}
      <Route path={ROUTES.CREATE_BLOG} element={<CreateBlog />} />
      <Route path={ROUTES.BLOG_LIST} element={<PublicBlogList />} />


      {/* Schedule - Management */}
      <Route path={ROUTES.CREATE_SCHEDULE} element={<CreateSchedule />} />
      <Route path={ROUTES.SCHEDULE_TEMPLATE_FORM_MODAL} element={<ScheduleTemplateFormModal />} />

      {/* Appointment - Management */}
      <Route path={ROUTES.BOOKING_FORM} element={<DatLichKhamBenh />} />
      <Route path={ROUTES.PAYMENT_RESULT} element={<PaymentResult />} />

      {/* Consultation - Management */}
      <Route path={ROUTES.CONSULTATION_FORM} element={<ConsultationForm />} />

      {/* MedicalRecord - Management */}
      <Route path="/ho-so-benh-nhan/:accountId" element={<MedicalRecordHistory />} />
      <Route path={ROUTES.MEDICAL_RECORD_DETAIL} element={<MedicalRecordDetail />} />
      <Route path="/ho-so-ca-nhan/lich-su-benh-an/chi-tiet-ho-so/:recordId" element={<MedicalRecordDetailView />} />

      {/* Treatment Plan - Management */}
      <Route path="/ho-so-benh-nhan/:recordId/tien-trinh-dieu-tri/:progressId/buoi-kham/:sessionId" element={<TreatmentSessionPage />} />
      <Route path="/ho-so-ca-nhan/:recordId/tien-trinh-dieu-tri/:progressId/buoi-kham/:sessionId" element={<TreatmentSessionPageView />} />

      <Route path="/thong-bao" element={<NotificationPage />} />

      {/* Doctor - Management */}
      <Route path={ROUTES.LIST_DOCTOR} element={<DoctorList />} />
      <Route path="/bac-si/:id" element={<DoctorDetail />} />

      {/* Achievement */}
      <Route path={ROUTES.ACHIEVEMENT_VIEW} element={<AchievementPage/>}/>
    </Routes>
  );
}

export default AppRoutes;
