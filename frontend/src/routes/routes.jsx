import Chartes from "../pages/Chartes";
import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";
import Logout from "../pages/Logout"
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSportDetail from "../pages/admin/AdminSportDetail";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import AdminSports from "../pages/admin/AdminSports";
import UserDetailTeam from "../pages/user/UserDetailTeam";
import UserRegisterTeam from "../pages/user/UserRegisterTeam";
import UserPayment from "../pages/user/UserPayment";
import Profile from "../pages/common/Profile";
import AdminTeamDetail from "../pages/admin/AdminTeamDetail";
import SuperAdminParameters from "../pages/superAdmin/SuperAdminParameters";
import SuperAdminUser from "../pages/superAdmin/SuperAdminUser";
import Home from "../pages/vitrine/Home";
import Results from "../pages/vitrine/Results"
import Sponsor from "../pages/vitrine/Sponsor";

// Define user routes
const routesForUser = [
    {
        path: "/",
        element: <UserDashboard />,
        name: 'Accueil'
    },
    {
        path: "/register-team",
        element: <UserRegisterTeam />,
        name: 'Inscrire une équipe'
    },
    {
        path: "/team/:id",
        element: <UserDetailTeam />,
        name: 'Détail d équipe',
        hidden: true,
    },
    {
        path: "/payment",
        element: <UserPayment />,
        name: 'Paiement',
    },
    {
        path: "/logout",
        element: <Logout />,
        name: 'Déconnexion',
        hidden: true,
    },
]

// Define admin Route
const routesForAdmin = [
    {
        path: "/",
        element: <AdminDashboard />,
        name: 'Accueil',
    },
    {
        path: "/sport",
        element: <AdminSports />,
        name: 'Sports',
    },
    {
        path: "/sport/:id",
        element: <AdminSportDetail />,
        hidden: true,
    },
    {
        path: "/team/:id",
        element: <AdminTeamDetail />,
        hidden: true,
    },
    {
        path: "/logout",
        element: <Logout />,
        name: 'Déconnexion',
        hidden: true,
    },

]

// Define super admin route
const routesForSuperAdmin = [
    {
        path: "/",
        element: <SuperAdminDashboard />,
        name: 'Accueil',
    },
    {
        path: "/sport",
        element: <AdminSports />,
        name: 'Sports',
    },
    {
        path: "/sport/:id",
        element: <AdminSportDetail />,
        hidden: true,
    },
    {
        path: "/team/:id",
        element: <AdminTeamDetail />,
        hidden: true,
    },
    {
        path: '/users',
        element: <SuperAdminUser />,
        name: 'Utilisateurs',
    },
    {
        path: '/parameters',
        element: <SuperAdminParameters />,
        name: 'Paramètres',
    },
    {
        path: "/logout",
        element: <Logout />,
        hidden: true,
    },
]

// Define public routes accessible to all users
const routesForPublic = [
    {
        path: "/profile",
        element: <Profile />,
        hidden: true,
    },
    {
        path: "/about-us",
        element: <div>About Us</div>,
    },
    {
        path: "/charte",
        element: <Chartes />,
    },
];


const routesForNotAuthenticatedOnly = [
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/sponsor",
        element: <Sponsor/>,
    },
    {
        path: "/sign-in",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {

        path: "/results",
        element: <Results />,
    },

    {    path: "/login",
        element: <Login />,
    },
];


export { routesForUser, routesForAdmin, routesForSuperAdmin, routesForPublic, routesForNotAuthenticatedOnly }