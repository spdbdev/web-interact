import ProjectsList from "../pages/list-views/ProjectsList";
import UsersList from "../pages/list-views/UsersList";

const listViewRoutes = [
    {
        path: "/list-views/projects",
        element: <ProjectsList/>
    },
    {
        path: "/list-views/users",
        element: <UsersList/>,
    },
];
export default listViewRoutes;
