// Static export has no server: redirect() here would prerender an empty
// error shell that only navigates after the whole JS bundle hydrates — on a
// slow mobile connection that reads as a site that never opens. Instead this
// page ships real HTML: an inline script redirects by browser language during
// parse (before any bundle loads), with <meta refresh> and plain links as
// no-JS fallbacks, and a spinner so a slow handoff still shows progress.
import Link from 'next/link'

const REDIRECT_SCRIPT = "location.replace(/^pt/i.test(navigator.language) ? '/pt/' : '/en/')"

const SPINNER_KEYFRAMES = '@keyframes rootspin{to{transform:rotate(360deg)}}'

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="1;url=/pt/" />
      <style dangerouslySetInnerHTML={{ __html: SPINNER_KEYFRAMES }} />
      <main
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'monospace',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '3px solid rgba(127,127,127,0.3)',
            borderTopColor: '#f472b6',
            animation: 'rootspin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '13px', opacity: 0.8 }}>
          <Link href="/pt/">português</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/en/">english</Link>
        </p>
      </main>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
    </>
  )
}
