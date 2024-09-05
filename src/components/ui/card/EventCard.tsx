import Image from "next/image";
import styles from "./EventCard.module.scss";

export interface EventCardProps {
  title: string;
  date: string;
  image: string;
  price: number;
}

export function EventCard({ title, date, image, price }: EventCardProps) {
  return (
    <div className={styles.card}>
      <Image src={image} alt={title} width={300} height={200} className={styles.image} />
      <div className={styles.content}>
        <h2>{title}</h2>
        <p className={styles.date}>{date}</p>
        <p className={styles.price}>${price}</p>
        <button className={styles.button}>Book Now</button>
      </div>
    </div>
  );
}