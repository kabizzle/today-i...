import { useState, useEffect } from 'react';
import { User, Mail, Calendar, LogOut, Settings, Award } from 'lucide-react';
import api from '../api';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        // Fallback mock
        setUser({ name: "Kabir", email: "kabir@example.com", joined: "October 2026" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) return <div className="p-12 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-base-content tracking-tight">Your Profile</h1>
        <p className="text-base-content/70 mt-2 text-lg">Manage your account and settings</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body items-center text-center p-8">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <div className="bg-primary/10 text-primary flex items-center justify-center w-full h-full text-5xl font-bold uppercase">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </div>
              </div>
              <h2 className="card-title text-2xl font-bold">{user?.name}</h2>
              <div className="flex items-center gap-2 text-base-content/60 mt-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/60 mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {user?.joined}</span>
              </div>
              
              <div className="divider w-full my-4"></div>
              
              <button className="btn btn-outline btn-error w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                Account Settings
              </h3>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-medium">Display Name</span>
                </label>
                <input type="text" placeholder="Your Name" className="input input-bordered w-full" defaultValue={user?.name} />
              </div>

              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input type="email" placeholder="email@example.com" className="input input-bordered w-full" defaultValue={user?.email} readOnly disabled />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6 cursor-pointer">
                <Award className="w-5 h-5 text-secondary" />
                Preferences
              </h3>
              
              <div className="form-control mb-2">
                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  <span className="label-text font-medium text-base">Receive Daily Reminders</span>
                </label>
              </div>
              <div className="form-control mb-2">
                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
                  <span className="label-text font-medium text-base">AI Feedback & Insights</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
