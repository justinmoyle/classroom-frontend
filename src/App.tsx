import { Refine } from '@refinedev/core';
import { DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { Authenticated } from '@refinedev/core';
import routerProvider, {
  DocumentTitleHandler, NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import './App.css';
import { Toaster } from './components/refine-ui/notification/toaster';
import { useNotificationProvider } from './components/refine-ui/notification/use-notification-provider';
import { ThemeProvider } from './components/refine-ui/theme/theme-provider';
import { dataProvider } from './providers/data.ts';
import Dashboard from '@/pages/dashboard.tsx';
import {
  BookOpen,
  GraduationCap,
  Home,
  Building2,
  Users,
  ClipboardCheck,
} from 'lucide-react';
import { Layout } from '@/components/refine-ui/layout/layout.tsx';
import SubjectsList from '@/pages/subjects/list.tsx';
import SubjectsCreate from '@/pages/subjects/create.tsx';
import SubjectsShow from '@/pages/subjects/show.tsx';
import ClassesList from '@/pages/classes/list.tsx';
import ClassesCreate from '@/pages/classes/create.tsx';
import ClassesShow from '@/pages/classes/show.tsx';
import DepartmentsList from '@/pages/departments/list.tsx';
import DepartmentsCreate from '@/pages/departments/create.tsx';
import DepartmentShow from '@/pages/departments/show.tsx';
import FacultyList from '@/pages/faculty/list.tsx';
import FacultyShow from '@/pages/faculty/show.tsx';
import ProfilePage from '@/pages/profile/index.tsx';
import EnrollmentsCreate from '@/pages/enrollments/create.tsx';
import EnrollmentsJoin from '@/pages/enrollments/join.tsx';
import EnrollmentConfirm from '@/pages/enrollments/confirm.tsx';
import { Login } from '@/pages/login';
import { Register } from '@/pages/register';
import { authProvider } from '@/providers/auth.ts';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: 'Kw1Sss-RlGDFX-NRVISq',
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: { label: 'Home', icon: <Home /> },
                },
                {
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  show: '/subjects/show/:id',
                  meta: { label: 'Subjects', icon: <BookOpen /> },
                },
                {
                  name: 'departments',
                  list: '/departments',
                  create: '/departments/create',
                  show: '/departments/show/:id',
                  meta: { label: 'Departments', icon: <Building2 /> },
                },
                {
                  name: 'users',
                  list: '/faculty',
                  show: '/faculty/show/:id',
                  meta: {
                    label: 'Faculty',
                    icon: <Users />,
                  },
                },
                {
                  name: 'enrollments',
                  list: '/enrollments/create',
                  create: '/enrollments/create',
                  meta: { label: 'Enrollments', icon: <ClipboardCheck /> },
                },
                {
                  name: 'classes',
                  list: '/classes',
                  create: '/classes/create',
                  show: '/classes/show/:id',
                  meta: { label: 'Classes', icon: <GraduationCap /> },
                },
              ]}
            >
              <Routes>
                <Route
                  element=
                  {
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route
                  element={
                  <Authenticated key="private-routes" fallback={<Login/>}>
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                  }
                >
                  <Route path="/" element={<Dashboard />} />
                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>
                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="show/:id" element={<DepartmentShow />} />
                  </Route>
                  <Route path="faculty">
                    <Route index element={<FacultyList />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="enrollments">
                    <Route path="create" element={<EnrollmentsCreate />} />
                    <Route path="join" element={<EnrollmentsJoin />} />
                    <Route path="confirm" element={<EnrollmentConfirm />} />
                  </Route>
                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
