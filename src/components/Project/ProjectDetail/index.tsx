import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BlurBlobs from "components/BlurBlobs"
import { getAccessToken } from "utils/authFn";
import { RootState } from 'reducers';
import NavBar from "components/NavBar";
import { ReactComponent as DollarIcon } from 'assets/illustrations/icons/dollar.svg';
import { ReactComponent as TimeLineIcon } from 'assets/illustrations/icons/timeline.svg';
import { ReactComponent as TimeZoneIcon } from 'assets/illustrations/icons/timezone.svg';
import { ReactComponent as UserIcon } from 'assets/illustrations/icons/user.svg';
import styles from './index.module.scss';
import OpenTasks from "./OpenTasks";
import AssignedTasks from "./AssignedTasks";
import InProgressTasks from "./InProgressTasks";
import CompletedTasks from "./CompletedTasks";
import PublishProjectModal from "./PublishProjectModal";
import useProject from "./hooks";


const ProjectDetail = () => {

    const { getUSDCBalance } = useProject();

    const [open, setOpen] = useState(false);

    const { user, wallet_usdc_balance } = useSelector((state: RootState) => state.user);
    const { usdcBalance } = useSelector((state: RootState) => state.profile);
    const accessToken = getAccessToken();

    useEffect(() => {
        if (user?.userId && accessToken) {
            getUSDCBalance();
        }
    }, [user])

    return (
        <div className={styles.container}>
            <BlurBlobs />
            <NavBar usdcBalance={usdcBalance} />
            <div className={styles['project-content-container']}>
                <div className={styles.title}>
                    <h1>NFT Website</h1>
                    <h4>Axie Infinity</h4>
                    <button onClick={() => setOpen(true)}>Publish a Project</button>
                </div>
                <div className={styles.description}>
                    <h3>Company Description</h3>
                    <div className={styles.row}>
                        <div className={styles['description-left']}>
                            <div className={styles['description-text']}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Magna eget est lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Magna eget est lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Magna eget est lorem ipsum dolor sit amet. Lorem ipsum dolor sit .
                            </div>
                        </div>
                        <div className={styles['description-right']}>
                            <div className={styles['description-data']}>
                                <div>
                                    <DollarIcon width={22} height={22} />&emsp;Budget: 15,000 USDC
                                </div>
                                <div>
                                    <TimeLineIcon width={22} height={22} />&emsp;Timeline: 3 months
                                </div>
                                <div>
                                    <TimeZoneIcon width={22} height={22} />&emsp;Preferred Timezones: SGT
                                </div>
                                <div>
                                    <UserIcon width={22} height={22} />&emsp;Looking for: Designer, Developer
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.task}>
                    <div className={styles['task-topbar']}>
                        <h3>Tasks</h3>
                        <div className={styles.flex}>
                            <button className={styles.filter}>Filter</button>
                            <button className={styles.addTask}>Add Task</button>
                        </div>
                    </div>
                    <hr style={{ margin: '1.5rem 0' }} />

                    <OpenTasks />
                    <AssignedTasks />
                    <InProgressTasks />
                    <CompletedTasks />
                </div>
            </div>
            {
                open && <PublishProjectModal setOpen={(val) => setOpen(val)} usdcBalance={wallet_usdc_balance} />
            }
        </div>
    )
}

export default ProjectDetail