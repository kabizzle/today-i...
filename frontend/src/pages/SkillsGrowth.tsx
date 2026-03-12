import { Target, TrendingUp, Award, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

const SkillsGrowth = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills/');
        setSkills(res.data);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleGenerateResume = () => {
    alert("Generating AI resume bullets for your top skills...\n\n- Spearheaded frontend architecture using React Components, achieving an 85% proficiency rating.\n- Designed scalable APIs with FastAPI Routing, rated at a 92% mastery level.\n- Architected high-performance MongoDB schemas to enhance database efficiency.");
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(skills, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "today-i-skills.json");
    dlAnchorElem.click();
  };

  const handleCopyMarkdown = () => {
    const md = `# My Skills Profile\n\n${skills.map(s => `- **${s.name}** (${s.category}): Level ${s.level}/100`).join('\n')}`;
    navigator.clipboard.writeText(md).then(() => {
      alert("Markdown summary copied to clipboard!");
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-base-content tracking-tight">Skills & Growth</h1>
          <p className="text-base-content/70 mt-2 text-lg">Track your career progression and capabilities over time.</p>
        </div>
        <div className="hidden sm:flex bg-primary/10 text-primary p-4 rounded-2xl items-center gap-3 shadow-inner">
            <Award className="w-8 h-8" />
            <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Current Level</p>
                <p className="text-xl font-black">Senior Developer Readiness: 75%</p>
            </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Skill Capability Matrix
              </h2>
              
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>
                ) : skills.length === 0 ? (
                  <div className="text-center p-8 text-base-content/50">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No skills tracked yet. Start journaling to extract insights!</p>
                  </div>
                ) : (
                  skills.map((skill: any) => (
                    <div key={skill.id} className="group cursor-pointer hover:bg-base-200/50 p-2 -mx-2 rounded-xl transition-colors">
                      <div className="flex justify-between items-end mb-2 px-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-base-200 rounded-lg text-base-content/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <Brain className="w-5 h-5" />
                          </div>
                          <div>
                              <span className="font-bold text-lg">{skill.name}</span>
                              <p className="text-xs text-base-content/50">Tracked {skill.occurrences} time(s)</p>
                          </div>
                        </div>
                        <span className="font-bold text-primary">{skill.degradation_level}/100</span>
                      </div>
                      <progress 
                          className={`progress w-full h-3 group-hover:opacity-100 opacity-80 transition-opacity ${skill.degradation_level < 50 ? 'progress-error' : skill.degradation_level < 80 ? 'progress-warning' : 'progress-primary'}`} 
                          value={skill.degradation_level} 
                          max="100"
                      ></progress>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
                <div className="card-body">
                    <h3 className="card-title text-xl mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        AI Career Insight
                    </h3>
                    <p className="opacity-90 leading-relaxed text-sm">
                        Based on your recent entries tackling Python concurrency and MongoDB optimization, you are showing strong progression towards Backend Architecture. Consider focusing your next few projects on distributed systems to complete this skill cluster.
                    </p>
                    <div className="card-actions justify-end mt-4">
                        <button onClick={handleGenerateResume} className="btn btn-sm btn-ghost bg-white/20 hover:bg-white/30 border-none text-white">Generate Resume Bullets</button>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Export Capabilities</h3>
                    <p className="text-sm text-base-content/70 mb-4">
                        Your skills are ready to be utilized for performance reviews, interviews, or LinkedIn updates.
                    </p>
                    <div className="space-y-2 w-full">
                        <button onClick={handleDownloadJSON} className="btn btn-outline justify-start w-full gap-2">
                            Download JSON Profile
                        </button>
                        <button onClick={handleCopyMarkdown} className="btn btn-outline justify-start w-full gap-2">
                            Copy Markdown Summary
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGrowth;
