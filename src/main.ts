import './style.css'
import { formatDate, getClockParts, msUntilNextSecond } from './time'
import { createPet, isPetKind, PET_KINDS, PETS, petSvg } from './pet'
import { loadSettings, saveSettings, type Settings } from './settings'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

const clockEl = $('clock')
const periodEl = $('period')
const hmEl = $('hm')
const secEl = $('sec')
const spokenEl = $('spoken')
const dateEl = $('date')
const pet = createPet($('pet'))

let settings: Settings = loadSettings()
let lastHm = ''
let lastDateKey = ''
let timer: number | undefined

function render(now: Date) {
  const parts = getClockParts(now, settings.hour12)

  // 초마다 바뀌는 부분만 건드리고, 분/날짜는 바뀔 때만 갱신한다
  secEl.textContent = `:${parts.ss}`
  if (parts.hm !== lastHm) {
    lastHm = parts.hm
    hmEl.textContent = parts.hm
    periodEl.textContent = parts.period
    periodEl.hidden = !parts.period
  }
  if (parts.dateKey !== lastDateKey) {
    lastDateKey = parts.dateKey
    dateEl.textContent = formatDate(now)
  }
  clockEl.setAttribute('datetime', parts.iso)
  spokenEl.textContent = parts.spoken

  pet.update(parts)
}

// 1초씩 더하지 않고 매번 현재 시각을 읽어서, 백그라운드에 다녀와도 어긋나지 않게 한다
function tick() {
  const now = new Date()
  render(now)
  timer = window.setTimeout(tick, msUntilNextSecond(now))
}

function restart() {
  window.clearTimeout(timer)
  tick()
}

function applySettings() {
  pet.setKind(settings.pet)
  dateEl.hidden = !settings.showDate
  lastHm = ''
  render(new Date())
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') restart()
  else window.clearTimeout(timer)
})
window.addEventListener('pageshow', restart)

/* ───── 설정 화면 ───── */

const dialog = $<HTMLDialogElement>('settings')
const form = $<HTMLFormElement>('settings-form')
const openBtn = $('open-settings')

$('pet-options').innerHTML = PET_KINDS.map(
  (kind) => `
    <label class="pet-option">
      <input class="sr-only" type="radio" name="pet" value="${kind}" />
      <span class="pet-option-card">
        <span class="pet-preview" aria-hidden="true">${petSvg(kind)}</span>
        <span class="pet-option-name">${PETS[kind].name}</span>
      </span>
    </label>`,
).join('')

function syncForm() {
  form.querySelectorAll<HTMLInputElement>('input[name="pet"]').forEach((input) => {
    input.checked = input.value === settings.pet
  })
  form.querySelectorAll<HTMLInputElement>('input[name="hour12"]').forEach((input) => {
    input.checked = input.value === String(settings.hour12)
  })
  form.querySelector<HTMLInputElement>('input[name="showDate"]')!.checked = settings.showDate
}

// 바꾸는 즉시 저장·적용한다 (닫으면 바로 반영된 시계가 보인다)
form.addEventListener('change', () => {
  const data = new FormData(form)
  const petValue = data.get('pet')
  settings = {
    pet: isPetKind(petValue) ? petValue : settings.pet,
    hour12: data.get('hour12') === 'true',
    showDate: data.get('showDate') === 'on',
  }
  saveSettings(settings)
  applySettings()
})

openBtn.addEventListener('click', () => {
  syncForm()
  dialog.showModal()
})
$('close-settings').addEventListener('click', () => dialog.close())
// 일부 브라우저는 닫힌 뒤 포커스를 되돌려주지 않아 직접 돌려준다
dialog.addEventListener('close', () => openBtn.focus())

applySettings()
restart()
