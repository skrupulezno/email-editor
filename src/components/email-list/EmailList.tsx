import { emailService } from '../../services/email.service'
import styles from './EmailList.module.scss'
import { useQuery } from '@tanstack/react-query'
import MarkdownPreview from '@uiw/react-markdown-preview';

export function EmailList() {
    const { data } = useQuery({
        queryKey: ['email list'],
        queryFn: () => emailService.getEmails()
    })
  return (
    <div className={styles.list}>
        {data?.map(email => (
          <div key={email.id}>
             <MarkdownPreview source={email.text} className={styles.preview} />
          </div>
        ))}
    </div>
  )
}