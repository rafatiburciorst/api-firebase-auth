import { Company } from '@/entities/company.js'
import { User } from '@/entities/users.js'
import { authentication } from '@/http/middleware/authentication.js'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'

export async function saveCompany(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .post(
      '/save-companies',
      {
        schema: {
          body: z.object({
            logo: z.string(),
            cpfCnpj: z.string(),
            razaoSocial: z.string(),
            nomeFanasia: z.string(),
            telefone: z.string(),
            horarioDeFuncionamento: z.string(),
            endereco: z.string(),
            localizacao: z.string(),
            taxaDeEntrega: z.string(),
            ativa: z.boolean().optional(),
          }),
        },
      },
      async (request, reply) => {
        const user = new User({
          id: request.user.id,
          name: request.user.name,
          email: request.user.email,
          password: null,
        })
        const company = Company.create({
          user,
          ...request.body,
        })

        await getFirestore().collection('companies').add(company.toJson())
        reply.status(201).send()
      }
    )
}
