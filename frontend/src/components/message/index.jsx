import { useEffect } from 'react';
import PropTypes from 'prop-types';  // Correct import for PropTypes
import styles from './notification.module.scss';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the notification after a few seconds
    }, 3000); // Set the timeout duration (3 seconds)

    return () => clearTimeout(timer); // Cleanup the timer when the component is unmounted
  }, [message, onClose]);

  return (
    <div className={styles.notification}>
      {message}
    </div>
  );
};

// Define PropTypes correctly outside the component
Notification.propTypes = {
  message: PropTypes.string.isRequired,  // message should be a string
  onClose: PropTypes.func.isRequired,    // onClose should be a function
};

export default Notification;
