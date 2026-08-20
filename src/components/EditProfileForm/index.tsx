import {
  Alert,
  Avatar,
  Button,
  Card,
  Input,
  Typography,
  Upload,
} from 'antd';
import {
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Formik,
  Form as FormikForm,
  type FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import {
  useEffect,
  useState,
} from 'react';
import type { UploadProps } from 'antd';
import type { User } from '../../types/auth';
import './EditProfileForm.css';

const { Title } = Typography;

interface EditProfileFormProps {
  readonly user: User;
  readonly onSave: (
    user: User,
  ) => Promise<void>;
}

interface EditProfileValues {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

const MAX_AVATAR_SIZE_MB = 2;

const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const validationSchema: Yup.ObjectSchema<EditProfileValues> =
  Yup.object({
    firstName: Yup.string()
      .trim()
      .required(
        'First name is required.',
      ),

    lastName: Yup.string()
      .trim()
      .required(
        'Last name is required.',
      ),

    email: Yup.string()
      .email(
        'Please enter a valid email address.',
      )
      .required(
        'Email is required.',
      ),
  });

const EditProfileForm = ({
  user,
  onSave,
}: EditProfileFormProps): React.JSX.Element => {
  const [
    avatarUrl,
    setAvatarUrl,
  ] = useState<string | null>(
    user.avatarUrl,
  );

  const [
    avatarError,
    setAvatarError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setAvatarUrl(user.avatarUrl);
    setAvatarError(null);
  }, [user.avatarUrl]);

  const initialValues: EditProfileValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  const handleAvatarBeforeUpload: UploadProps['beforeUpload'] =
    (file) => {
      setAvatarError(null);

      if (
        !ALLOWED_AVATAR_TYPES.includes(
          file.type,
        )
      ) {
        setAvatarError(
          'Please upload a JPG, PNG, or WebP image.',
        );

        return false;
      }

      const fileSizeInMb =
        file.size /
        (1024 * 1024);

      if (
        fileSizeInMb >
        MAX_AVATAR_SIZE_MB
      ) {
        setAvatarError(
          'Avatar image must be smaller than 2 MB.',
        );

        return false;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result !==
          'string'
        ) {
          setAvatarError(
            'Unable to process the selected image.',
          );

          return;
        }

        setAvatarUrl(
          reader.result,
        );
      };

      reader.onerror = () => {
        setAvatarError(
          'Unable to read the selected image.',
        );
      };

      reader.readAsDataURL(file);

      return false;
    };

  const handleRemoveAvatar = (): void => {
    setAvatarUrl(null);
    setAvatarError(null);
  };

  const handleSubmit = async (
    values: EditProfileValues,
    helpers: FormikHelpers<EditProfileValues>,
  ): Promise<void> => {
    helpers.setStatus(undefined);

    if (avatarError !== null) {
      helpers.setStatus({
        type: 'error',
        message: avatarError,
      });

      return;
    }

    try {
      const updatedUser: User = {
        ...user,
        firstName:
          values.firstName.trim(),
        lastName:
          values.lastName.trim(),
        email:
          values.email.trim(),
        avatarUrl,
      };

      await onSave(updatedUser);

      helpers.setStatus({
        type: 'success',
        message:
          'Profile updated successfully.',
      });
    } catch (error: unknown) {
      helpers.setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to update profile.',
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const avatarFallback =
    user.firstName
      .charAt(0)
      .toUpperCase();

  return (
    <Card className="edit-profile-form">
      <Title
        level={3}
        className="edit-profile-form__title"
      >
        Edit Profile
      </Title>

      <section
        className="edit-profile-form__avatar-section"
        aria-labelledby="profile-photo-title"
      >
        <div
          className="edit-profile-form__avatar-preview"
          role="img"
          aria-label={
            avatarUrl !== null
              ? 'Current profile photo'
              : `Profile avatar for ${user.firstName}`
          }
        >
          <Avatar
            size={96}
            src={
              avatarUrl ?? undefined
            }
            icon={
              avatarUrl === null ? (
                <UserOutlined />
              ) : undefined
            }
          >
            {avatarUrl === null
              ? avatarFallback
              : undefined}
          </Avatar>
        </div>

        <div className="edit-profile-form__avatar-actions">
          <Typography.Text
            strong
            id="profile-photo-title"
            className="edit-profile-form__avatar-label"
          >
            Profile photo
          </Typography.Text>

          <Typography.Text
            type="secondary"
            className="edit-profile-form__avatar-help"
          >
            JPG, PNG, or WebP. Maximum
            file size: 2 MB.
          </Typography.Text>

          <div className="edit-profile-form__avatar-buttons">
            <Upload
              accept="image/jpeg,image/png,image/webp"
              beforeUpload={
                handleAvatarBeforeUpload
              }
              showUploadList={false}
              maxCount={1}
            >
              <Button
                icon={<UploadOutlined />}
                aria-label="Choose a profile photo"
              >
                Choose Photo
              </Button>
            </Upload>

            {avatarUrl !== null && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={
                  handleRemoveAvatar
                }
                aria-label="Remove profile photo"
              >
                Remove Photo
              </Button>
            )}
          </div>

          {avatarError !== null && (
            <Typography.Text
              type="danger"
              role="alert"
            >
              {avatarError}
            </Typography.Text>
          )}
        </div>
      </section>

      <Formik
        initialValues={initialValues}
        validationSchema={
          validationSchema
        }
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          status,
          isSubmitting,
          handleChange,
          handleBlur,
        }) => (
          <>
            {status?.type ===
              'success' && (
              <Alert
                type="success"
                showIcon
                message={
                  status.message
                }
                className="edit-profile-form__alert"
              />
            )}

            {status?.type ===
              'error' && (
              <Alert
                type="error"
                showIcon
                message={
                  status.message
                }
                className="edit-profile-form__alert"
              />
            )}

            <FormikForm
              className="edit-profile-form__fields"
              noValidate
            >
              <div className="edit-profile-form__field">
                <label
                  htmlFor="profile-first-name"
                  className="edit-profile-form__label"
                >
                  First name
                </label>

                <Input
                  id="profile-first-name"
                  name="firstName"
                  size="large"
                  value={
                    values.firstName
                  }
                  status={
                    touched.firstName &&
                    errors.firstName
                      ? 'error'
                      : undefined
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  aria-describedby={
                    touched.firstName &&
                    errors.firstName
                      ? 'profile-first-name-error'
                      : undefined
                  }
                />

                {touched.firstName &&
                  errors.firstName && (
                    <Typography.Text
                      id="profile-first-name-error"
                      type="danger"
                      role="alert"
                    >
                      {
                        errors.firstName
                      }
                    </Typography.Text>
                  )}
              </div>

              <div className="edit-profile-form__field">
                <label
                  htmlFor="profile-last-name"
                  className="edit-profile-form__label"
                >
                  Last name
                </label>

                <Input
                  id="profile-last-name"
                  name="lastName"
                  size="large"
                  value={
                    values.lastName
                  }
                  status={
                    touched.lastName &&
                    errors.lastName
                      ? 'error'
                      : undefined
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  aria-describedby={
                    touched.lastName &&
                    errors.lastName
                      ? 'profile-last-name-error'
                      : undefined
                  }
                />

                {touched.lastName &&
                  errors.lastName && (
                    <Typography.Text
                      id="profile-last-name-error"
                      type="danger"
                      role="alert"
                    >
                      {
                        errors.lastName
                      }
                    </Typography.Text>
                  )}
              </div>

              <div className="edit-profile-form__field">
                <label
                  htmlFor="profile-email"
                  className="edit-profile-form__label"
                >
                  Email address
                </label>

                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  size="large"
                  value={
                    values.email
                  }
                  status={
                    touched.email &&
                    errors.email
                      ? 'error'
                      : undefined
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  aria-describedby={
                    touched.email &&
                    errors.email
                      ? 'profile-email-error'
                      : undefined
                  }
                />

                {touched.email &&
                  errors.email && (
                    <Typography.Text
                      id="profile-email-error"
                      type="danger"
                      role="alert"
                    >
                      {errors.email}
                    </Typography.Text>
                  )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                disabled={
                  avatarError !== null
                }
              >
                Save Changes
              </Button>
            </FormikForm>
          </>
        )}
      </Formik>
    </Card>
  );
};

export default EditProfileForm;
