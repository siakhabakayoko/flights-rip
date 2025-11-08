import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Card, Typography, Space, message, Spin } from 'antd';
import styled from 'styled-components';
import { useAuth } from 'shared/hooks/useAuth';
import { ReusableHead } from 'shared/components/ReusableHead';

const { Title, Text, Link } = Typography;

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

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      clearError();
      await signIn(values.email, values.password);
      message.success('Logged in successfully!');
      router.push('/');
    } catch (err) {
      message.error(err.message || 'Failed to log in');
    }
  };

  return (
    <>
      <ReusableHead title="Login | Flights.rip" />
      <AuthContainer>
        <AuthCard>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Welcome Back</Title>
              <Text type="secondary">Sign in to your account</Text>
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

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form.Item>
            </StyledForm>

            <div style={{ textAlign: 'center' }}>
              <Space>
                <Text>Don't have an account?</Text>
                <Button type="link" onClick={() => router.push('/auth/signup')}>
                  Sign up
                </Button>
              </Space>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button type="link" onClick={() => router.push('/auth/forgot-password')}>
                Forgot password?
              </Button>
            </div>
          </Space>
        </AuthCard>
      </AuthContainer>
    </>
  );
}
