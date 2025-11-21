import { useEffect } from "react"

export function useFontAwesomeKit() {
  useEffect(() => {
    if (document.querySelector('script[data-kit="font-awesome"]')) {
      return
    }
    const script = document.createElement("script")
    script.setAttribute("data-kit", "font-awesome")
    script.src = "https://kit.fontawesome.com/83c7baee1c.js"
    script.crossOrigin = "anonymous"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
}

