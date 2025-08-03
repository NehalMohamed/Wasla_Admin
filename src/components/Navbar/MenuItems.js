export const menuItems = {
  Admin: [
    // { path: "/dashboard", title: "Dashboard", icon: "FiHome" },
    { path: "/home", title: "home", icon: "FiHome" },
    { path: "/users", title: "Users", icon: "FiUsers" },
    { path: "/questions", title: "Questions", icon: "FiHelpCircle" },
    { path: "/features", title: "Features", icon: "FiLayers" },
    { path: "/services", title: "Services", icon: "FiSettings" },
    { path: "/packages", title: "Packages", icon: "IoLogoFirebase" },
    { path: "/pricing", title: "Pricing", icon: "FiDollarSign" },
    { path: "/invoices", title: "Invoices", icon: "FaFileInvoice" },
  ],
  accountant: [{ path: "/invoices", title: "Invoices", icon: "FaFileInvoice" }],
};

export const allMenuItems = [
  {
    id: "users",
    title: "Users",
    icon: "FiUsers",
    path: "/users",
    roles: ["Admin", "manager"],
  },
  {
    id: "questions",
    title: "Questions",
    icon: "FiHelpCircle",
    path: "/questions",
    roles: ["Admin", "manager", "editor"],
  },
  {
    id: "features",
    title: "Features",
    icon: "FiLayers",
    path: "/features",
    roles: ["Admin", "manager", "sales"],
  },
  {
    id: "services",
    title: "Services",
    icon: "FiSettings",
    path: "/services",
    roles: ["Admin", "manager"],
  },
  {
    id: "packages",
    title: "Packages",
    icon: "IoLogoFirebase",
    path: "/packages",
    roles: ["Admin"],
  },
  {
    id: "pricing",
    title: "Pricing",
    icon: "FiDollarSign",
    path: "/pricing",
    roles: ["Admin", "accountant", "manager"],
  },
  {
    id: "invoices",
    title: "Invoices",
    icon: "FaFileInvoice",
    path: "/invoices",
    roles: ["Admin", "manager", "accountant"],
  },
];
