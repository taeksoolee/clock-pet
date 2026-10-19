// 시계를 보는 동안 화면이 꺼지지 않게 한다 (Screen Wake Lock API).
// 앱이 백그라운드로 가면 브라우저가 알아서 해제하므로, 다시 보일 때 새로 요청한다.

export function createWakeLock() {
  const supported = 'wakeLock' in navigator
  let enabled = false
  let sentinel: WakeLockSentinel | null = null
  let pending = false

  async function acquire() {
    if (!supported || !enabled || sentinel || pending) return
    if (document.visibilityState !== 'visible') return
    pending = true
    try {
      const next = await navigator.wakeLock.request('screen')
      // 요청하는 사이에 꺼졌으면 바로 돌려준다
      if (!enabled) {
        await next.release()
        return
      }
      sentinel = next
      sentinel.addEventListener('release', () => {
        sentinel = null
      })
    } catch {
      // 저전력 모드이거나 사용자 동작이 있어야 허용하는 브라우저 — 다음 탭에서 다시 시도한다
    } finally {
      pending = false
    }
  }

  async function release() {
    const current = sentinel
    sentinel = null
    await current?.release().catch(() => {})
  }

  if (supported) {
    document.addEventListener('visibilitychange', () => void acquire())
    document.addEventListener('pointerdown', () => void acquire(), { passive: true })
  }

  return {
    supported,
    setEnabled(on: boolean) {
      enabled = on
      void (on ? acquire() : release())
    },
  }
}
