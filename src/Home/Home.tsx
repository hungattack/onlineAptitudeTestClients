import { Div } from '../styleComponent/styleComponent';
import Jobs from './Jobs';
export default function Home() {
    return (
        <Div css="height: 92%">
            <Div width="50%" css="background-color: #323232; height: 100%; padding: 10px 20px">
                <Jobs />
            </Div>
            {/* <div className={styles.box}>success Job seeker</div>
            <div className={styles.box}>The top Candidates have the highest point</div> */}
            <Div width="50%" css="background-color: #5281b1; height: 100%">
                4
            </Div>
        </Div>
    );
}
