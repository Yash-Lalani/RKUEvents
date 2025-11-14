import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./components/EventDetails/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./UserDashboard/UserDashboard";
import AdminDashboard from "./Admin/SuperAdmin/AdminDashboard";
import AddEvent from "./Admin/SuperAdmin/AddEvent";
import AddEventDetails from "./Admin/SuperAdmin/AddEventDetails";
import AddDepartmentAdmin from "./Admin/SuperAdmin/AddDepartmentAdmin";
import DepartmentAdminDashboard from "./Admin/DepartmentAdmin/DepartmentAdminDashboard";
import DepAddEvent from "./Admin/DepartmentAdmin/DepAddEvent";
import DepAddEventDetails from "./Admin/DepartmentAdmin/DepAddEventDetails";
import EventRegisteredUsers from "./Admin/SuperAdmin/EventRegisteredUsers";
import ProfilePage from "./pages/ProfilePage";
import AdminLayout from "./pages/AdminLayout";
import EventsList from "./Admin/SuperAdmin/EventsList";
import EventDetailsList from "./Admin/SuperAdmin/EventDetailsList";
import EditEventDetails from "./Admin/SuperAdmin/EditEventDetails";

function AppWrapper() {
  const location = useLocation();

  // Hide Navbar on AdminDashboard
  // const hideNavbarRoutes = ["/super-admin"];
  const shouldHideNavbar =
    location.pathname.startsWith("/super-admin") ||
    location.pathname.startsWith("/department-admin") ||
    location.pathname.startsWith("/DepartmentAdmin");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />

        {/* SUPER ADMIN ROUTES */}
        <Route path="/super-admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="add-event-details" element={<AddEventDetails />} />
          <Route path="add-department-admin" element={<AddDepartmentAdmin />} />
          <Route path="events" element={<EventsList />} />
          <Route path="/super-admin/event-details" element={<EventDetailsList />} />
          <Route path="/super-admin/event-details-list" element={<EventDetailsList />} />
<Route path="/super-admin/event-details-edit/:id" element={<EditEventDetails />} />




          <Route
            path="event-registered-users"
            element={<EventRegisteredUsers />}
          />
        </Route>

        {/* DEPARTMENT ADMIN ROUTES */}
        <Route path="/department-admin" element={<AdminLayout />}>
          <Route index element={<DepartmentAdminDashboard />} />
          <Route path="department-add-event" element={<DepAddEvent />} />
          <Route
            path="department-add-event-details"
            element={<DepAddEventDetails />}
          />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
