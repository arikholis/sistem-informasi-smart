import React, { useState } from 'react';
import { User, UserRole, StudentGrade, ClassSchedule } from '../types';
import { 
  Users, Settings, FileText, Calendar, Award, TrendingUp, 
  BookOpen, UserCheck, AlertCircle, Plus, Edit2, Trash2, X, Save
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- Mock Data for Charts ---
const ATTENDANCE_DATA = [
  { name: 'Mon', present: 95, absent: 5 },
  { name: 'Tue', present: 92, absent: 8 },
  { name: 'Wed', present: 98, absent: 2 },
  { name: 'Thu', present: 94, absent: 6 },
  { name: 'Fri', present: 90, absent: 10 },
];

const GRADE_DISTRIBUTION = [
  { name: 'A', value: 30 },
  { name: 'B', value: 45 },
  { name: 'C', value: 15 },
  { name: 'D', value: 8 },
  { name: 'F', value: 2 },
];

const COLORS = ['#4F46E5', '#818CF8', '#C7D2FE', '#FCD34D', '#F87171'];

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

// --- Admin CRUD Components ---

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Partial<User>) => void;
    editingUser?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, editingUser }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        username: '',
        password: '',
        role: UserRole.STUDENT,
        subject: '',
        grade: '',
        avatar: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 1000)
    });

    React.useEffect(() => {
        if (editingUser) {
            setFormData(editingUser);
        } else {
            setFormData({
                name: '',
                email: '',
                username: '',
                password: '',
                role: UserRole.STUDENT,
                subject: '',
                grade: '',
                avatar: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 1000)
            });
        }
    }, [editingUser, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
                    <h3 className="font-bold text-slate-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input 
                                type="text" 
                                value={formData.username} 
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                value={formData.password || ''} 
                                placeholder={editingUser ? '(Unchanged)' : ''}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {Object.values(UserRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                           {/* Empty filler to keep grid structure */}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subject / Grade (Col F)</label>
                            <input 
                                type="text" 
                                value={formData.subject || ''} 
                                placeholder="Mapel / Subject"
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Grade (Col G)</label>
                            <input 
                                type="text" 
                                value={formData.grade || ''} 
                                placeholder="Kelas / Grade"
                                onChange={e => setFormData({...formData, grade: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
                    <button 
                        onClick={() => onSave(formData)} 
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2"
                    >
                        <Save size={16} /> Save User
                    </button>
                </div>
            </div>
        </div>
    );
};

// 1. ADMIN DASHBOARD
interface AdminDashboardProps {
    users: User[];
    onAddUser: (user: Partial<User>) => void;
    onUpdateUser: (user: Partial<User>) => void;
    onDeleteUser: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
      setEditingUser(user);
      setIsModalOpen(true);
  };

  const handleAddClick = () => {
      setEditingUser(null);
      setIsModalOpen(true);
  };

  const handleSave = (data: Partial<User>) => {
      if (editingUser) {
          onUpdateUser({ ...editingUser, ...data });
      } else {
          onAddUser(data);
      }
      setIsModalOpen(false);
  };

  // SORT USERS: ADMIN -> PRINCIPAL -> VICE -> TEACHER -> STUDENT
  const rolePriority = {
    [UserRole.ADMIN]: 0,
    [UserRole.PRINCIPAL]: 1,
    [UserRole.VICE_PRINCIPAL]: 2,
    [UserRole.TEACHER]: 3,
    [UserRole.STUDENT]: 4
  };

  const sortedUsers = [...users].sort((a, b) => {
      const prioA = rolePriority[a.role] ?? 99;
      const prioB = rolePriority[b.role] ?? 99;
      return prioA - prioB;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={users.length.toString()} icon={Users} color="bg-blue-600" />
        <StatCard title="System Uptime" value="99.9%" icon={Settings} color="bg-green-600" />
        <StatCard title="Audit Logs" value="45 New" icon={FileText} color="bg-purple-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">User Management</h3>
            <button 
                onClick={handleAddClick}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors"
            >
                <Plus size={16} /> Add User
            </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm bg-slate-50">
                <th className="px-4 py-3 rounded-tl-lg">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Subject / Grade (Col F)</th>
                <th className="px-4 py-3">Grade (Col G)</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {sortedUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                          <div>
                              <p className="font-medium text-slate-800">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                      </div>
                  </td>
                  <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 
                          u.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-700' : 
                          u.role === UserRole.STUDENT ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}
                      `}>
                          {u.role}
                      </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.username}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{u.subject || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{u.grade || '-'}</td>
                  <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => handleEditClick(u)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors" 
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => {
                                if(confirm(`Are you sure you want to delete ${u.name}?`)) onDeleteUser(u.id)
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors" 
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <UserFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          editingUser={editingUser}
      />
    </div>
  );
};

// 2. PRINCIPAL DASHBOARD
interface PrincipalDashboardProps {
    users: User[];
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ users }) => {
    const totalStudents = users.filter(u => u.role === UserRole.STUDENT).length;
    const totalTeachers = users.filter(u => u.role === UserRole.TEACHER).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Students" value={totalStudents.toString()} icon={Users} color="bg-indigo-600" />
            <StatCard title="Total Teachers" value={totalTeachers.toString()} icon={UserCheck} color="bg-pink-600" />
            <StatCard title="Avg Attendance" value="94%" icon={Calendar} color="bg-emerald-600" />
            <StatCard title="School Perf." value="A-" icon={Award} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Attendance Trends (Weekly)</h3>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="present" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Academic Performance Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={GRADE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {GRADE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>
    );
};

// 3. VICE PRINCIPAL DASHBOARD (Focus on Logistics)
export const VicePrincipalDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Upcoming Events" value="3" icon={Calendar} color="bg-orange-500" />
      <StatCard title="Discipline Reports" value="2" icon={AlertCircle} color="bg-red-500" />
      <StatCard title="Facilities" value="All Clear" icon={Settings} color="bg-teal-600" />
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Event Schedule Management</h3>
      <div className="space-y-3">
        {['Science Fair Setup - Hall A', 'Parent Teacher Meeting - Block B', 'Fire Drill - Campus Wide'].map((event, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-medium text-slate-700">{event}</span>
            <div className="flex gap-2">
               <button className="text-xs bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-100">Reschedule</button>
               <button className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 4. TEACHER DASHBOARD
interface TeacherDashboardProps {
    currentUser: User;
    users: User[]; // Pass all users to filter students
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, users }) => {
  // Filter students, matching grade if possible
  const myStudents = users.filter(u => {
    if (u.role !== UserRole.STUDENT) return false;
    if (currentUser.grade) {
      // If teacher has a grade assigned (e.g. "7"), show students with same grade
      // Normalize strings for comparison
      return u.grade?.trim().toLowerCase() === currentUser.grade.trim().toLowerCase();
    }
    // If teacher has no grade, show all students
    return true;
  });

  return (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Classes Today" value="4" icon={BookOpen} color="bg-emerald-600" />
      <StatCard title="Students Present" value={`${Math.floor(myStudents.length * 0.9)}/${myStudents.length}`} icon={UserCheck} color="bg-green-600" />
      <StatCard title="Assignments Due" value="2" icon={FileText} color="bg-yellow-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    {currentUser.subject ? `Mapel: ${currentUser.subject}` : 'My Classes'}
                    {currentUser.grade && (
                        <span className="text-sm font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {currentUser.grade}
                        </span>
                    )}
                </h3>
                <p className="text-xs text-slate-500">Teacher: {currentUser.name}</p>
            </div>
            <button className="text-sm text-emerald-600 font-medium">+ Add Grade</button>
        </div>
        
        {myStudents.length > 0 ? (
            <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-2">Username / ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Mid-Term</th>
                <th className="pb-2">Finals (Proj)</th>
                <th className="pb-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {myStudents.map(student => (
                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 font-mono text-slate-500">#{student.username}</td>
                    <td className="py-3 font-medium">{student.name}</td>
                    <td className="py-3">85</td>
                    <td className="py-3"><input className="w-16 border rounded px-2 py-1" placeholder="-" /></td>
                    <td className="py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Passing</span></td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-lg">
                <p>No students found.</p>
                {currentUser.grade && <p className="text-xs mt-1">Searching for students in Grade: {currentUser.grade}</p>}
            </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Quick Actions</h3>
        <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-3">
                <Calendar size={18} /> Mark Attendance
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-3">
                <FileText size={18} /> Create Assignment
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-3">
                <AlertCircle size={18} /> Report Incident
            </button>
        </div>
      </div>
    </div>
  </div>
  );
};

// 5. STUDENT DASHBOARD
export const StudentDashboard: React.FC<{ grades: StudentGrade[], schedule: ClassSchedule[] }> = ({ grades, schedule }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Schedule */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-emerald-600" /> Today's Schedule
            </h3>
            <div className="space-y-4">
                {schedule.length > 0 ? (
                    schedule.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="min-w-[100px] font-mono text-sm text-slate-500 pt-1">{item.time}</div>
                            <div>
                                <h4 className="font-bold text-slate-800">{item.subject}</h4>
                                <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">{item.room}</span>
                                    <span>{item.teacher}</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-500 italic p-4">No schedule data available.</div>
                )}
            </div>
        </div>

        {/* Grades Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" /> Recent Grades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {grades.length > 0 ? (
                    grades.map((g, i) => (
                        <div key={i} className="p-4 rounded-lg border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-10 ${g.score >= 90 ? 'bg-green-500' : g.score >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold truncate" title={g.subject}>{g.subject}</p>
                                <p className="text-3xl font-bold text-slate-800 mt-1">{g.score}</p>
                            </div>
                            <p className="text-xs text-slate-400 truncate" title={g.teacher}>{g.teacher}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-500 italic">No grades recorded.</div>
                )}
            </div>
        </div>
      </div>

      {/* Announcements Widget */}
      <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 border-b border-emerald-500 pb-2">Notice Board</h3>
        <div className="space-y-4">
            <div className="bg-emerald-700/50 p-3 rounded-lg">
                <span className="text-xs bg-red-400 text-white px-1.5 py-0.5 rounded font-bold">URGENT</span>
                <p className="text-sm font-medium mt-1">Final Exams start Dec 15th</p>
                <p className="text-xs text-emerald-200 mt-1">Principal Office</p>
            </div>
            <div className="bg-emerald-700/50 p-3 rounded-lg">
                <span className="text-xs bg-teal-400 text-white px-1.5 py-0.5 rounded font-bold">EVENT</span>
                <p className="text-sm font-medium mt-1">Science Fair Registration Open</p>
            </div>
        </div>
      </div>
    </div>
  </div>
);