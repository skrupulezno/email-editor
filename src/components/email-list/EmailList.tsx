import { emailService } from '../../services/email.service'
import styles from './EmailList.module.scss'
import { useQuery } from 'react-query'

export function EmailList() {
    const { data } = useQuery({
        queryKey: ['email list'],
        queryFn: () => emailService.getEmails()
    })
  return (
    <div className={styles.list}>
        {data?.map(email => (
            <div key={email.text}>{email.text}</div>
        ))}
    </div>
  )
}