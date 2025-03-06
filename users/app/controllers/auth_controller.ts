import type { HttpContext } from '@adonisjs/core/http'
import {
    authRegistrationValidator,
    authLoginValidator,
    authForgotPasswordValidator,
    authResetPasswordValidator
} from '#validators/auth'
import encryption from '@adonisjs/core/services/encryption'
import { inject } from '@adonisjs/core'
import AuthService from '#services/auth_service'

@inject()
export default class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    async login({ request, response }: HttpContext) {
        const { email, password } = await request.validateUsing(authLoginValidator);
        const user = await this.authService.authenticate(email, password)
        const token = await this.authService.generateAccessToken(user)
        return response.ok({
            ...user.serialize(),
            token
        })
    }

    async register({ request, response }: HttpContext) {
        const payload = await request.validateUsing(authRegistrationValidator);
        const user = await this.authService.registration(payload);
        const token = await this.authService.generateAccessToken(user)
        return response.created({
            ...user.serialize(),
            token
        })
    }
    
    async forgotPassword({ request, response }: HttpContext) {
        const payload = await request.validateUsing(authForgotPasswordValidator);
        await this.authService.forgotPassword(payload);
        return response.ok({
            success: true,
            message: 'We have sent a reset password link to your email',
        })
    }

    async verifyEmail({ response, params }: HttpContext) {
        const id = encryption.decrypt(params.id) as number;
        const user = await this.authService.findUnverifiedUserById(id);
        await this.authService.verifyUser(user)
        return response.ok({
            success: true,
            message: 'Email verified successfully',
        })
    }

    async resetPassword({ response, request, params }: HttpContext) {
        const id = encryption.decrypt(params.id) as number;
        const payload = await request.validateUsing(authResetPasswordValidator, {
            meta: { userId: id }
        });
        const user = await this.authService.findUserByIdAndEmail(id, payload.email);
        await this.authService.resetPassword(user, payload.password);
        return response.ok({
            success: true,
            message: 'Password reset successful',
        })
    }
}