import React from 'react';
import { settings } from '../config/settings';
import { useTranslation } from 'react-i18next';

export default () => {
	// Use the `useTranslation` hook to access the `t` function
	const { t, i18n } = useTranslation();

	// This function is called when a language is selected from the UI
	const handleLanguageChange = async (language) => {
		// Change language in the i18next instance
		await i18n.changeLanguage(language);
		// Load the new locale after language has been changed
	};

	return (
		<div className="languages">
			<header className="languages__header">{t('languages.title')}</header>
			{/* Loop through the language map */}
			{Object.entries(settings.locale.list).map(([key, flag]) => (
				<span
					onClick={() => handleLanguageChange(flag)}
					className={`languages__flag languages__flag--${flag}`}
					role="img"
					key={key}
					aria-label={t(`languages.aria.${flag}`)}
				>
                </span>
			))}
		</div>
	);
}
