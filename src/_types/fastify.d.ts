import type { User } from '@/entities/users.ts'
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }
}
