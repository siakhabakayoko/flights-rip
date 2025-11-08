import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import styled from 'styled-components';
import { useAuth } from 'shared/hooks/useAuth';
import { ReusableHead } from 'shared/components/ReusableHead';

const { Title, Text } = Typography;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }
`;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword, loading, error, clearError } = useAuth();
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values) => {
    try {
      clearError();
      await resetPassword(values.email);
      setSubmitted(true);
      message.success('Password reset link sent to your email');
    } catch (err) {
      message.error(err.message || 'Failed to send reset link');
    }
  };

  if (submitted) {
    return (
      <>
        <ReusableHead title="Reset Password | Flights.rip" />
        <AuthContainer>
          <AuthCard>
            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
              <Title level={2}>Check Your Email</Title>
              <Text type="secondary">
                We've sent a password reset link to your email address.
                Please check your inbox and follow the link to reset your password.
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={() => router.push('/auth/login')}
              >
                Back to Login
              </Button>
            </Space>
          </AuthCard>
        </AuthContainer>
      </>
    );
  }

  return (
    <>
      <ReusableHead title="Reset Password | Flights.rip" />
      <AuthContainer>
        <AuthCard>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Reset Password</Title>
              <Text type="secondary">Enter your email to receive a reset link</Text>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c33'
              }}>
                {error}
              </div>
            )}

            <StyledForm
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={loading}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input type="email" placeholder="you@example.com" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Form.Item>
            </StyledForm>

            <div style={{ textAlign: 'center' }}>
              <Button type="link" onClick={() => router.push('/auth/login')}>
                Back to Login
              </Button>
            </div>
          </Space>
        </AuthCard>
      </AuthContainer>
    </>
  );
}
