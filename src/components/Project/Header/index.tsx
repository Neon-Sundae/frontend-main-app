import { Dispatch, FC, SetStateAction } from 'react';
import styles from './index.module.scss';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<IHeaderProps> = (props) => {
  return (
    <div className={styles.container}>
      <h1>Project Name</h1>
      <h3>Founder Name</h3>
      <button onClick={() => props.setOpen(true)}>Publish a Project</button>
    </div>
  );
};

export default Header;
