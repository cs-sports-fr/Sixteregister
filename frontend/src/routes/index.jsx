import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoutes";
import { UserProtectedRoute } from "./UserProtectedRoute";
import { AdminProtectedRoute } from "./AdminProtectedRoute";
import { SuperAdminProtectedRoute } from "./SuperAdminProtectedRoutes";
import { routesForAdmin, routesForNotAuthenticatedOnly, routesForPublic, routesForSuperAdmin, routesForUser } from "./routes";
import NotFoundPage from "../pages/NotFound";


const Routes = () => {
    const { token, permission } = useAuth();

    console.log('Current permission:', permission);
    console.log('Current token:', token ? 'exists' : 'none');

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
            children: [
                permission == "UserStatus" && {
                    path: "/",
                    element: <UserProtectedRoute />,
                    children: routesForUser,
                },
                permission == "AdminStatus" && {
                    path: "/",
                    element: <AdminProtectedRoute />,
                    children: routesForAdmin
                },
                permission == "SuperAdminStatus" && {
                    path: "/",
                    element: <SuperAdminProtectedRoute />,
                    children: routesForSuperAdmin
                }

            ].filter(Boolean),
        },
    ];



    // Combine and conditionally include routes based on authentication status
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
        { path: "*", element: <NotFoundPage /> }

    ]);

    // Provide the router configuration using RouterProvider
    return <RouterProvider router={router} />;
};

export default Routes;
