import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthContext, useAuthState } from './hooks/useAuth'
import { ToastProvider } from './components/admin/ui/Toast'
import { AdminShell } from './components/admin/layout/AdminShell'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { LeadsPage } from './pages/LeadsPage'
import { LeadDetailPage } from './pages/LeadDetailPage'
import { FollowUpsPage } from './pages/FollowUpsPage'
import { PostsPage } from './pages/PostsPage'
import { PostEditorPage } from './pages/PostEditorPage'
import {
  ContentPage,
  HeroContentPage,
  AboutContentPage,
  SkillsContentPage,
  ServicesContentPage,
  CaseStudiesContentPage,
  PostsContentPage,
  TestimonialsContentPage,
  PricingContentPage,
} from './pages/ContentPages'
import { SettingsPage } from './pages/SettingsPage'
import { AccountPage } from './pages/AccountPage'

function App() {
  const authState = useAuthState()

  return (
    <AuthContext.Provider value={authState}>
      <ToastProvider>
        <Routes>
          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin protected */}
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/new" element={<PostEditorPage />} />
            <Route path="posts/:id/edit" element={<PostEditorPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="content/hero" element={<HeroContentPage />} />
            <Route path="content/about" element={<AboutContentPage />} />
            <Route path="content/skills" element={<SkillsContentPage />} />
            <Route path="content/services" element={<ServicesContentPage />} />
            <Route path="content/case-studies" element={<CaseStudiesContentPage />} />
            <Route path="content/posts" element={<PostsContentPage />} />
            <Route path="content/testimonials" element={<TestimonialsContentPage />} />
            <Route path="content/pricing" element={<PricingContentPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ToastProvider>
    </AuthContext.Provider>
  )
}

export default App
