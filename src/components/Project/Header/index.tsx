import { FC } from 'react';
import styles from './index.module.scss';
// create interface to receive data
interface HeaderProps {
  projectName: string;
  founderName: string;
}
const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const { projectName, founderName } = props;
  return (
    <div className={styles.container}>
      <h1>{projectName}</h1>
      <h3>{founderName}</h3>
      <button>Publish a Project</button>
    </div>
  );
};

export default Header;
