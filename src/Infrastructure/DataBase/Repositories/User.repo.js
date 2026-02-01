/* eslint-disable prettier/prettier */
//====== User Repository =======
import { UserDomain } from '../../../Domain/Entities/User.domain.js'
import { User as UserModel } from '../models/User.model.js'

export class UserRepo {
  async save(userDomain) {
    const persistenceData = {
      userId: userDomain.userId,
      name: userDomain.name,
      username: userDomain.username,
      email: userDomain.email.value,
      password: userDomain.password.value,
      role: userDomain.role,
      verified: userDomain.verified,
      createdAt: userDomain.createdAt,
      updatedAt: userDomain.updatedAt
    }
    await UserModel.findOneAndUpdate({ userId: persistenceData.userId }, persistenceData, {
      upsert: true,
      new: true
    })
  }
  async findByEmail(email) {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
    if (!doc) {
      return null
    }
    return new UserDomain(
      doc.name,
      doc.username,
      doc.email,
      doc.password,
      doc.role,
      doc.verified,
      doc.userId,
      doc.createdAt,
      doc.updatedAt
    )
  }

  async findById(userId) {
    const doc = await UserModel.findOne({ userId: userId })
    if (!doc) {
      return null
    }

    return new UserDomain(
      doc.name,
      doc.username,
      doc.email,
      doc.password,
      doc.role,
      doc.verified,
      doc.userId,
      doc.createdAt,
      doc.updatedAt
    )
  }
  async exists(email) {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() })
    return count > 0
  }
  async existsByUsername(username) {
    const count = await UserModel.countDocuments({ username: username })
    return count > 0
  }
}
