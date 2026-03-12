import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, TrendingUp, User, Home, PlusCircle } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'New Entry', path: '/entry/new', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Skills & Growth', path: '/skills', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="drawer lg:drawer-open h-screen bg-base-200">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        {/* Navbar for mobile */}
        <div className="w-full navbar bg-base-100 lg:hidden shadow-sm shrink-0">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-lg text-primary">Today I...</div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full block">
          <div className="max-w-6xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div> 
      
      {/* Sidebar */}
      <div className="drawer-side shrink-0 z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-72 h-full bg-base-100 text-base-content border-r border-base-200">
          <div className="flex items-center gap-2 px-4 mb-6 mt-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Today I
            </span>
          </div>
          <div className="divider mt-0"></div>
          
          <div className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center gap-3 p-3 text-base rounded-xl transition-all duration-200 ${isActive ? 'bg-primary text-primary-content shadow-md font-medium' : 'hover:bg-base-200 hover:scale-[1.02]'}`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </div>

          <div className="mt-auto">
            <div className="divider"></div>
            <button className="btn btn-outline btn-error w-full">Logout</button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Layout;
