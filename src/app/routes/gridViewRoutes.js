import UsersList from "../pages/grid-views/UsersList";
import ProjectsList from "../pages/grid-views/ProjectsList";

const gridViewRoutes = [
    {
        path: "/grid-views/users",
        element: <UsersList/>,
    },
    {
        path: "/grid-views/projects",
        element: <ProjectsList/>
    }
];
export default gridViewRoutes;
