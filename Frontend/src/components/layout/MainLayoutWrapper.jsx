import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const MainLayoutWrapper = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export default MainLayoutWrapper;
