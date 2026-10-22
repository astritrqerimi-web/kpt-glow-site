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
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={emailBrand.logo} alt="KPT Consulting" width="64" height="64" style={{ marginBottom: '16px' }} />
        <Text style={{ color: emailBrand.foreground, fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px' }}>KPT Consulting</Text>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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
const link = { color: 'inherit', textDecoration: 'underline' }
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
