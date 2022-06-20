import { useEffect, RefObject } from 'react'

type Event = MouseEvent | TouchEvent

export const useOnClickOutside = (
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (event: Event) => void,
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (Array.isArray(ref)) {
        if (ref.some((_ref) => _ref.current?.contains(event.target as Node))) {
          return
        }
        handler(event)
      } else {
        const el = ref.current
        if (!el || el.contains(event.target as Node)) {
          return
        }
        handler(event)
      }
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
