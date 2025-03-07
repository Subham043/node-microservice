/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/product', async (ctx) => {
  return {
    hello: 'world',
    user: ctx.auth
  }
}).prefix('/api').use(middleware.auth())
