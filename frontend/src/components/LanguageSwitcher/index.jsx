import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './languageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={i18n.language === 'en' ? styles.active : ''}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={i18n.language === 'pl' ? styles.active : ''}
        onClick={() => i18n.changeLanguage('pl')}
      >
        PL
      </button>
    </div>
  );
};

export default LanguageSwitcher;