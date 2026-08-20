import {
  Alert,
  Button,
  Card,
  Input,
  Typography,
  message,
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

const validationSchema =
  Yup.object({
    email: Yup.string()
      .trim()
      .email(
        'Please enter a valid email address.',
      )
      .required('Email is required.'),

    newPassword: Yup.string()
      .min(
        8,
        'Password must be at least 8 characters.',
      )
      .required(
        'New password is required.',
      ),

    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('newPassword')],
        'Passwords do not match.',
      )
      .required(
        'Please confirm your password.',
      ),
  });

interface FormStatus {
  readonly type: 'success' | 'error';
  readonly message: string;
}

const ForgotPassword = (): React.JSX.Element => {
  const { forgotPassword } = useAuth();

  const initialValues: ForgotPasswordRequest = {
    email: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (
    values: ForgotPasswordRequest,
    helpers: FormikHelpers<ForgotPasswordRequest>,
  ): Promise<void> => {
    helpers.setStatus(undefined);

    try {
      await forgotPassword({
        email: values.email.trim(),
        newPassword: values.newPassword,
        confirmPassword:
          values.confirmPassword,
      });

      message.success(
        'Password updated successfully.',
      );

      helpers.setStatus({
        type: 'success',
        message:
          'Password updated successfully. Please sign in with your new password.',
      });

      helpers.resetForm();
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
              Reset Password
            </Title>

            <Paragraph className="forgot-password-page__description">
              Enter your email address and
              choose a new password for your
              account.
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

                {status?.type ===
                  'success' && (
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
                      Email Address
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
                        touched.email &&
                        errors.email
                          ? 'error'
                          : undefined
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={handleBlur}
                    />

                    {touched.email &&
                      errors.email && (
                        <Text
                          type="danger"
                          className="forgot-password-page__error"
                        >
                          {
                            errors.email
                          }
                        </Text>
                      )}
                  </div>

                  <div className="forgot-password-page__field">
                    <label
                      htmlFor="newPassword"
                      className="forgot-password-page__label"
                    >
                      New Password
                    </label>

                    <Input.Password
                      id="newPassword"
                      name="newPassword"
                      size="large"
                      placeholder="Enter new password"
                      value={
                        values.newPassword
                      }
                      status={
                        touched.newPassword &&
                        errors.newPassword
                          ? 'error'
                          : undefined
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={handleBlur}
                    />

                    {touched.newPassword &&
                      errors.newPassword && (
                        <Text
                          type="danger"
                          className="forgot-password-page__error"
                        >
                          {
                            errors.newPassword
                          }
                        </Text>
                      )}
                  </div>

                  <div className="forgot-password-page__field">
                    <label
                      htmlFor="confirmPassword"
                      className="forgot-password-page__label"
                    >
                      Confirm Password
                    </label>

                    <Input.Password
                      id="confirmPassword"
                      name="confirmPassword"
                      size="large"
                      placeholder="Confirm password"
                      value={
                        values.confirmPassword
                      }
                      status={
                        touched.confirmPassword &&
                        errors.confirmPassword
                          ? 'error'
                          : undefined
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={handleBlur}
                    />

                    {touched.confirmPassword &&
                      errors.confirmPassword && (
                        <Text
                          type="danger"
                          className="forgot-password-page__error"
                        >
                          {
                            errors.confirmPassword
                          }
                        </Text>
                      )}
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={
                      isSubmitting
                    }
                    disabled={
                      isSubmitting
                    }
                    className="forgot-password-page__submit"
                  >
                    Reset Password
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