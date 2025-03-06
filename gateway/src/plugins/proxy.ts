import fp from 'fastify-plugin'
import proxy, { FastifyHttpProxyOptions } from '@fastify/http-proxy'

/**
 * This plugins adds some utilities to handle proxy
 *
 * @see https://github.com/fastify/fastify-http-proxy
 */
export default fp<FastifyHttpProxyOptions>(async (fastify) => {
  fastify.register(proxy, {
    upstream: 'http://localhost:3001',
    prefix: '/api/auth', // optional
    rewritePrefix: '/api/auth', // optional
    http2: false, // optional
  });
  fastify.register(proxy, {
    upstream: 'http://localhost:3001',
    prefix: '/api/account', // optional
    rewritePrefix: '/api/account', // optional
    http2: false, // optional
  });
})
