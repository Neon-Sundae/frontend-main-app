import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import styles from './index.module.scss';

interface ITalentListItem {
    handleApprove: any;
    selected: boolean;
    data: IData;
}

interface IData {
    talentId: number;
    name: string,
    position: string;
    walletId: string;
}

const TalentListItem: FC<ITalentListItem> = ({ handleApprove, selected, data }) => {

    const { founder } = useSelector((state: RootState) => state.flProject);
    const walletId = useSelector((state: RootState) => state.user.user?.walletId);

    return (
        <div className={styles['talent-list-item-container']}>
            <div className={styles['builder']}>
                <div className={styles['builder-avatar']}></div>
                <div className={styles['builder-name']}>{data?.name}</div>
            </div>
            <div className={styles['builder-position']}>{data?.position}</div>
            <div className={styles['action']}>
                {
                    !selected && walletId?.toLowerCase() === founder.toLowerCase() && (
                        <>
                            <span className={styles['btn-approve']} onClick={() => handleApprove(data)}>Approve</span>
                            <span className={styles['btn-reject']}>Reject</span>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default TalentListItem;