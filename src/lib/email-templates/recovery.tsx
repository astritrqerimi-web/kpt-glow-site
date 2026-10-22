import * as React from 'react'
import { emailBrand } from './brand'

import {
  Body,
  Button,
  Container,
  Img,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={emailBrand.logo} alt="KPT Consulting" width="64" height="64" style={{ marginBottom: '16px' }} />
        <Text style={{ color: emailBrand.foreground, fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px' }}>KPT Consulting</Text>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for {siteName}. Click
          the button below to choose a new password.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Reset Password
        </Button>
        <Text style={footer}>
          If you didn't request a password reset, you can safely ignore this
          email. Your password will not be changed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', borderTop: `4px solid ${emailBrand.primary}` }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: emailBrand.foreground,
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: emailBrand.muted,
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: emailBrand.primary,
  color: '#ffffff',
  fontSize: '14px',
  border: `1px solid ${emailBrand.primary}`,
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: emailBrand.muted, margin: '30px 0 0' }
