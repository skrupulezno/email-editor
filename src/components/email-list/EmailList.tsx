import { useEffect, useState } from 'react'
import { emailService } from '../../services/email.service'
import styles from './EmailList.module.scss'
import { useQuery } from '@tanstack/react-query'
import parse from 'html-react-parser'

export function EmailList() {
  interface Entry {
    id: string;
    task: string;
    name: string;
    doctor: string;
    cab: string;
    date: string;
    priority: string;
  }

  const { data } = useQuery<Entry[]>({
    queryKey: ['email list'],
    queryFn: () => emailService.getEmails()
  });

  const [disappearTimes, setDisappearTimes] = useState<Record<string, Date>>({});

  useEffect(() => {
    if (data) {
      const newDisappearTimes: Record<string, Date> = {};
      data.forEach(email => {
        const emailDateTime = new Date(email.date);
        const disappearTime = new Date(emailDateTime.getTime() + 10 * 60000); // +10 минут
        newDisappearTimes[email.name] = disappearTime;
      });
      setDisappearTimes(newDisappearTimes);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const updatedDisappearTimes: Record<string, Date> = { ...disappearTimes };
      Object.keys(disappearTimes).forEach(key => {
        if (currentTime > disappearTimes[key]) { // Убираем тех, кто опоздал больше 10 минут
          delete updatedDisappearTimes[key];
        }
      });
      setDisappearTimes(updatedDisappearTimes);
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [disappearTimes]);

  function parseDate(dateStr: string): Date {
    const [date, time] = dateStr.split(' ');
    const [day, month, year] = date.split('.');
    const [hours, minutes] = time.split(':');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hours, 10), parseInt(minutes, 10));
  }

  const sortedData = data?.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  const activeData = sortedData?.filter(email => disappearTimes.hasOwnProperty(email.name)) || [];
  let visibleCount = 0;
  return (
    <div className={styles.list}>
      <h2>Очередь ({activeData.length} активных)</h2>
      {activeData.map((email, index) => {
        const emailDateTime = new Date(parseDate(email.date));
        const currentTime = new Date();
        const timeDiff = (currentTime.getTime() - emailDateTime.getTime()) / 60000;
        const isExactlyLate = timeDiff >= 0 && timeDiff <= 10; 
        if (!isExactlyLate && timeDiff < 10) {
          visibleCount++; 
        }
        return (timeDiff < 10 && (
           <div key={email.id} style={{
            border: isExactlyLate ? '1px solid red' : '1px solid inherit',
            color: email.priority === "1" ? 'orange' : 'none'
          }}>
            Номер: {visibleCount}
            <h4>Цель визита: {parse(email.task)}</h4>
            Пациент: {parse(email.name)}
            <div></div>
            Врач: {parse(email.doctor)}
            <div></div>
            Дата: {parse(email.date)}
            <div></div>
            Кабинет: {parse(email.cab)}
          </div>
        ));
      })}
    </div>
  );
}