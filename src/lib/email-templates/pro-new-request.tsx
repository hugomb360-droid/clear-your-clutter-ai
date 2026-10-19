import React from 'react'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  summary?: string
}

const ProNewRequest = ({ summary }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouvelle demande de débarras dans vos zones</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Débarras France</Text>
        <Heading style={h1}>Nouvelle demande dans vos zones</Heading>
        <Text style={text}>{summary || 'Une nouvelle demande de débarras vient d’être publiée près de chez vous.'}</Text>
        <Button href="https://debarrasfrance.fr/pro/dashboard" style={button}>Voir la demande</Button>
        <Text style={muted}>Répondre rapidement augmente vos chances d’être choisi.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ProNewRequest,
  subject: 'Nouvelle demande de débarras dans vos zones',
  displayName: 'Alerte pro — nouvelle demande',
  previewData: { summary: 'Angoulême (16000) · 12 m³ · IA : 450 € – 650 € · Étage 2 sans ascenseur' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = { color: '#047857', fontWeight: 700, fontSize: '14px', margin: '0 0 16px' }
const h1 = { color: '#111827', fontSize: '22px', margin: '0 0 12px' }
const text = { color: '#374151', fontSize: '15px', lineHeight: '22px' }
const button = { backgroundColor: '#047857', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }
const muted = { color: '#6b7280', fontSize: '13px', marginTop: '20px' }
