import { createRoutesFromElements, Route } from 'react-router-dom';
import ErrorPage from './components/common/ErrorPage';
import Index from './pages';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgetPassword from './pages/auth/forget-password';
import ProtectedRoute from './components/protectedRoute';
import RefreshTokenProvider from './components/refreshTokenProvider';
import Layout from './components/layout/layout';
import ResetPassword from './pages/auth/reset-password';
const routesConfig = createRoutesFromElements(
  <Route path="/" element={<Layout></Layout>} errorElement={<ErrorPage />}>
    <Route element={<RefreshTokenProvider />}>
      <Route index element={<Index></Index>}></Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Index></Index>}></Route>
      </Route>
    </Route>
    <Route path="/auth/login" element={<Login></Login>}></Route>
    <Route path="/auth/register" element={<Register></Register>}></Route>
    <Route
      path="/auth/forget-password"
      element={<ForgetPassword></ForgetPassword>}
    ></Route>
    <Route
      path="/auth/reset-password"
      element={<ResetPassword></ResetPassword>}
    ></Route>
    <Route path="*" element={<ErrorPage />}></Route>
  </Route>,
);
export default routesConfig;
