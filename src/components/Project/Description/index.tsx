import { FC } from 'react';
import clsx from 'clsx';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { ReactComponent as SmartContractIcon } from 'assets/illustrations/icons/project-smart-contract.svg';
import { ReactComponent as TimelineIcon } from 'assets/illustrations/icons/project-timeline.svg';
import { ReactComponent as BalanceIcon } from 'assets/illustrations/icons/project-balance.svg';
import { ReactComponent as TimezoneIcon } from 'assets/illustrations/icons/project-timezone.svg';
import { ReactComponent as MoneyIcon } from 'assets/illustrations/icons/money.svg';
import { ReactComponent as ResourceIcon } from 'assets/illustrations/icons/resource.svg';
import styles from './index.module.scss';

interface DescriptionProps {
  description: string;
  budget: number;
  timeOfCompletion: string;
  preferredTimeZones: string;
  flResources: any[];
}

const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
  const {
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flResources,
  } = props;

  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const end = new Date(timeOfCompletion);
  const formattedEndDate = end.toLocaleDateString('en-GB');
  const flResourcesStringJoined = flResources
    ?.map(resource => resource.title)
    .join(', ');

  const getSmartContractAddress = () => {
    if (selectedProjectAddress) {
      return `${selectedProjectAddress.slice(
        0,
        6
      )}...${selectedProjectAddress.slice(selectedProjectAddress.length - 6)}`;
    }

    return 'Not published';
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.projectDetails}>
          <h4>Project info</h4>

          <div className={styles.row}>
            <div>
              <SmartContractIcon width={17} height={22} />
              <span className={styles['row-label']}>
                Smart Contract id: &nbsp;
                <span
                  className={clsx(
                    styles['row-value'],
                    styles['smart-contract-value']
                  )}
                >
                  {getSmartContractAddress()}
                </span>{' '}
                &nbsp;
                {selectedProjectAddress && (
                  <a
                    href={`${config.explorerURL}/address/${selectedProjectAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="material-icons">open_in_new</i>
                  </a>
                )}
              </span>
            </div>
            <div>
              <TimelineIcon width={19} height={17} />
              <span className={styles['row-label']}>
                Timeline: &nbsp;
                <span className={styles['row-value']} title={formattedEndDate}>
                  {formattedEndDate}
                </span>
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <BalanceIcon width={19} height={19} />
              <span className={styles['row-label']}>
                Project Fund Balance: &nbsp;
                <span
                  className={styles['row-value']}
                  title={`${(Number(budget) * 1.1).toFixed(2)} USDC`}
                >
                  {(Number(budget) * 1.1).toFixed(2)} USDC
                </span>
              </span>
            </div>
            <div>
              <TimezoneIcon width={19} height={19} />
              <span className={styles['row-label']} title={preferredTimeZones}>
                Timezones: &nbsp;
                <span className={styles['row-value']}>
                  {preferredTimeZones}
                </span>
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <MoneyIcon width={19} height={19} />
              <span className={styles['row-label']} title={`${budget} USDC`}>
                Budget: &nbsp;
                <span className={styles['row-value']}>{budget} USDC</span>
              </span>
            </div>
            <div>
              <ResourceIcon width={19} height={19} />
              <span className={styles['row-label']}>
                Looking for: &nbsp;
                <span
                  className={styles['row-value']}
                  title={flResourcesStringJoined}
                >
                  {flResourcesStringJoined}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.projectDescription}>
          <h4>Project Details</h4>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Description;
