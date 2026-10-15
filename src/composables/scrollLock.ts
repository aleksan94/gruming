import { onBeforeUnmount } from 'vue'

// Счётчик нужен, чтобы меню и модалка не снимали блокировку друг у друга
let locks = 0
let savedY = 0

function apply() {
  const { body, documentElement: html } = document
  savedY = window.scrollY
  const scrollbar = window.innerWidth - html.clientWidth
  // position: fixed — единственный способ, который надёжно работает на iOS Safari
  body.style.position = 'fixed'
  body.style.top = `-${savedY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.paddingRight = scrollbar ? `${scrollbar}px` : ''
  html.style.scrollBehavior = 'auto'
}

function release() {
  const { body, documentElement: html } = document
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.paddingRight = ''
  window.scrollTo(0, savedY)
  html.style.scrollBehavior = ''
}

export function useScrollLock() {
  let mine = false

  function lock() {
    if (mine) return
    mine = true
    if (locks++ === 0) apply()
  }

  function unlock() {
    if (!mine) return
    mine = false
    if (--locks === 0) release()
  }

  onBeforeUnmount(unlock)

  return { lock, unlock }
}
