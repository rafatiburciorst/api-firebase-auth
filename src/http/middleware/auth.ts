import { UnauthorizedError } from '@/_errors/unauthorized-error.js'
import { User } from '@/entities/users.js'
import type { FastifyRequest } from 'fastify'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export async function authentication(request: FastifyRequest) {
  const token = request.headers.authorization?.split('Bearer ').at(1)

  if (!token) {
    console.log('TOKEN', token)
    throw new UnauthorizedError()
  }

  try {
    const decodedIdToken = await getAuth().verifyIdToken(token, true)

    const doc = await getFirestore()
      .collection('users')
      .doc(decodedIdToken.uid)
      .get()
    const data = doc.data() as { name: string; email: string }

    if (!data) {
      throw new UnauthorizedError()
    }

    const user = new User({
      id: doc.id,
      name: data.name,
      email: data.email,
    })

    request.user = user
  } catch (error) {
    throw new UnauthorizedError()
  }
}
