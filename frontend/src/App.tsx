import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Layout from './components/layout/layout';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgetPassword from './pages/auth/forget-password';
import Index from './pages';
import ResetPassword from './pages/auth/reset-password';
import ErrorPage from './components/common/ErrorPage';
import ProtectedRoute from './components/protectedRoute';
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout></Layout>} errorElement={<ErrorPage />}>
      <Route index element={<Index></Index>}></Route>
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
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Index></Index>}></Route>
      </Route>
      <Route path="*" element={<ErrorPage />}></Route>
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
