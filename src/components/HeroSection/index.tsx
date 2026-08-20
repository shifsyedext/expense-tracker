import { Button, Col, Row, Space, Typography } from 'antd';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const HeroSection = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__container">
        <Row
          align="middle"
          gutter={[32, 48]}
        >
          <Col xs={24} lg={16}>
            <div className="hero-section__content">
              <Text className="hero-section__eyebrow">
                SIMPLE. SMART. ORGANIZED.
              </Text>

              <Title
                id="hero-title"
                level={1}
                className="hero-section__title"
              >
                Take control of your money, one expense at a time.
              </Title>

              <Paragraph className="hero-section__description">
                Track your spending, understand your habits, and stay
                organized with a simple and intuitive expense tracker
                designed for everyday life.
              </Paragraph>

              <Space
                size="middle"
                wrap
                className="hero-section__actions"
              >
                <Button
                  type="primary"
                  size="large"
                  className="hero-section__primary-action"
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Get Started
                </Button>

                <Button
                  size="large"
                  className="hero-section__secondary-action"
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Sign In
                </Button>
              </Space>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div
              className="hero-section__visual"
              aria-hidden="true"
            >
              <div className="hero-section__visual-card">
                <div className="hero-section__visual-line" />
                <div className="hero-section__visual-line" />
                <div className="hero-section__visual-line" />
                <div className="hero-section__visual-line" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HeroSection;