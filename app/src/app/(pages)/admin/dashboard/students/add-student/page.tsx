import DynamicBreadcrumb from "@/app/component/DynamicBreadCrumb/DynamicBreadCrumb";
import StudentRegistrationForm from "./components/StudentRegistrationForm";

export default function AddStudent() {
  return (
    <div className="px-3">
      <div className="py-5">
        <DynamicBreadcrumb
          items={[
            { label: "Home", href: "/dashboard/admin" },
            { label: "Student Add User", href: "/dashboard/Students/add-user" },
          ]}
        />
      </div>
      <div>
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
