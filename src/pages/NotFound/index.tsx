import {
  Button,
  Result,
} from 'antd';
import {
  ArrowLeftOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = (): React.JSX.Element => {
  const navigate = useNavigate();

  const handleGoDashboard = (): void => {
    navigate('/dashboard');
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  return (
    <main className="not-found-page">
      <Result
        status="404"
        title="Page not found"
        subTitle="Sorry, the page you are looking for does not exist."
        extra={[
          <Button
            key="dashboard"
            type="primary"
            icon={<HomeOutlined />}
            onClick={handleGoDashboard}
          >
            Go to Dashboard
          </Button>,

          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
          >
            Go Back
          </Button>,
        ]}
      />
    </main>
  );
};

export default NotFound;
