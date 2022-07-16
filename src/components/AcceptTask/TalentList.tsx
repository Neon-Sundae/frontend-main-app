import { FC, Dispatch, SetStateAction, useState, useEffect } from 'react';
import styles from './index.module.scss';
import TalentListItem from './TalentListItem';

interface ITalentList {
    setViewTalentList: Dispatch<SetStateAction<boolean>>;
    handleApprove: any;
    selected: boolean;
    acceptedBuilder: IData;
    project_budget: number;
}

interface IData {
    talentId: number;
    name: string,
    position: string;
    walletId: string;
}

const talentList = [
    { talentId: 1, name: 'Mary Jane', position: 'Designer', walletId: '0x99f532b2211Bf8616bC446eF2FD589973E2a821E' },
    { talentId: 2, name: 'Emily Addison', position: 'UX/UI Designer', walletId: '0x99f532b2211Bf8616bC446eF2FD589973E2a821E' },
    { talentId: 3, name: 'Randy Moore', position: 'Designer', walletId: '0x99f532b2211Bf8616bC446eF2FD589973E2a821E' },
    { talentId: 4, name: 'Jack Jonson', position: 'UX Designer', walletId: '0x99f532b2211Bf8616bC446eF2FD589973E2a821E' },
    { talentId: 5, name: 'Blake Blade', position: 'Designer', walletId: '0x99f532b2211Bf8616bC446eF2FD589973E2a821E' },
]

const TalentList: FC<ITalentList> = ({ setViewTalentList, handleApprove, selected, acceptedBuilder, project_budget }) => {

    const [selectedBuilder, setSelectedBuilder] = useState<IData>(talentList[0]);
    const [appliedBuilder, setAppliedBuilder] = useState(talentList);

    useEffect(() => {
        if (selected && acceptedBuilder !== null) {
            setSelectedBuilder(talentList.filter((item: IData) => item.talentId === acceptedBuilder.talentId)[0]);
            setAppliedBuilder(talentList.filter((item: IData) => item.talentId !== acceptedBuilder.talentId));
        }
    }, [selected, acceptedBuilder]);

    return (
        <div className={styles['talent-list-container']}>
            {
                selected && acceptedBuilder !== null && (
                    <>
                        <h3>Talent working on task</h3>
                        <TalentListItem handleApprove={handleApprove} selected={selected} data={selectedBuilder} />
                    </>
                )
            }
            <h3>Talent Applied</h3>
            {
                appliedBuilder.map((builder: IData, index: number) => (
                    <TalentListItem
                        key={index}
                        handleApprove={handleApprove}
                        selected={selected}
                        data={builder}
                    />
                ))
            }
            <button className={styles['btn-back']} onClick={() => setViewTalentList(false)}>Back</button>
        </div>
    )
}

export default TalentList