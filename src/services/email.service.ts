import axios from "axios"
import { IEmail } from '../pages/home/types'

class EmailService {

    #URL = 'http://localhost:3000/emails'

    async getEmails(){
        const { data } = await axios.get<IEmail[]>(this.#URL)
        return data
    }
    async addEmails(text: string){
        const { data } = await axios.post(this.#URL, {
             text,
        })
        return data
    }
}

export const emailService = new EmailService()