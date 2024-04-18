import { useEffect, useState } from 'react'
import { emailService } from '../../services/email.service'
import styles from './EmailList.module.scss'
import { useQuery } from '@tanstack/react-query'
import parse from 'html-react-parser'
import { Slice } from 'lucide-react'

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
  const [activeCount, setActiveCount] = useState(0); 

  useEffect(() => {
    if (data) {
      const newDisappearTimes: Record<string, Date> = {};
      data.forEach(email => {
        const emailDateTime = new Date(email.date);
        const disappearTime = new Date(emailDateTime.getTime() + 10 * 60000);
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
        if (currentTime >= disappearTimes[key]) {
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
  const activeData = sortedData?.filter(email => {
    const emailDateTime = new Date(parseDate(email.date));
    return new Date() < emailDateTime;
  }) || [];

  useEffect(() => {
    setActiveCount(activeData.length);
  }, [activeData]);

  return (
    <div className={styles.list}>
      <h2>Очередь ({activeCount} активных)</h2>
      {activeData.map((email, index) => {
        const emailDateTime = new Date(parseDate(email.date));
        const currentTime = new Date();
        const isPast = currentTime >= emailDateTime;
        const shouldDisappear = !disappearTimes.hasOwnProperty(email.name);

        return (
          !shouldDisappear && (
            <div key={email.id} style={{
              border: isPast ? '1px solid red' : '1px solid inherit',
              color: email.priority === "1" ? 'orange' : 'none'
            }}>
              Номер: {index + 1}
              <h4>Цель визита: {parse(email.task)}</h4>
              Пациент: {parse(email.name)}
              <div></div>
              Врач: {parse(email.doctor)}
              <div></div>
              Дата: {parse(email.date)}
              <div></div>
              Кабинет: {parse(email.cab)}
            </div>
          )
        );
      })}
    </div>
  );
}