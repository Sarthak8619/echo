// Rendered by next/og (Satori), so styling must be inline.
export function EchoMark({ size, radius }: { size: number; radius: number }) {
  const stroke = Math.max(1.5, size * 0.034)
  const ring = (diameter: number, opacity: number) => (
    <div
      style={{
        position: 'absolute',
        top: (size - diameter) / 2,
        left: (size - diameter) / 2,
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        border: `${stroke}px solid rgba(255, 255, 255, ${opacity})`,
      }}
    />
  )

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'linear-gradient(145deg, #f8a563 0%, #e2682a 48%, #b3431d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {ring(size * 0.8, 0.2)}
      {ring(size * 0.56, 0.42)}
      <div style={{ width: size * 0.26, height: size * 0.26, borderRadius: '50%', background: '#ffffff' }} />
    </div>
  )
}
