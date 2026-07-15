import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from './routes';
const router = createBrowserRouter(routesConfig);

function App() {
  console.log('from app');
  return <RouterProvider router={router} />;
}
export default App;
