import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './notification.module.scss';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={styles.notification}>
      {message}
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func
};

export default Notification;
