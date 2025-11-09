import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import '../MainLayout.css';


const MainLayout = () => {
    return(
        <div className='main-layout'>
            <Sidebar/>
            <main className='main-content'>
                <Outlet/>
            </main>
        </div>
    );
};

export default MainLayout;
