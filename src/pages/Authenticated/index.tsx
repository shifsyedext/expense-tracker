import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import './Authenticated.css';

const { Title, Paragraph } = Typography;

const Authenticated = (): React.JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <main className="authenticated-page">
      <section className="authenticated-page__content">
        <Title level={1}>
          Welcome, {user?.firstName}
        </Title>

        <Paragraph>
          Authentication is working successfully.
        </Paragraph>

        <Button
          type="primary"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </section>
    </main>
  );
};

export default Authenticated;