import axios from "axios"
import { IEmail } from '../pages/home/types'

class EmailService {

    private URL = 'http://localhost:3000/emails'

    async getEmails(){
        const { data } = await axios.get<IEmail[]>(this.URL)
        return data
    }
    async addEmails(name: string, task: string, doctor: string, cab: string, date: string, priority: string){
        const { data } = await axios.post(this.URL, {
             task,
             name,
             doctor,
             cab,
             date,
             priority
        })
        return data
    }
}

export const emailService = new EmailService()