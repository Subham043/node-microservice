import fp from 'fastify-plugin'
import env, { FastifyEnvOptions } from '@fastify/env'

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const options = {
  confKey: 'config', // optional, default: 'config'
  schema: schema,
  // data: data // optional, default: process.env
}

/**
 * This plugins adds some utilities to handle env
 *
 * @see https://github.com/fastify/fastify-env
 */
export default fp<FastifyEnvOptions>(async (fastify) => {
  fastify.register(env, options);
})
