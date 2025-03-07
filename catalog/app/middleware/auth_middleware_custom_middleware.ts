import UnAuthorizedException from '#exceptions/un_authorized_exception'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import axios, { AxiosResponse } from 'axios'
import Env from '#start/env'

type AuthUser = {
  id: number,
  email: string,
  name: string|null,
  emailVerifiedAt: string|null,
  createdAt: string|null,
  updatedAt: string|null
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
      auth: AuthUser
  }
}

export default class AuthMiddlewareCustomMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const PROFILE_VERIFY_URL = Env.get('PROFILE_VERIFY_URL')

    /**
     * Ensure the auth header exists
     */
    const authHeader = ctx.request.header('authorization')
    if (!authHeader) {
      throw new UnAuthorizedException('Unauthorized access')
    }

    /**
     * Split the header value and read the token from it
     */
    const [, token] = authHeader.split('Bearer ')
    if (!token) {
      throw new UnAuthorizedException('Unauthorized access')
    }

    /**
     * Verify token
     */
    try {
      const payload = await axios.get<AxiosResponse<AuthUser>>(PROFILE_VERIFY_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.data.data);
      ctx.auth = payload;
    } catch (error) {
      throw new UnAuthorizedException('Unauthorized access')
    }


    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}