import { Sex } from './enum'

export default interface IQTArchiv{
    hashedGuid:string,
      lastName: string,
      firstName: string,
      email: string,
      phoneNumber: string,
      sex: Sex,
      street: string,
      houseNumber: string,
      zipCode: string,
      city: string,
      birthday: string,
      updatedAt: Date
    }