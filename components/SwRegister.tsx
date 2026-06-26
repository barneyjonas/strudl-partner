'use client'
import { useEffect } from 'react'

export default function SwRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/strudl-partner/sw.js')
    }
  }, [])
  return null
}
