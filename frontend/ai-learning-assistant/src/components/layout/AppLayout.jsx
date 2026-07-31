import React,{useState} from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout=({children})=>{
 const [isSidebarOpen,setIsSidebarOpen]=useState(false);

 const toggleSidebar=()=>{
  setIsSidebarOpen(!isSidebarOpen);
 };

 return(
  <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">

   <Sidebar
    isSidebarOpen={isSidebarOpen}
    toggleSidebar={toggleSidebar}
   />

   <div className="flex-1 flex flex-col overflow-hidden">

    <Header toggleSidebar={toggleSidebar}/>

    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
     {children}
    </main>

   </div>

  </div>
 );
};

export default AppLayout;