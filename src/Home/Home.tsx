import { Div } from '../styleComponent/styleComponent';
import Jobs from './Jobs';
import styles from './home.module.scss';
export default function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.box}>
                <Jobs />
            </div>
            {/* <div className={styles.box}>success Job seeker</div>
            <div className={styles.box}>The top Candidates have the highest point</div> */}
            <div className={styles.box}>4</div>
        </div>
    );
}
