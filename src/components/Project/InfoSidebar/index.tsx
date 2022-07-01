import { FC } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx';

const InfoSidebar: FC = () => {
  return (
    <>
      <div
        className={clsx(styles.container, styles.glass)}
        style={{
          backgroundImage: `url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ab65048a-eddc-4cf2-8695-7434353cc38a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220701%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220701T020838Z&X-Amz-Expires=86400&X-Amz-Signature=bdfd5a89939f89d6523293827a3f834288673c97db6bd2b3a8f8fa998f668420&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)`,
          backgroundSize: 'cover',
        }}
      >
        <h1 className={styles.logo}>
          <img
            src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/42ba0ab6-1568-4f72-bfc1-de29b17979df/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220701%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220701T021224Z&X-Amz-Expires=86400&X-Amz-Signature=07dda35abb0b14c7d1d079fe6187f791e37dbe440f4ea5ab3e126a23ee51107a&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject"
            width={35}
            height={35}
          />
        </h1>

        <div className={styles.text}>
          <h1 style={{ fontSize: '42px' }}>$110K+</h1>
          <div className={styles.space}></div>
          <p className={styles.para}>
            earned by talents by <br /> using Founder’s Lab
          </p>
          <br />
          <p>~CoinDesk.com</p>
        </div>
      </div>
    </>
  );
};

export default InfoSidebar;
