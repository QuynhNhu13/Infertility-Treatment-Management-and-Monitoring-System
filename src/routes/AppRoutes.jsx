import React from "react";
import { Routes, Route } from "react-router-dom";
import ROUTES from "../routes/RoutePath";

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
import MedicalRecord from "../pages/medical-record-management/MedicalRecord";
import StaffDashboard from "../pages/StaffDashboard";
import ScheduleTemplateForm from "../pages/schedule-management/ScheduleTemplateForm";
import ScheduleGeneratorForm from "../pages/schedule-management/ScheduleGeneratorForm";
import LabTestResultList from "../pages/medical-record-management/LabTestResultList";
import LabTestResultForm from "../pages/medical-record-management/LabTestResultForm";
import MedicalRecordCreate from "../pages/medical-record-management/MedicalRecordCreate";
import TreatmentPlan from "../pages/medical-record-management/TreatmentPlan";


function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />

      <Route path={ROUTES.MANAGER} element={<ManagerDashboard />}>
        <Route path={ROUTES.SERVICE_MANAGE} element={<ServiceManage />} />
        <Route path={ROUTES.LIST_BLOG_MANA} element={<ListBlogMana />} />
      </Route>

      <Route path={ROUTES.DOCTOR} element={<DoctorDashboard />}>
        <Route path={ROUTES.DOCTOR_BLOG_MANAGER} element={<DoctorBlogManager />} />
        <Route path={ROUTES.DOCTOR_APPOINTMENT_MANAGER} element={<DoctorAppointmentManager />} />
      </Route>

      <Route path={ROUTES.STAFF} element={<StaffDashboard />} >
        <Route path={ROUTES.LAB_TEST_RESULT_LIST} element={<LabTestResultList />} />
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

      {/* Medical - Record */}
      <Route path="/ho-so-benh-nhan/:accountId" element={<MedicalRecord />} />
      <Route path="/ket-qua-xet-nghiem/:labTestId" element={<LabTestResultForm />} />
      <Route path="/ho-so-benh-nhan/:record.id/phac-do-dieu-tri" element={<TreatmentPlan />} />


      {/* Schedule - Management */}
      <Route path={ROUTES.SCHEDULE_TEMPLATE_FORM} element={<ScheduleTemplateForm />} />
      <Route path={ROUTES.SCHEDULE_GENERATOR_FORM} element={<ScheduleGeneratorForm />} />

    </Routes>
  );
}

export default AppRoutes;
