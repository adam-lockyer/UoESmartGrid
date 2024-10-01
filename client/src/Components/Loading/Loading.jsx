import React from 'react';
import styles from './Loading.module.css';

const LoadingLarge = () => {
	return (
	  <div
		style={{
		  display: 'flex',
		  justifyContent: 'center',
		  alignItems: 'center',
		}}
	  >
		<span className={styles.loaderLarge}></span>
	  </div>
	);
  };
  
  const LoadingSmall = () => {
	return (
	  <div
		style={{
		  display: 'flex',
		  justifyContent: 'center',
		  alignItems: 'center',
		}}
	  >
		<span className={styles.loaderSmall}></span>
	  </div>
	);
  };

const Loading = ({ size = 'large' }) => {
  return size === 'large' ? <LoadingLarge /> : <LoadingSmall />;
};

export default Loading;