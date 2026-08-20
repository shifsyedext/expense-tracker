import {
  Alert,
  Button,
  Card,
  Input,
  Typography,
} from 'antd';
import {
  Formik,
  Form as FormikForm,
  type FormikHelpers,
} from 'formik';
import { Link } from 'react-router';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import type { ForgotPasswordRequest } from '../../types/auth';
import './ForgotPassword.css';

const { Title, Paragraph, Text } = Typography;

const validationSchema: Yup.ObjectSchema<ForgotPasswordRequest> =
  Yup.object({
    email: Yup.string()
      .trim()
      .email('Please enter a valid email address.')
      .required('Email is required.'),
  });

interface FormStatus {
  readonly type: 'success' | 'error';
  readonly message: string;
}

const ForgotPassword = (): React.JSX.Element => {
  const { forgotPassword } = useAuth();

  const initialValues: ForgotPasswordRequest = {
    email: '',
  };

  const handleSubmit = async (
    values: ForgotPasswordRequest,
    helpers: FormikHelpers<ForgotPasswordRequest>,
  ): Promise<void> => {
    helpers.setStatus(undefined);

    try {
      await forgotPassword({
        email: values.email.trim(),
      });

      helpers.setStatus({
        type: 'success',
        message:
          'If an account exists for this email, password reset instructions have been sent.',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to process your request. Please try again.';

      const status: FormStatus = {
        type: 'error',
        message,
      };

      helpers.setStatus(status);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-page__container">
        <Card className="forgot-password-page__card">
          <div className="forgot-password-page__header">
            <Text className="forgot-password-page__eyebrow">
              EXPENSE TRACKER
            </Text>

            <Title
              level={1}
              className="forgot-password-page__title"
            >
              Forgot your password?
            </Title>

            <Paragraph className="forgot-password-page__description">
              Enter your email address and we'll help you
              get back into your account.
            </Paragraph>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              status,
              handleChange,
              handleBlur,
            }) => (
              <>
                {status?.type === 'error' && (
                  <Alert
                    className="forgot-password-page__alert"
                    type="error"
                    showIcon
                    message={status.message}
                    role="alert"
                  />
                )}

                {status?.type === 'success' && (
                  <Alert
                    className="forgot-password-page__alert"
                    type="success"
                    showIcon
                    message={status.message}
                    role="status"
                  />
                )}

                <FormikForm
                  className="forgot-password-page__form"
                  noValidate
                >
                  <div className="forgot-password-page__field">
                    <label
                      htmlFor="forgot-password-email"
                      className="forgot-password-page__label"
                    >
                      Email address
                    </label>

                    <Input
                      id="forgot-password-email"
                      name="email"
                      type="email"
                      size="large"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      value={values.email}
                      status={
                        touched.email && errors.email
                          ? 'error'
                          : undefined
                      }
                      aria-invalid={
                        touched.email && errors.email
                          ? 'true'
                          : 'false'
                      }
                      aria-describedby={
                        touched.email && errors.email
                          ? 'forgot-password-email-error'
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {touched.email && errors.email && (
                      <Text
                        id="forgot-password-email-error"
                        type="danger"
                        className="forgot-password-page__error"
                      >
                        {errors.email}
                      </Text>
                    )}
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="forgot-password-page__submit"
                  >
                    Send Reset Instructions
                  </Button>
                </FormikForm>

                <div className="forgot-password-page__login">
                  <Link to="/login">
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
};

export default ForgotPassword;