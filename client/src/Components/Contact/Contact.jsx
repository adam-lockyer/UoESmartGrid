import React from "react";
import styles from "./Contact.module.css";
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';

export const Contact = () => {
	return (
        <div className={styles.hero}>
            <div className={styles.contentSection}>
                <div className={styles.Header}>
                    <h1> Get In Touch </h1>
                </div>
                <div className={styles.ContactMethods}>
                    <div className={styles.Method}>
                        <PlaceIcon className={styles.address}/>
                        <hr className={styles.divider}></hr>
                        <p>University of Exeter</p>
                        <p>Stocker Rd, Exeter</p>
                        <p>EX4 4PY</p>
                        <p>Harrison Building</p>
                    </div>
                    <div className={styles.Method}>
                        <EmailIcon className={styles.email}/>
                        <hr className={styles.divider}></hr>
                        <p>Adam Lockyer:</p>
                        <p>al657@exeter.ac.uk</p>
                        <hr className={styles.divider}></hr>
                        <p>Baris Yuce:</p>
                        <p>Baris.Yuce@exeter.ac.uk</p>
                    </div>
                    <div className={styles.Method}>
                        <PhoneEnabledIcon className={styles.phone}/>
                        <hr className={styles.divider}></hr>
                        <p>Adam Lockyer:</p>
                        <p>07343453453</p>
                        <hr className={styles.divider}></hr>
                        <p>Baris Yuce:</p>
                        <p>07343453453</p>
                    </div>
                </div>
            </div>
        </div>
	);
};

export default Contact;