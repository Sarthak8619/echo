import { ImageResponse } from 'next/og'
import { EchoMark } from '@/lib/brand-mark'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(<EchoMark size={64} radius={14} />, size)
}
