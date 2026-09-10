import { ImageResponse } from 'next/og'
import { EchoMark } from '@/lib/brand-mark'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Full-bleed square: iOS applies its own rounded mask to home screen icons.
export default function AppleIcon() {
  return new ImageResponse(<EchoMark size={180} radius={0} />, size)
}
