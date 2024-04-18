import styles from './LifeQueue.module.scss'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { emailService } from '../../services/email.service'

export function LifeQueue() {
  const queryClient = useQueryClient()
  const [task, setTask] = useState('');
  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [cab, setCab] = useState('');
  const [date, setDate] = useState('');

  // Функция для форматирования даты и времени
  const formatDateTime = (dateTimeString: string | number | Date) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  const {mutate, isPending} = useMutation({
    mutationKey: ['create email'],
    mutationFn: () => emailService.addEmails(name, task, doctor, cab, formatDateTime(date), "0"),
    onSuccess() {
      setName('');
      setDoctor('');
      setCab('');
      setDate('');
      setTask('');
      queryClient.refetchQueries({ queryKey: ['email list']})
    },
  })

  return (
    <div>
      <h2>Живая очередь</h2>
      <div className={styles.card}>
        <div className={styles.form}>
        <label className='label'>
            <div>Цель визита</div>
            <input type="text" value={task} onChange={e => setTask(e.target.value)} />
          </label>
          <label className='label'>
            <div>Имя</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
          <label className='label'>
            <div>Доктор</div>
            <input type="text" value={doctor} onChange={e => setDoctor(e.target.value)} />
          </label>
          <label className='label'>
            <div>Кабинет</div>
            <input type="text" value={cab} onChange={e => setCab(e.target.value)} />
          </label>
          <label className='label'>
            <div>Дата и время</div>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>
        <div className={styles.actions}>
          <button disabled={isPending} onClick={() => name ? mutate(): alert("Пожалуйста, заполните все поля.")}>Записаться</button>
        </div>
      </div>
    </div>
  )
}
