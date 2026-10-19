import { isPetKind, type PetKind } from './pet'

export interface Settings {
  pet: PetKind
  hour12: boolean
  showDate: boolean
  /** 보고 있는 동안 화면 꺼짐 방지 (+ 번인 방지 이동) */
  keepAwake: boolean
}

const KEY = 'clock-pet:settings'

export const DEFAULT_SETTINGS: Settings = {
  pet: 'cat',
  hour12: false,
  showDate: true,
  keepAwake: true,
}

// 사파리 개인정보 보호 모드 등에서는 저장소 접근이 막힐 수 있어 항상 기본값으로 물러난다
export function loadSettings(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return {
      pet: isPetKind(raw.pet) ? raw.pet : DEFAULT_SETTINGS.pet,
      hour12: typeof raw.hour12 === 'boolean' ? raw.hour12 : DEFAULT_SETTINGS.hour12,
      showDate: typeof raw.showDate === 'boolean' ? raw.showDate : DEFAULT_SETTINGS.showDate,
      keepAwake: typeof raw.keepAwake === 'boolean' ? raw.keepAwake : DEFAULT_SETTINGS.keepAwake,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // 저장에 실패해도 이번 세션에서는 그대로 동작한다
  }
}
