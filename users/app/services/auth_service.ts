import ResetPassword from '#events/reset_password';
import UserRegistered from '#events/user_registered';
import User from '#models/user'
import { DateTime } from 'luxon';
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core';
import type { Response } from '@adonisjs/core/http'

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
}

type ForgotPasswordPayload = {
    email: string;
}

@inject()
export default class AuthService {
    constructor(protected ctx: HttpContext) {}

    async authenticate(email: string, password: string): Promise<User>
    {
      return await User.verifyCredentials(email, password)
    }
    
    async generateAccessToken(user: User): Promise<Response | { type: string; token: string; expiresIn: string|number|undefined }>
    {

      return await this.ctx.auth.use('jwt').generate(user)
    }
    
    async registration(payload: RegisterPayload): Promise<User>
    {
      const user = await User.create(payload)
      UserRegistered.dispatch(user);
      return user
    }
    
    async findUnverifiedUserById(id: number): Promise<User>
    {
      return await User.query().where('id', id).whereNull('email_verified_at').firstOrFail();
    }
    
    async findUserByIdAndEmail(id: number, email: string): Promise<User>
    {
      return await User.query().where('id', id).where('email', email).firstOrFail();
    }
    
    async findByEmail(email: string): Promise<User>
    {
      return await User.query().where('email', email).firstOrFail();
    }

    async forgotPassword(payload: ForgotPasswordPayload): Promise<void>
    {
      const user = await this.findByEmail(payload.email)
      ResetPassword.dispatch(user);
    }
    
    async verifyUser(user: User): Promise<void>
    {
        await user.merge({ emailVerifiedAt: DateTime.local() }).save()
    }
    
    async resetPassword(user: User, password: string): Promise<void>
    {
        await user.merge({ password }).save()
    }
  }