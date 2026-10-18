// 시간 계산은 이 파일에만 둔다. iOS Safari가 Temporal을 지원하면 여기만 교체하면 된다.

export interface ClockParts {
  /** 펫 상태 판단용 24시간제 값 */
  hours: number
  minutes: number
  seconds: number
  /** 12시간제일 때만 '오전'/'오후', 아니면 빈 문자열 */
  period: string
  hm: string
  ss: string
  iso: string
  spoken: string
  dateKey: string
}

const pad = (n: number) => String(n).padStart(2, '0')

export function getClockParts(now: Date, hour12 = false): ClockParts {
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const period = hour12 ? (hours < 12 ? '오전' : '오후') : ''
  const displayHours = hour12 ? hours % 12 || 12 : hours
  const hm = `${hour12 ? displayHours : pad(displayHours)}:${pad(minutes)}`
  const ss = pad(seconds)

  return {
    hours,
    minutes,
    seconds,
    period,
    hm,
    ss,
    iso: `${pad(hours)}:${pad(minutes)}:${ss}`,
    spoken: `${period ? `${period} ` : ''}${displayHours}시 ${minutes}분 ${seconds}초`,
    dateKey: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`,
  }
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

export const formatDate = (now: Date) => dateFormatter.format(now)

/** 다음 초 경계까지 남은 ms (약간의 여유를 더해 경계 직전에 깨는 것을 막는다) */
export const msUntilNextSecond = (now: Date) => 1000 - now.getMilliseconds() + 8
