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
import { Link, useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest } from '../../types/auth';
import './Login.css';

const { Title, Paragraph, Text } = Typography;

const loginValidationSchema: Yup.ObjectSchema<LoginRequest> =
  Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address.')
      .required('Email is required.'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters.')
      .required('Password is required.'),
  });

interface LoginFormStatus {
  readonly type: 'success' | 'error';
  readonly message: string;
}

const Login = (): React.JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginRequest,
    helpers: FormikHelpers<LoginRequest>,
  ): Promise<void> => {
    helpers.setStatus(undefined);

    try {
      await login(values);
      navigate('/dashboard', {replace: true})

      const successStatus: LoginFormStatus = {
        type: 'success',
        message: 'Login successful.',
      };

      helpers.setStatus(successStatus);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.';

      const errorStatus: LoginFormStatus = {
        type: 'error',
        message,
      };

      helpers.setStatus(errorStatus);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__container">
        <Card className="login-page__card">
          <div className="login-page__header">
            <Text className="login-page__eyebrow">
              EXPENSE TRACKER
            </Text>

            <Title
              level={1}
              className="login-page__title"
            >
              Welcome back
            </Title>

            <Paragraph className="login-page__description">
              Sign in to continue managing your expenses.
            </Paragraph>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
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
                    className="login-page__alert"
                    type="error"
                    showIcon
                    message={status.message}
                    role="alert"
                  />
                )}

                <FormikForm
                  className="login-page__form"
                  noValidate
                >
                  <div className="login-page__field">
                    <label
                      htmlFor="login-email"
                      className="login-page__label"
                    >
                      Email address
                    </label>

                    <Input
                      id="login-email"
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
                          ? 'login-email-error'
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {touched.email && errors.email && (
                      <Text
                        id="login-email-error"
                        type="danger"
                        className="login-page__error"
                      >
                        {errors.email}
                      </Text>
                    )}
                  </div>

                  <div className="login-page__field">
                    <div className="login-page__password-header">
                      <label
                        htmlFor="login-password"
                        className="login-page__label"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="login-page__forgot-link"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Input.Password
                      id="login-password"
                      name="password"
                      size="large"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={values.password}
                      status={
                        touched.password && errors.password
                          ? 'error'
                          : undefined
                      }
                      aria-invalid={
                        touched.password && errors.password
                          ? 'true'
                          : 'false'
                      }
                      aria-describedby={
                        touched.password && errors.password
                          ? 'login-password-error'
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {touched.password && errors.password && (
                      <Text
                        id="login-password-error"
                        type="danger"
                        className="login-page__error"
                      >
                        {errors.password}
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
                    className="login-page__submit"
                  >
                    Sign In
                  </Button>
                </FormikForm>

                <div className="login-page__register">
                  <Text>
                    Don't have an account?{' '}
                  </Text>

                  <Link to="/register">
                    Create an account
                  </Link>
                  <div className="login-page__back">
                    <Link to="/">
                        <Button>
                        Back to Home
                        </Button>
                    </Link>
                    </div>
                </div>
              </>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
};

export default Login;