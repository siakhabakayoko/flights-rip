import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Card, Typography, Space, message, Checkbox } from 'antd';
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

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading, error, clearError } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      clearError();
      await signUp(values.email, values.password);
      message.success('Account created! Check your email to confirm your account.');
      router.push('/auth/login');
    } catch (err) {
      message.error(err.message || 'Failed to create account');
    }
  };

  return (
    <>
      <ReusableHead title="Sign Up | Flights.rip" />
      <AuthContainer>
        <AuthCard>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Create Account</Title>
              <Text type="secondary">Start searching for flights</Text>
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
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password placeholder="Create a password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Please confirm your password' }]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[{
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms'))
                }]}
              >
                <Checkbox>
                  I agree to the <Button type="link" style={{ padding: 0 }}>Terms of Service</Button>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </Form.Item>
            </StyledForm>

            <div style={{ textAlign: 'center' }}>
              <Space>
                <Text>Already have an account?</Text>
                <Button type="link" onClick={() => router.push('/auth/login')}>
                  Sign in
                </Button>
              </Space>
            </div>
          </Space>
        </AuthCard>
      </AuthContainer>
    </>
  );
}
