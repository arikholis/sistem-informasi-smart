import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { User, UserRole, StudentGrade, ClassSchedule } from './types';
import { STUDENT_GRADES, SCHEDULE } from './constants';
import { fetchUsersFromSheet } from './services/sheetService';
import { GeminiChat } from './components/GeminiChat';
import { 
  LayoutDashboard, Users, LogOut, Bell, Search, Menu, GraduationCap,
  Settings, Lock, User as UserIcon, Loader2, AlertTriangle
} from 'lucide-react';
import { 
  AdminDashboard, PrincipalDashboard, VicePrincipalDashboard, 
  TeacherDashboard, StudentDashboard 
} from './components/RoleDashboards';

// --- Login Component ---
const LoginScreen = ({ onLogin, users, isLoading, error: propError }: { onLogin: (user: User) => void, users: User[], isLoading: boolean, error?: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const isDatabaseReady = users.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Sistem Informasi<br/>SMART Ekselensia</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        {propError && (
           <div className="mb-6 bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 flex items-start gap-3">
             <AlertTriangle className="shrink-0 mt-0.5" size={18} />
             <div>
               <p className="font-semibold">Database Connection Error</p>
               <p className="text-xs mt-1 opacity-90">{propError}</p>
             </div>
           </div>
        )}

        {!isDatabaseReady && !isLoading && !propError && (
           <div className="mb-6 bg-amber-50 text-amber-700 text-sm p-4 rounded-xl border border-amber-100 flex items-start gap-3">
             <AlertTriangle className="shrink-0 mt-0.5" size={18} />
             <div>
               <p className="font-semibold">No Users Found</p>
               <p className="text-xs mt-1 opacity-90">The spreadsheet database appears to be empty.</p>
             </div>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
              {loginError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading || !isDatabaseReady}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={isLoading ? "Loading database..." : "Enter your username"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !isDatabaseReady}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isDatabaseReady}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-200 disabled:shadow-none transition-all duration-200 transform hover:-translate-y-0.5 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-500 mb-2">Database Status</p>
          {isLoading ? (
             <p className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={12} /> Connecting to Spreadsheet...</p>
          ) : isDatabaseReady ? (
             <p className="text-emerald-600 flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Online ({users.length} users loaded)
             </p>
          ) : (
            <p className="text-red-500 flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Offline / Empty
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Layout Components ---
const Sidebar = ({ user, onLogout, mobileMenuOpen, setMobileMenuOpen }: { user: User, onLogout: () => void, mobileMenuOpen: boolean, setMobileMenuOpen: (v: boolean) => void }) => {
    const roleLinks = {
        [UserRole.ADMIN]: [
            { icon: LayoutDashboard, label: 'Dashboard' },
            { icon: Users, label: 'User Management' },
            { icon: Settings, label: 'System Config' },
        ],
        [UserRole.PRINCIPAL]: [
            { icon: LayoutDashboard, label: 'Overview' },
            { icon: Users, label: 'Staff' },
            { icon: GraduationCap, label: 'Academics' },
        ],
        [UserRole.VICE_PRINCIPAL]: [
            { icon: LayoutDashboard, label: 'Dashboard' },
            { icon: Settings, label: 'Logistics' },
            { icon: Bell, label: 'Events' },
        ],
        [UserRole.TEACHER]: [
            { icon: LayoutDashboard, label: 'Classes' },
            { icon: Users, label: 'Students' },
            { icon: Settings, label: 'Resources' },
        ],
        [UserRole.STUDENT]: [
            { icon: LayoutDashboard, label: 'My Dashboard' },
            { icon: GraduationCap, label: 'Grades' },
            { icon: Bell, label: 'Notices' },
        ]
    };

    const links = roleLinks[user.role] || [];

    return (
        <>
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}
            
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-30 flex flex-col
                transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-emerald-600 min-w-[32px] h-8 rounded-lg flex items-center justify-center shadow-sm">
                        <GraduationCap className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-800 leading-tight">SMART<br/>Ekselensia</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link, idx) => (
                        <button key={idx} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                            <link.icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-700">
            <Menu size={24} />
        </button>

        <div className="flex-1 px-6 max-w-2xl hidden md:block">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
        </div>
    </header>
);

// --- Main Application Logic ---
interface AppContentProps {
    user: User;
    users: User[];
    onLogout: () => void;
    onAddUser: (u: Partial<User>) => void;
    onUpdateUser: (u: Partial<User>) => void;
    onDeleteUser: (id: string) => void;
    studentData: { grades: StudentGrade[], schedule: ClassSchedule[] };
}

const AppContent = ({ user, users, onLogout, onAddUser, onUpdateUser, onDeleteUser, studentData }: AppContentProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const renderDashboard = () => {
        switch (user.role) {
            case UserRole.ADMIN: 
                return <AdminDashboard 
                  users={users} 
                  onAddUser={onAddUser}
                  onUpdateUser={onUpdateUser}
                  onDeleteUser={onDeleteUser}
                />;
            case UserRole.PRINCIPAL: return <PrincipalDashboard users={users} />;
            case UserRole.VICE_PRINCIPAL: return <VicePrincipalDashboard />;
            case UserRole.TEACHER: return <TeacherDashboard currentUser={user} users={users} />;
            case UserRole.STUDENT: return <StudentDashboard grades={studentData.grades} schedule={studentData.schedule} />;
            default: return <div>Role not recognized</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar 
                user={user} 
                onLogout={onLogout} 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen} 
            />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
                
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {user.role === UserRole.STUDENT ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Dashboard Overview'}
                            </h2>
                            <p className="text-slate-500">Sistem Informasi SMART Ekselensia Indonesia.</p>
                        </div>
                        
                        {renderDashboard()}
                    </div>
                </main>
            </div>

            {/* AI Integration */}
            <GeminiChat 
                userRole={user.role} 
                contextData={`User Name: ${user.name}. Role: ${user.role}. Subject: ${user.subject || 'N/A'}. Grade: ${user.grade || 'N/A'}. School: SMART Ekselensia Indonesia.`} 
            />
        </div>
    );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetError, setSheetError] = useState('');
  
  // State for dynamic dashboard data (mapped to real users)
  const [studentData, setStudentData] = useState<{ grades: StudentGrade[], schedule: ClassSchedule[] }>({
    grades: [],
    schedule: []
  });

  // Initialize users from Google Sheets
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const sheetUsers = await fetchUsersFromSheet();
        if (sheetUsers.length > 0) {
          setUsers(sheetUsers);
          setSheetError('');
        } else {
          setUsers([]);
          setSheetError('No users found in Spreadsheet or sheet is private. Please check the Google Sheet permissions.');
        }
      } catch (e) {
        console.error(e);
        setUsers([]);
        setSheetError('Failed to connect to Spreadsheet database.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // DYNAMICALLY CREATE STUDENT DATA FROM REAL TEACHERS
  // This ensures that the subject and teacher name match EXACTLY what is in the database
  useEffect(() => {
    const teachers = users.filter(u => u.role === UserRole.TEACHER);
    
    if (teachers.length > 0) {
        // Generate Grades based on available teachers
        const dynamicGrades: StudentGrade[] = teachers.map((t) => ({
            subject: t.subject || 'Mata Pelajaran Umum', // Use exact subject from DB
            score: 80 + Math.floor(Math.random() * 15), // Demo score
            teacher: t.name // Use exact teacher name from DB
        }));

        // Generate Schedule based on available teachers
        const dynamicSchedule: ClassSchedule[] = teachers.map((t, index) => {
             const hour = 8 + (index % 6);
             return {
                time: `${hour}:00 - ${hour + 1}:30`,
                subject: t.subject || 'Mata Pelajaran Umum',
                room: `Ruang ${101 + index}`,
                teacher: t.name
             };
        });

        setStudentData({ grades: dynamicGrades, schedule: dynamicSchedule });
    } else {
        // Fallback if no teachers exist in DB yet
        setStudentData({ grades: STUDENT_GRADES, schedule: SCHEDULE });
    }
  }, [users]);

  // CRUD Handlers (Local State Only with helper for manual sync)
  const handleAddUser = (newUser: Partial<User>) => {
    const userToAdd: User = {
      id: Date.now().toString(),
      name: newUser.name || 'New User',
      role: newUser.role || UserRole.STUDENT,
      email: newUser.email || '',
      username: newUser.username || `user${Date.now()}`,
      password: newUser.password || '123456',
      subject: newUser.subject || '',
      grade: newUser.grade || '',
      avatar: newUser.avatar || `https://picsum.photos/200/200?random=${Date.now()}`
    };
    setUsers([...users, userToAdd]);

    // Create CSV line for user convenience
    const csvLine = `${userToAdd.username},${userToAdd.password},${userToAdd.name},${userToAdd.role},,${userToAdd.subject},${userToAdd.grade}`;
    alert(`User added locally!\n\nTo save to Google Sheets, COPY this line and PASTE it into your spreadsheet:\n\n${csvLine}\n\n(Note: Last values are Col F: Subject, Col G: Grade)`);
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } as User : u));
    
    // Create CSV line for user convenience
    const csvLine = `${updatedUser.username},${updatedUser.password},${updatedUser.name},${updatedUser.role},,${updatedUser.subject},${updatedUser.grade}`;
    alert(`User updated locally.\n\nPlease manually update the row in Google Sheets:\n\n${csvLine}`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    alert("User deleted locally. Please remove the row from your Google Sheet manually.");
  };

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} users={users} isLoading={loading} error={sheetError} />;
  }

  return (
    <Router>
      <AppContent 
        user={currentUser} 
        users={users}
        onLogout={() => setCurrentUser(null)} 
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        studentData={studentData}
      />
    </Router>
  );
};

export default App;