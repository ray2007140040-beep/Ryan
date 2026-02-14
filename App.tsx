
import React, { useState, useCallback } from 'react';
import { User, PlannedItem, Klass } from './types';
import Header from './components/Header';
import LoginView from './views/LoginView';
import ProfileView from './views/ProfileView';
import StudentDashboard from './views/StudentDashboard';
import CoachView from './views/CoachView';
import CoachOngoingView from './views/CoachOngoingView';
import StudentView from './views/StudentView'; // Feedback form
import AdminView from './views/AdminView';
import HonorReport from './views/HonorReport';
import LessonPlanReview from './views/LessonPlanReview';
import BottomNav from './components/BottomNav';
import { TECH_PACK_LIBRARY } from './constants';

const INITIAL_CLASSES: Klass[] = [
  { id: 'k1', name: '泰拳进阶 L2 班', startTime: '18:30', endTime: '19:45', startDate: '2024-01-01', endDate: '2024-12-31', days: [1, 3, 5], student_count: 12, level_tag: 'Intermediate' },
  { id: 'k2', name: '踢拳核心 L1 班', startTime: '19:45', endTime: '21:00', startDate: '2024-01-01', endDate: '2024-12-31', days: [2, 4, 6], student_count: 8, level_tag: 'Basic' },
  { id: 'k3', name: '综合格斗实战班', startTime: '21:00', endTime: '22:15', startDate: '2024-01-01', endDate: '2024-12-31', days: [1, 2, 3, 4, 5, 6, 0], student_count: 6, level_tag: 'Advanced' },
];

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'profile'>('home');

  // Business Data State
  const [klasses, setKlasses] = useState<Klass[]>(INITIAL_CLASSES);
  const [selectedKlass, setSelectedKlass] = useState<Klass | null>(null);
  const [activePlan, setActivePlan] = useState<PlannedItem[]>([]);
  const [savedPlans, setSavedPlans] = useState<Record<string, PlannedItem[]>>({});
  const [completedKlassIds, setCompletedKlassIds] = useState<string[]>([]);
  
  // Workflow State
  const [lessonStatus, setLessonStatus] = useState<'none' | 'planning' | 'reviewing' | 'ongoing' | 'completed'>('none');
  const [showReport, setShowReport] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]); // For Honor Report
  const [deviations, setDeviations] = useState<Array<{ id: string; coach: string; student: string; pack: string; time: string }>>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  // --- Handlers ---

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentTab('home');
    // Reset workflow states on new login
    setLessonStatus('none');
    setShowReport(false);
    setSelectedKlass(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleGeneratePlan = useCallback((plan: PlannedItem[]) => {
    if (plan.length === 0) return;
    setActivePlan(plan);
    setLessonStatus('reviewing');
  }, []);

  const handleFinalConfirm = useCallback(() => {
    if (selectedKlass) {
      const key = `${selectedKlass.id}_${todayStr}`;
      setSavedPlans(prev => ({ ...prev, [key]: activePlan }));
    }
    setLessonStatus('ongoing');
  }, [selectedKlass, activePlan, todayStr]);

  const handleExecuteExisting = useCallback((plan: PlannedItem[]) => {
    setActivePlan(plan);
    setLessonStatus('ongoing');
  }, []);

  const handleSaveDailyPlan = useCallback(() => {
    if (selectedKlass) {
      const key = `${selectedKlass.id}_${todayStr}`;
      setSavedPlans(prev => ({ ...prev, [key]: activePlan }));
    }
  }, [activePlan, selectedKlass, todayStr]);

  const handleReturnToClass = useCallback(() => {
    setLessonStatus('none');
  }, []);

  const handleEndLesson = useCallback((finalPlan: PlannedItem[]) => {
    // Coach ends lesson
    setActivePlan(finalPlan);
    if (selectedKlass) {
      setCompletedKlassIds(prev => [...prev, selectedKlass.id]);
    }
    setLessonStatus('completed');
    // In real app, this would notify students. 
    // For now, we stay on coach view or go back to schedule.
    setLessonStatus('none');
    setSelectedKlass(null);
  }, [selectedKlass]);

  // Student selects a class from dashboard
  const handleStudentSelectClass = (klassId: string, status: 'pending' | 'completed') => {
    // Mock: load a plan associated with this class
    // In real app, fetch from backend. Here we mock a simple plan.
    const mockPlan: PlannedItem[] = [
      { pack_id: TECH_PACK_LIBRARY[0].id, level: 'l1', frequency: '3', reps: '10', duration: 10 },
      { pack_id: TECH_PACK_LIBRARY[1].id, level: 'l1', frequency: '3', reps: '10', duration: 10 }
    ];
    setActivePlan(mockPlan);

    if (status === 'pending') {
      setLessonStatus('ongoing'); // Re-using ongoing state to show feedback form
    } else {
      // Show report directly
      setConfirmedIds([TECH_PACK_LIBRARY[0].id, TECH_PACK_LIBRARY[1].id]);
      setShowReport(true);
    }
  };

  const handleStudentCompleteFeedback = useCallback((actualIds: string[], isDeviation: boolean, feedback: { intensity: number, experience: number }) => {
    setConfirmedIds(actualIds);
    setLessonStatus('completed');
    setShowReport(true);
    
    console.debug('Received Feedback:', feedback);

    if (isDeviation) {
      // In real app, user info comes from auth context
      const studentName = currentUser?.name || 'Unknown Student';
      
      const plannedIds = activePlan.map(p => p.pack_id);
      const deviationPackIds = plannedIds.filter(id => !actualIds.includes(id));
      
      const newDeviations = deviationPackIds.map(id => {
        const pack = TECH_PACK_LIBRARY.find(tp => tp.id === id);
        return {
          id: `${Date.now()}-${id}`,
          coach: '麦克教练', // Mocked
          student: studentName,
          pack: pack?.title || '未知模块',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
      });
      
      setDeviations(prev => [...newDeviations, ...prev]);
    }
  }, [activePlan, currentUser]);


  // --- Render Logic ---

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // 1. Profile Tab
    if (currentTab === 'profile') {
      return (
        <ProfileView 
          user={currentUser} 
          onLogout={handleLogout} 
          onUpdateUser={handleUpdateUser} 
          klasses={klasses} // Pass klasses for Coach Schedule
        />
      );
    }

    // 2. Global Overlays (Report)
    if (showReport) {
      return (
        <HonorReport 
          actualIds={confirmedIds} 
          onBack={() => { setShowReport(false); setLessonStatus('none'); }} 
        />
      );
    }

    // 3. Role-based Home Logic
    switch (currentUser.role) {
      case 'admin':
        return (
          <>
            <Header title="控制中心" subtitle="COMMAND CENTER" />
            <AdminView 
              deviations={deviations} 
              klasses={klasses} 
              onUpdateKlasses={setKlasses}
            />
          </>
        );

      case 'coach':
        if (lessonStatus === 'reviewing') {
          return (
             <LessonPlanReview 
               plan={activePlan} 
               onConfirm={handleFinalConfirm} 
               onBack={() => setLessonStatus('none')}
               onSaveDailyPlan={handleSaveDailyPlan}
               onReturnToClass={handleReturnToClass}
             />
          );
        }
        if (lessonStatus === 'ongoing') {
          return (
            <>
              <Header title="授课中" className={selectedKlass?.name} subtitle="LIVE PROTOCOL" />
              <CoachOngoingView 
                plan={activePlan} 
                onEndLesson={handleEndLesson} 
                onBack={handleReturnToClass}
              />
            </>
          );
        }
        // Default Coach View (Schedule/Drafting)
        return (
          <>
            <Header 
              title={selectedKlass ? "教案编排" : "教学看板"} 
              className={selectedKlass?.name}
              subtitle="DRILL MASTER" 
            />
            <CoachView 
              onGeneratePlan={handleGeneratePlan} 
              onExecutePlan={handleExecuteExisting}
              selectedKlass={selectedKlass}
              onSelectKlass={setSelectedKlass}
              onBackToSchedule={() => setSelectedKlass(null)}
              savedPlans={savedPlans}
              completedKlassIds={completedKlassIds}
              klasses={klasses}
            />
          </>
        );

      case 'student':
        if (lessonStatus === 'ongoing') {
          // Re-using 'ongoing' state to indicate feedback form is active
          const simplifiedPlan = activePlan.map(p => ({ pack_id: p.pack_id, level: p.level, custom_title: p.custom_title }));
          return <StudentView plan={simplifiedPlan} onComplete={handleStudentCompleteFeedback} />;
        }
        // Default Student View (Dashboard)
        return (
          <>
             <Header title="我的课程" subtitle="MY TRAINING" />
             <StudentDashboard klasses={klasses} onSelectClass={handleStudentSelectClass} />
          </>
        );
        
      default:
        return <div>Unknown Role</div>;
    }
  };

  return (
    <div className="antialiased select-none bg-black min-h-screen">
      {renderContent()}
      
      {/* Hide BottomNav in full-screen modes like Report or Review to focus user attention */}
      {!showReport && lessonStatus !== 'reviewing' && (
        <BottomNav 
          currentTab={currentTab} 
          onSwitchTab={setCurrentTab} 
          role={currentUser.role}
        />
      )}
    </div>
  );
};

export default App;
