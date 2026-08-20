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
import type { RegisterRequest } from '../../types/auth';
import './Register.css';

const { Title, Paragraph, Text } = Typography;

const registerValidationSchema: Yup.ObjectSchema<RegisterRequest> =
  Yup.object({
    firstName: Yup.string()
      .trim()
      .min(2, 'First name must be at least 2 characters.')
      .max(50, 'First name cannot exceed 50 characters.')
      .required('First name is required.'),

    lastName: Yup.string()
      .trim()
      .min(2, 'Last name must be at least 2 characters.')
      .max(50, 'Last name cannot exceed 50 characters.')
      .required('Last name is required.'),

    email: Yup.string()
      .trim()
      .email('Please enter a valid email address.')
      .required('Email is required.'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters.')
      .matches(
        /[A-Z]/,
        'Password must contain at least one uppercase letter.',
      )
      .matches(
        /[a-z]/,
        'Password must contain at least one lowercase letter.',
      )
      .matches(
        /[0-9]/,
        'Password must contain at least one number.',
      )
      .required('Password is required.'),
  });

interface RegisterFormValues extends RegisterRequest {
  readonly confirmPassword: string;
}

interface RegisterFormStatus {
  readonly type: 'success' | 'error';
  readonly message: string;
}

const Register = (): React.JSX.Element => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema: Yup.ObjectSchema<RegisterFormValues> =
    registerValidationSchema.shape({
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('password')],
          'Passwords must match.',
        )
        .required('Please confirm your password.'),
    });

  const handleSubmit = async (
    values: RegisterFormValues,
    helpers: FormikHelpers<RegisterFormValues>,
  ): Promise<void> => {
    helpers.setStatus(undefined);

    const request: RegisterRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
    };

    try {
      await register(request);
        navigate('/dashboard');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create your account. Please try again.';

      const errorStatus: RegisterFormStatus = {
        type: 'error',
        message,
      };

      helpers.setStatus(errorStatus);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-page__container">
        <Card className="register-page__card">
          <div className="register-page__header">
            <Text className="register-page__eyebrow">
              EXPENSE TRACKER
            </Text>

            <Title
              level={1}
              className="register-page__title"
            >
              Create your account
            </Title>

            <Paragraph className="register-page__description">
              Start managing your expenses with a simple,
              organized workspace.
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
                    className="register-page__alert"
                    type="error"
                    showIcon
                    message={status.message}
                    role="alert"
                  />
                )}

                {status?.type === 'success' && (
                  <Alert
                    className="register-page__alert"
                    type="success"
                    showIcon
                    message={status.message}
                    role="status"
                  />
                )}

                <FormikForm
                  className="register-page__form"
                  noValidate
                >
                  <div className="register-page__name-row">
                    <div className="register-page__field">
                      <label
                        htmlFor="register-first-name"
                        className="register-page__label"
                      >
                        First name
                      </label>

                      <Input
                        id="register-first-name"
                        name="firstName"
                        size="large"
                        placeholder="First name"
                        autoComplete="given-name"
                        value={values.firstName}
                        status={
                          touched.firstName &&
                          errors.firstName
                            ? 'error'
                            : undefined
                        }
                        aria-invalid={
                          touched.firstName &&
                          errors.firstName
                            ? 'true'
                            : 'false'
                        }
                        aria-describedby={
                          touched.firstName &&
                          errors.firstName
                            ? 'register-first-name-error'
                            : undefined
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      {touched.firstName &&
                        errors.firstName && (
                          <Text
                            id="register-first-name-error"
                            type="danger"
                            className="register-page__error"
                          >
                            {errors.firstName}
                          </Text>
                        )}
                    </div>

                    <div className="register-page__field">
                      <label
                        htmlFor="register-last-name"
                        className="register-page__label"
                      >
                        Last name
                      </label>

                      <Input
                        id="register-last-name"
                        name="lastName"
                        size="large"
                        placeholder="Last name"
                        autoComplete="family-name"
                        value={values.lastName}
                        status={
                          touched.lastName &&
                          errors.lastName
                            ? 'error'
                            : undefined
                        }
                        aria-invalid={
                          touched.lastName &&
                          errors.lastName
                            ? 'true'
                            : 'false'
                        }
                        aria-describedby={
                          touched.lastName &&
                          errors.lastName
                            ? 'register-last-name-error'
                            : undefined
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      {touched.lastName &&
                        errors.lastName && (
                          <Text
                            id="register-last-name-error"
                            type="danger"
                            className="register-page__error"
                          >
                            {errors.lastName}
                          </Text>
                        )}
                    </div>
                  </div>

                  <div className="register-page__field">
                    <label
                      htmlFor="register-email"
                      className="register-page__label"
                    >
                      Email address
                    </label>

                    <Input
                      id="register-email"
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
                          ? 'register-email-error'
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {touched.email && errors.email && (
                      <Text
                        id="register-email-error"
                        type="danger"
                        className="register-page__error"
                      >
                        {errors.email}
                      </Text>
                    )}
                  </div>

                  <div className="register-page__field">
                    <label
                      htmlFor="register-password"
                      className="register-page__label"
                    >
                      Password
                    </label>

                    <Input.Password
                      id="register-password"
                      name="password"
                      size="large"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      value={values.password}
                      status={
                        touched.password && errors.password
                          ? 'error'
                          : undefined
                      }
                      aria-invalid={
                        touched.password &&
                        errors.password
                          ? 'true'
                          : 'false'
                      }
                      aria-describedby={
                        touched.password &&
                        errors.password
                          ? 'register-password-error'
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {touched.password &&
                      errors.password && (
                        <Text
                          id="register-password-error"
                          type="danger"
                          className="register-page__error"
                        >
                          {errors.password}
                        </Text>
                      )}
                  </div>

                  <div className="register-page__field">
                    <label
                      htmlFor="register-confirm-password"
                      className="register-page__label"
                    >
                      Confirm password
                    </label>

                    <Input.Password
                      id="register-confirm-password"
                      name="confirmPassword"
                      size="large"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      value={values.confirmPassword}
                      status={
                        touched.confirmPassword &&
                        errors.confirmPassword
                          ? 'error'
                          : undefined
                      }
                      aria-invalid={
                        touched.confirmPassword &&
                        errors.confirmPassword
                          ? 'true'
                          : 'false'
                      }
                      aria-describedby={
                        touched.confirmPassword &&
                        errors.confirmPassword
                          ? 'register-confirm-password-error'
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {touched.confirmPassword &&
                      errors.confirmPassword && (
                        <Text
                          id="register-confirm-password-error"
                          type="danger"
                          className="register-page__error"
                        >
                          {errors.confirmPassword}
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
                    className="register-page__submit"
                  >
                    Create Account
                  </Button>
                </FormikForm>

                <div className="register-page__login">
                  <Text>
                    Already have an account?{' '}
                  </Text>

                  <Link to="/login">
                    Sign in
                  </Link>
                  <div className="register-page__back">
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

export default Register;