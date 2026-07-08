export type InAppBrowserInfo = {
  isInApp: boolean
  appName: string | null
}

const IN_APP_UA_RULES: { pattern: RegExp; appName: string }[] = [
  { pattern: /Instagram/i, appName: 'Instagram' },
  { pattern: /FBAN|FBAV|FB_IAB|FBIOS/i, appName: 'Facebook' },
  { pattern: /LinkedInApp/i, appName: 'LinkedIn' },
  { pattern: /Twitter/i, appName: 'X' },
  { pattern: /TikTok|BytedanceWebview/i, appName: 'TikTok' },
  { pattern: /Snapchat/i, appName: 'Snapchat' },
  { pattern: /MicroMessenger/i, appName: 'WeChat' },
  { pattern: /Line\//i, appName: 'Line' },
  { pattern: /Pinterest/i, appName: 'Pinterest' },
  { pattern: /Reddit/i, appName: 'Reddit' },
  { pattern: /Telegram/i, appName: 'Telegram' },
]

export function detectInAppBrowser(userAgent: string): InAppBrowserInfo {
  const match = IN_APP_UA_RULES.find(({ pattern }) => pattern.test(userAgent))
  if (match) {
    return { isInApp: true, appName: match.appName }
  }

  return { isInApp: false, appName: null }
}

export function getInAppBrowserMessage(appName: string | null): string {
  if (appName) {
    return `Prepo can't sign in with Google from the ${appName} app. Please open this page in Safari or Chrome to continue.`
  }

  return "Prepo can't sign in with Google from this in-app browser. Please open this page in Safari or Chrome to continue."
}
