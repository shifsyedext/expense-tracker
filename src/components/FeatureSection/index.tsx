import { Card, Col, Row, Typography } from 'antd';
import { features } from '../../stubs/features';
import './FeatureSection.css';

const { Title, Paragraph, Text } = Typography;

const FeatureSection = (): React.JSX.Element => {
  return (
    <section
      className="feature-section"
      aria-labelledby="feature-section-title"
    >
      <div className="feature-section__container">
        <div className="feature-section__heading">
          <Text className="feature-section__eyebrow">
            EVERYTHING YOU NEED
          </Text>

          <Title
            id="feature-section-title"
            level={2}
            className="feature-section__title"
          >
            Make managing expenses simpler.
          </Title>

          <Paragraph className="feature-section__description">
            Expense Tracker gives you a simple way to stay aware of your
            spending without making money management complicated.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((feature) => (
            <Col
              key={feature.title}
              xs={24}
              md={8}
            >
              <Card className="feature-section__card">
                <div
                  className="feature-section__icon"
                  aria-hidden="true"
                >
                  ✓
                </div>

                <Title
                  level={3}
                  className="feature-section__card-title"
                >
                  {feature.title}
                </Title>

                <Paragraph className="feature-section__card-description">
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeatureSection;