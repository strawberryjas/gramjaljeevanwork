/**
 * Sentry Error Monitoring Setup
 * Captures frontend errors and sends to Sentry dashboard for monitoring.
 * Only initialized if SENTRY_DSN is provided.
 */

const SENTRY_DSN = process.env.VITE_SENTRY_DSN || null
const ENVIRONMENT = process.env.VITE_APP_ENV || 'development'
const RELEASE_VERSION = process.env.VITE_APP_VERSION || '1.0.0'

/**
 * Initialize Sentry (async to avoid blocking app)
 * Only loads Sentry library if DSN is configured
 */
export const initSentry = async () => {
  if (!SENTRY_DSN) {
    console.log('Sentry DSN not configured, error monitoring disabled')
    return null
  }

  try {
    // Dynamically import Sentry only when needed
    const Sentry = await import('@sentry/react')

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENVIRONMENT,
      release: RELEASE_VERSION,
      tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        // Filter out certain errors
        if (event.exception) {
          const error = hint.originalException
          // Ignore network errors in offline mode
          if (
            error.message &&
            (error.message.includes('Network') || error.message.includes('offline'))
          ) {
            return null
          }
        }
        return event
      },
      integrations: [
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      replaySessionSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
      replayOnErrorSampleRate: 1.0,
    })

    console.log('Sentry initialized successfully')
    return Sentry
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
    return null
  }
}

/**
 * Capture user action for analytics
 */
export const captureUserAction = (action, metadata = {}) => {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage(`User Action: ${action}`, 'info', {
      extra: metadata,
    })
  }
}

/**
 * Set user context for Sentry
 */
export const setSentryUser = (userId, email = null, username = null) => {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.setUser({
      id: userId,
      email,
      username,
    })
  }
}

/**
 * Clear user context
 */
export const clearSentryUser = () => {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.setUser(null)
  }
}

/**
 * Capture breadcrumb for debugging
 */
export const captureBreadcrumb = (message, category = 'custom', level = 'info') => {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage(message, level, { contexts: { breadcrumb: { category } } })
  }
}

export default {
  initSentry,
  captureUserAction,
  setSentryUser,
  clearSentryUser,
  captureBreadcrumb,
}
