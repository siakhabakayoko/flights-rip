import "shared/styles/normalize.css";
import "shared/styles/reset.local.css";
import "shared/styles/typography.css";
import 'antd/dist/antd.css'
import "shared/styles/styles.css";

import { RecoilRoot } from 'recoil'
import { AuthProvider } from 'shared/context/AuthContext'
import { DataProvider } from 'shared/components/DataProvider'

export default function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <AuthProvider>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </AuthProvider>
    </RecoilRoot>
  )
}