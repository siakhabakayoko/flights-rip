import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Space, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined, BookOutlined } from '@ant-design/icons';
import Emoji from '../Emoji';
import { LoginModal } from 'shared/components/LoginModal'
import { StyledSpace, Logo } from './Styles'
import { useAuth } from 'shared/hooks/useAuth'

export const HeaderNav = () => {
  const router = useRouter()
  const [loginOpen, setLoginOpen] = useState(false)
  const { user, signOut, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      message.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      message.error('Failed to logout')
    }
  }

  return(
    <>
      <StyledSpace>
        <a href='/'><Logo><Emoji symbol='✈️'/> Fligths.rip</Logo></a>

        <Space>
          {isAuthenticated ? (
            <>
              <Link href="/searches">
                <Button icon={<BookOutlined />}>
                  My Searches
                </Button>
              </Link>
              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button type="primary" icon={<UserOutlined />}>
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </Space>
      </StyledSpace>

      <LoginModal
        visible={loginOpen}
        setVisible={setLoginOpen}
      />
    </>
  )
}