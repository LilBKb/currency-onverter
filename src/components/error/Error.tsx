import Alert from "antd/es/alert/Alert";
import styles from './error.module.css'

interface ErrorProps {
    onClose: () => void;
    description: string;
}

const Error = ({ onClose, description }: ErrorProps) => {
    return(
        <Alert
        className={styles.root}
        message='Error'
        type='error'
        closable
        onClose={onClose}
        description={description}
        />
    )
}


export default Error;