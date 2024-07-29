function metricsMessageHandler (payload, gauge) {
  if (payload.action === 'enqueue') {
    gauge.inc()
  }
  if (payload.action === 'dequeue') {
    gauge.dec()
  }
}

/*
 * logs coming from the worker end up here and
 * get passed to the main thread logger.
 */
function logMessageHandler (payload, logger) {
  let { namespace, message, args } = payload

  // Set default namespace if undefined
  namespace = namespace || 'default'
  const loggerNamespace = logger.namespace

  // Check if the payload namespace matches the logger's namespace
  let logFunction
  if (namespace === loggerNamespace) {
    logFunction = logger
  } else {
    const childNamespace = namespace.split(':').pop()
    logFunction = logger.child(childNamespace)
  }

  logFunction(message, ...args)
}

export function handleWorkerQueueMessage ({ queueGauge, logger }) {
  return ({ payload }) => {
    if (payload.purpose === 'metrics') {
      metricsMessageHandler(payload, queueGauge)
    } else if (payload.purpose === 'log') {
      logMessageHandler(payload, logger)
    }
  }
}
