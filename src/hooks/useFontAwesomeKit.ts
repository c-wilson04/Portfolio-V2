import { useEffect } from "react"

export function useFontAwesomeKit() {
  useEffect(() => {
    if (!document.body || document.querySelector('script[data-kit="font-awesome"]')) {
      return
    }
    const script = document.createElement("script")
    script.setAttribute("data-kit", "font-awesome")
    script.src = "https://kit.fontawesome.com/83c7baee1c.js"
    script.crossOrigin = "anonymous"
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body && document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])
}

