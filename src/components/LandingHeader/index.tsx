import { Button, Layout, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';
import './LandingHeader.css';

const { Header } = Layout;
const { Title } = Typography;

const LandingHeader = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Header className="landing-header">
      <div className="landing-header__container">
        <Link
          to="/"
          className="landing-header__logo"
        >
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Expense Tracker
          </Title>
        </Link>

        <div className="landing-header__actions">
          <Button
            size="large"
            onClick={() => {
              navigate('/login');
            }}
          >
            Sign In
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={() => {
              navigate('/register');
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default LandingHeader;