import React from 'react';

import { Img } from 'components/test-img';
import { Title } from 'components/test-title';

import cookie from 'assets/images/download.png';

import styles from './App.module.scss';

const App = () => {
	return (
		<div className={styles.App}>
			<Title>Hello World!</Title>
			<Img src={cookie} />
		</div>
	);
};

export { App };
