import { Dispatch, FC, SetStateAction } from 'react';
import styles from './index.module.scss';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectAddress: string,
  budget: number,
  projectName: string;
  founderName: string;
}

const Header: FC<IHeaderProps> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <h1>{props.projectName}</h1>
        <h3>{props.founderName}</h3>
        {
          props.projectAddress === '' && (
            <button onClick={() => props.setOpen(true)}>Publish a Project</button>
          )
        }
        {
          props.projectAddress !== '' && props.budget !== 0 && <h3>{props.budget} USDC</h3>
        }
        {
          props.projectAddress !== '' && (
            <h5>&emsp;Smart Contract Id: {props.projectAddress.slice(0, 6)}...{props.projectAddress.slice(props.projectAddress.length - 5, props.projectAddress.length)}</h5>
          )
        }
      </div>
    </>
  );
};

export default Header;
