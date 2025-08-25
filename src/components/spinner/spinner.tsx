import { Spin } from "antd";
import styles from './spinner.module.css'

interface Props {
    size?: 'small' | 'default' | 'large';
}

const Spinner = ({ size = 'large' }: Props) => {
    return(
            <Spin className={styles.root} size={size}/>

    )
}

export default Spinner;