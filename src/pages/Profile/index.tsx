import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Layout,
  Popconfirm,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import AppNavigation from '../../components/AppNavigation';
import EditProfileForm from '../../components/EditProfileForm';
import { useAuth } from '../../context/AuthContext';

import './Profile.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Profile = (): React.JSX.Element => {
  const {
    user,
    updateUser,
    deleteUser,
    isLoading,
  } = useAuth();

  const handleDeleteProfile =
    async (): Promise<void> => {
      try {
        await deleteUser();

        message.success(
          'Profile deleted successfully.',
        );
      } catch {
        message.error(
          'Unable to delete profile. Please try again.',
        );
      }
    };

  if (user === null) {
    return (
      <Layout className="profile-page">
        <AppNavigation />

        <Content className="profile-page__content">
          <Card>
            <Title level={2}>
              Profile unavailable
            </Title>

            <Paragraph>
              Your profile could not be loaded.
            </Paragraph>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="profile-page">
      <AppNavigation />

      <Content className="profile-page__content">
        <section
          className="profile-page__header"
          aria-labelledby="profile-title"
        >
          <Title
            id="profile-title"
            level={1}
            className="profile-page__title"
          >
            Profile
          </Title>

          <Paragraph className="profile-page__description">
            Manage your account information.
          </Paragraph>
        </section>

        <Card className="profile-page__card">
          <div className="profile-page__identity">
            <Avatar
              size={80}
              src={
                user.avatarUrl ?? undefined
              }
              alt={`${user.firstName} ${user.lastName}`}
            >
              {user.firstName.charAt(0)}
            </Avatar>

            <div>
              <Title
                level={3}
                className="profile-page__name"
              >
                {user.firstName}{' '}
                {user.lastName}
              </Title>

              <Paragraph className="profile-page__email">
                {user.email}
              </Paragraph>
            </div>
          </div>

          <Descriptions
            title="Account information"
            column={{
              xs: 1,
              sm: 2,
            }}
            bordered
          >
            <Descriptions.Item label="First name">
              {user.firstName}
            </Descriptions.Item>

            <Descriptions.Item label="Last name">
              {user.lastName}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>

            <Descriptions.Item label="User ID">
              {user.id}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <EditProfileForm
          user={user}
          onSave={updateUser}
        />

        <Card className="profile-page__danger-card">
          <Title
            level={3}
            className="profile-page__danger-title"
          >
            Delete Account
          </Title>

          <Paragraph>
            Permanently delete your profile and
            account information. This action
            cannot be undone.
          </Paragraph>

          <Popconfirm
            title="Delete your profile?"
            description="This action cannot be undone."
            okText="Delete Profile"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
            onConfirm={handleDeleteProfile}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isLoading}
              size="large"
            >
              Delete Profile
            </Button>
          </Popconfirm>
        </Card>
      </Content>
    </Layout>
  );
};

export default Profile;