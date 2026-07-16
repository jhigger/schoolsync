import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    const item = localStorage.getItem(key)
    if (item) {
      setStoredValue(item as unknown as T)
    }
  }, [key])

  const setValue = (value: T) => {
    setStoredValue(value)
    localStorage.setItem(key, String(value))
  }

  return [storedValue, setValue] as const
}
