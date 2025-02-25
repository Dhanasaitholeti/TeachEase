export const AdminMenu = [
  {
    title: "Dashboard",
    icon: "Layout",
    link: "/admin/dashboard",
  },
  {
    title: "Teachers",
    icon: "GraduationCap",
    submenu: [
      {
        title: "View Teachers",
        link: "/admin/dashboard/teachers/view-teachers",
      },
      { title: "Add Teachers", link: "/admin/dashboard/teachers/add-teacher" },
    ],
  },
  {
    title: "Students",
    icon: "Users",
    submenu: [
      {
        title: "View Students",
        link: "/admin/dashboard/students/view-students/classes",
      },
      {
        title: "Add Students",
        link: "/admin/dashboard/students/add-student",
      },
    ],
  },
  {
    title: "Classes",
    icon: "ClipboardX",
    submenu: [
      {
        title: "Class Management",
        link: "/admin/dashboard/classes/class-management",
      },
      {
        title: "Add Subject",
        link: "/admin/dashboard/classes/add-subject",
      },
    ],
  },
  {
    title: "Assignments",
    icon: "ClipboardX",
    submenu: [
      {
        title: "Generate Question Paper",
        link: "/admin/dashboard/assignment/generate-question-paper",
      },
    ],
  },
  {
    title: "Add Reminder",
    icon: "Layout",
    link: "/admin/dashboard/to-do",
  },
];

export const teacherMenu = [
  {
    title: "Dashboard",
    icon: "Layout",
    link: "/teacher/dashboard",
  },
  {
    title: "Take Attendance",
    icon: "Layout",
    link: "/teacher/dashboard/student-attendance",
  },
  {
    title: "Students",
    icon: "Users",
    submenu: [
      {
        title: "View Students",
        link: "/teacher/dashboard/students/view-students/classes",
      },
    ],
  },
  {
    title: "Assignments",
    icon: "ClipboardX",
    submenu: [
      {
        title: "Generate Question Paper",
        link: "/teacher/dashboard/upload-question",
      },
      {
        title: "Syllabus Planner",
        link: "/teacher/dashboard/syllabus-planner",
      },
    ],
  },
  {
    title: "Test Management",
    icon: "ClipboardX",
    submenu: [
      {
        title: "View Marks",
        link: "/teacher/dashboard/test/view-marks",
      },
      {
        title: "Add Marks", 
        link: "/teacher/dashboard/test/add-marks",
      },
    ],
  },
  {
    title: "Class  Performance",
    icon: "Layout",
    link: "/teacher/dashboard/class-performance",
  },
  {
    title: "Add Reminder",
    icon: "Layout",
    link: "/teacher/dashboard/to-do",
  },
];
