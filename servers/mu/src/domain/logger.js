import debug from 'debug'
import { tap } from 'ramda'

export const createLogger = (name) => {
  const logger = debug(name)

  logger.child = (name) => createLogger(`${logger.namespace}:${name}`)
  logger.tap = (note, ...rest) =>
    tap((...args) => logger(note, ...rest, ...args))

  return logger
}

export default createLogger
