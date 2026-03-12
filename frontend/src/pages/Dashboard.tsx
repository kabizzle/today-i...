import { useState, useEffect } from 'react';
import { BarChart, Activity, Zap, Award, Target, Brain } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
        try {
            const res = await api.get('/dashboard/');
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchDashboard();
  }, []);

  if (isLoading) return <div className="p-12 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!data) return <div className="p-12 text-center">Failed to load dashboard. Ensure backend is running.</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-base-content tracking-tight">Welcome Back</h1>
          <p className="text-base-content/70 mt-2 text-lg">Here is your progress and insights for today.</p>
        </div>
        <Link to="/entry/new" className="btn btn-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
          <Zap className="w-5 h-5 mr-1" />
          Log Today's Entry
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-200/50 hover:shadow-md transition-shadow">
          <div className="stat-figure text-primary">
            <Activity className="w-8 h-8" />
          </div>
          <div className="stat-title text-base-content/70 font-medium">Total Entries</div>
          <div className="stat-value text-primary text-4xl">{data.total_entries}</div>
          <div className="stat-desc font-semibold text-success mt-1">Keep logging!</div>
        </div>
        
        <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-200/50 hover:shadow-md transition-shadow">
          <div className="stat-figure text-secondary">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title text-base-content/70 font-medium">Skills Tracked</div>
          <div className="stat-value text-secondary text-4xl">{data.total_skills}</div>
          <div className="stat-desc font-medium mt-1">Growing every day</div>
        </div>

        <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-200/50 hover:shadow-md transition-shadow">
          <div className="stat-figure text-accent">
            <BarChart className="w-8 h-8" />
          </div>
          <div className="stat-title text-base-content/70 font-medium">Current Streak</div>
          <div className="stat-value text-accent text-4xl">{data.current_streak} Days</div>
          <div className="stat-desc font-medium mt-1 text-base-content/60">Awesome momentum!</div>
        </div>

        <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-200/50 outline outline-2 outline-warning/20 bg-warning/5 overflow-hidden relative" onClick={() => navigate('/assess')}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-warning/20 rounded-full blur-2xl"></div>
          <div className="stat-figure text-warning relative z-10">
            <Zap className="w-8 h-8" />
          </div>
          <div className="stat-title text-base-content/70 font-bold relative z-10 cursor-pointer hover:underline" onClick={() => navigate('/assess')}>Needs Review</div>
          <div className="stat-value text-warning text-2xl mt-1 relative z-10 line-clamp-1">
            {data.skills_needing_review.length > 0 ? data.skills_needing_review[0].name : "None"}
          </div>
          <div className="stat-desc mt-2 relative z-10">
            <button className="btn btn-warning btn-xs rounded-full px-4 shadow-sm" onClick={() => navigate('/assess')}>Assess Now</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Entries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Entries</h2>
          </div>
          
          <div className="space-y-4">
            {data.recent_entries.map((entry: any) => (
              <div key={entry.id} className="card bg-base-100 shadow-sm border border-base-200/50 hover:shadow-md transition-shadow cursor-pointer">
                <div className="card-body p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-lg line-clamp-1">{entry.content.substring(0, 40)}...</h3>
                    <span className="text-xs font-semibold text-base-content/60 bg-base-200 px-2 py-1 rounded-md">
                        {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-base-content/80 text-sm line-clamp-2">
                    {entry.content}
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {entry.skills && entry.skills.map((s: string, idx: number) => (
                        <span key={idx} className="badge badge-primary badge-outline badge-sm font-medium">{s}</span>
                    ))}
                    {(!entry.skills || entry.skills.length === 0) && (
                        <span className="text-xs text-base-content/40">No skills mapped</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {data.recent_entries.length === 0 && (
                <div className="card bg-base-50 border border-base-200 border-dashed text-center p-8 text-base-content/50">
                    No entries yet. Click "Log Today's Entry" to start tracking!
                </div>
            )}
          </div>
        </div>

        {/* Top Skills */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Skills</h2>
          <div className="card bg-base-100 shadow-sm border border-base-200/50">
            <div className="card-body p-0">
              <ul className="menu bg-base-100 rounded-box p-2 text-base-content">
                {data.top_skills.map((skill: any, idx: number) => (
                <li key={skill.id}>
                  <a className="flex justify-between hover:bg-base-200 rounded-lg py-3">
                    <span className="font-medium flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${['bg-primary', 'bg-secondary', 'bg-accent'][idx % 3]}`}></div>
                      {skill.name}
                    </span>
                    <span className="text-xs font-bold text-base-content/60 bg-base-200 px-2 py-1 rounded">{skill.occurrences} Mentions</span>
                  </a>
                </li>
                ))}
                {data.top_skills.length === 0 && (
                    <div className="p-4 text-center text-sm text-base-content/50">No skills identified yet.</div>
                )}
              </ul>
              <div className="p-4 pt-0">
                <Link to="/skills" className="btn btn-outline btn-sm w-full font-medium mt-2">Explore All Skills</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-base-100 rounded-3xl p-8 shadow-sm border border-base-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Target className="w-6 h-6 text-warning" />
            Skills Needing Review
          </h2>
          <button onClick={() => navigate('/assess')} className="btn btn-sm btn-outline btn-warning">Assess All</button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
            {data.skills_needing_review.map((skill: any) => (
                <div key={skill.id} className="card bg-warning/5 border border-warning/20 hover:border-warning/50 transition-colors cursor-pointer" onClick={() => navigate('/assess', { state: { skill } })}>
                <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-base-content">{skill.name}</h3>
                    <div className="badge badge-warning text-xs">Needs Review</div>
                    </div>
                    <p className="text-base-content/70 text-sm mb-4 line-clamp-2">{skill.description}</p>
                    <div className="w-full bg-base-300 rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: `${skill.degradation_level}%` }}></div>
                    </div>
                </div>
                </div>
            ))}
            
            {data.skills_needing_review.length === 0 && (
                <div className="card border border-base-200 border-dashed bg-base-50 flex flex-col items-center justify-center p-8 text-center text-base-content/50 md:col-span-2">
                    <Brain className="w-8 h-8 mb-2 opacity-30" />
                    <p>No skills currently need review. You're fully caught up!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
