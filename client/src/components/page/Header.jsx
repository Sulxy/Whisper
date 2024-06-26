import { Helmet } from 'react-helmet';
import { PageMenu, LanguageSwitcher, ThemeSwitcher } from '../index.js';

export default function Header() {
	return (
		<header className="page-header">
			<h1 className="page-header__item page-header__title">Whisper</h1>
			<PageMenu/>
			<div className="page-header__settings">
				<LanguageSwitcher/>
				<ThemeSwitcher/>
			</div>
		</header>
	);
}
