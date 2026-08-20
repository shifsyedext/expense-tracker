import { Button, Typography } from 'antd';
import './CallToAction.css';

const { Title, Paragraph } = Typography;

const CallToAction = (): React.JSX.Element => {
  return (
    <section
      className="call-to-action"
      aria-labelledby="call-to-action-title"
    >
      <div className="call-to-action__container">
        <div className="call-to-action__content">
          <Title
            id="call-to-action-title"
            level={2}
            className="call-to-action__title"
          >
            Ready to take control of your expenses?
          </Title>

          <Paragraph className="call-to-action__description">
            Start organizing your expenses and build better financial
            habits with Expense Tracker.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            className="call-to-action__button"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;