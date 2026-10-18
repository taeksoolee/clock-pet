import type { ClockParts } from './time'

export type PetState = 'idle' | 'excited' | 'celebrate' | 'sleep'
export type PetKind = 'cat' | 'dog' | 'bunny' | 'bear'

interface PetDef {
  name: string
  /** 상태 문장의 주어 (조사 포함) */
  subject: string
  body: string
  inner: string
  ears: string
  tail: string
  extra?: string
}

// 몸통·얼굴·애니메이션은 공유하고 귀·꼬리·색만 다르게 한다
export const PETS: Record<PetKind, PetDef> = {
  cat: {
    name: '고양이',
    subject: '고양이가',
    body: '#f6d7a7',
    inner: '#f4a6a0',
    ears: `
      <path class="ear" d="M46 96 L56 36 L94 72 Z" />
      <path class="ear" d="M154 96 L144 36 L106 72 Z" />
      <path class="ear-inner" d="M58 82 L63 52 L82 70 Z" />
      <path class="ear-inner" d="M142 82 L137 52 L118 70 Z" />`,
    tail: `<path class="tail tail-stroke" d="M156 160 q34 -6 28 -48" />`,
  },
  dog: {
    name: '강아지',
    subject: '강아지가',
    body: '#f0d3a8',
    inner: '#a8744a',
    ears: '',
    tail: `<path class="tail tail-stroke" d="M158 156 q24 -6 24 -36" />`,
    // 늘어진 귀는 얼굴 위로 덮여야 해서 몸통 다음에 그린다
    extra: `
      <path class="ear ear-dark" d="M62 80 C40 74 24 96 28 128 C30 146 46 150 54 138 C60 120 66 100 72 86 Z" />
      <path class="ear ear-dark" d="M138 80 C160 74 176 96 172 128 C170 146 154 150 146 138 C140 120 134 100 128 86 Z" />`,
  },
  bunny: {
    name: '토끼',
    subject: '토끼가',
    body: '#f4f1ec',
    inner: '#f6b8c4',
    ears: `
      <path class="ear" d="M68 92 C52 50 56 8 72 10 C88 12 90 54 88 86 Z" />
      <path class="ear" d="M132 92 C148 50 144 8 128 10 C112 12 110 54 112 86 Z" />
      <path class="ear-inner" d="M72 78 C64 50 66 24 73 24 C80 24 82 52 81 78 Z" />
      <path class="ear-inner" d="M128 78 C136 50 134 24 127 24 C120 24 118 52 119 78 Z" />`,
    tail: `<circle class="tail tail-puff" cx="166" cy="166" r="14" />`,
  },
  bear: {
    name: '곰',
    subject: '곰이',
    body: '#c8915c',
    inner: '#e9c095',
    ears: `
      <circle class="ear" cx="52" cy="80" r="22" />
      <circle class="ear" cx="148" cy="80" r="22" />
      <circle class="ear-inner" cx="52" cy="80" r="11" />
      <circle class="ear-inner" cx="148" cy="80" r="11" />`,
    tail: `<circle class="tail tail-puff" cx="164" cy="168" r="12" />`,
    extra: `<ellipse class="muzzle" cx="100" cy="142" rx="24" ry="17" />`,
  },
}

export const PET_KINDS = Object.keys(PETS) as PetKind[]

export const isPetKind = (v: unknown): v is PetKind => typeof v === 'string' && v in PETS

export function petSvg(kind: PetKind): string {
  const p = PETS[kind]
  return `
    <svg class="pet-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false"
      style="--pet-body:${p.body};--pet-ear-inner:${p.inner}">
      <g class="sparkles">
        <path d="M30 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z" />
        <path d="M170 30 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z" />
        <path d="M178 96 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" />
        <path d="M18 104 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" />
      </g>
      <g class="zzz">
        <text x="150" y="62">z</text>
        <text x="164" y="44">z</text>
        <text x="178" y="26">Z</text>
      </g>
      <g class="body-group">
        ${p.tail}
        <g class="breathe">
          ${p.ears}
          <ellipse class="body" cx="100" cy="128" rx="68" ry="58" />
          ${p.extra ?? ''}
          <g class="eyes-open">
            <ellipse cx="78" cy="120" rx="7" ry="9" />
            <ellipse cx="122" cy="120" rx="7" ry="9" />
            <circle class="shine" cx="80" cy="116" r="2.4" />
            <circle class="shine" cx="124" cy="116" r="2.4" />
          </g>
          <g class="eyes-closed">
            <path d="M70 121 q8 7 16 0" />
            <path d="M114 121 q8 7 16 0" />
          </g>
          <circle class="cheek" cx="62" cy="140" r="9" />
          <circle class="cheek" cx="138" cy="140" r="9" />
          <path class="mouth" d="M92 136 q4 6 8 0 q4 6 8 0" />
          <g class="mouth-open">
            <ellipse cx="100" cy="142" rx="8" ry="7" />
            <ellipse class="tongue" cx="100" cy="146" rx="4.5" ry="3" />
          </g>
        </g>
      </g>
    </svg>`
}

const LABELS: Record<PetState, (subject: string) => string> = {
  idle: (s) => `${s} 시계를 보고 있어요`,
  excited: (s) => `${s} 다음 분을 기다리며 들썩이고 있어요`,
  celebrate: (s) => `정각이에요! ${s} 신나서 뛰고 있어요`,
  sleep: (s) => `${s} 졸고 있어요`,
}

export function getPetState({ hours, minutes, seconds }: ClockParts): PetState {
  if (minutes === 0 && seconds < 5) return 'celebrate'
  if (hours >= 23 || hours < 6) return 'sleep'
  if (seconds >= 55) return 'excited'
  return 'idle'
}

export function createPet(el: HTMLElement) {
  let kind: PetKind | null = null
  let state: PetState = 'idle'

  const applyLabel = () => kind && el.setAttribute('aria-label', LABELS[state](PETS[kind].subject))

  return {
    setKind(next: PetKind) {
      if (next === kind) return
      kind = next
      el.dataset.pet = next
      el.innerHTML = petSvg(next)
      applyLabel()
    },
    update(parts: ClockParts) {
      const next = getPetState(parts)
      if (next !== state || !el.dataset.state) {
        state = next
        el.dataset.state = next
        applyLabel()
      }
      // 매초 꼬리 흔들기: 클래스를 번갈아 바꿔 CSS 애니메이션을 다시 시작한다
      el.classList.toggle('tick-a', parts.seconds % 2 === 0)
      el.classList.toggle('tick-b', parts.seconds % 2 === 1)
    },
  }
}
