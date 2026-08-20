import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;