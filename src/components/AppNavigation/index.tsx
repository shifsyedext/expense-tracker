import {
  Button,
  Layout,
  Menu,
  Typography,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppNavigation.css';

const { Header } = Layout;
const { Text } = Typography;

const AppNavigation = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: 'Transactions',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  const handleMenuClick = ({
    key,
  }: {
    readonly key: string;
  }): void => {
    navigate(key);
  };

  return (
    <Header className="app-navigation">
      <div className="app-navigation__brand">
        <Text className="app-navigation__brand-text">
          Expense Tracker
        </Text>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="app-navigation__menu"
      />

      <div className="app-navigation__user">
        <Text className="app-navigation__user-name">
          {user?.firstName}
        </Text>

        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          aria-label="Sign out"
          className="app-navigation__logout"
        >
          Sign Out
        </Button>
      </div>
    </Header>
  );
};

export default AppNavigation;