import { FC, Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import TalentListItem from './TalentListItem';

interface ITalentList {
  setViewTalentList: Dispatch<SetStateAction<boolean>>;
  handleApprove: any;
}

const TalentList: FC<ITalentList> = ({ setViewTalentList, handleApprove }) => {
  const { selectedTask } = useSelector((state: RootState) => state.flProject);
  return (
    <div className={styles['talent-list-container']}>
      {selectedTask?.status !== 'open' &&
        selectedTask?.profileTask.filter(
          (profile: any) => profile?.applicationStatus === 'accepted'
        ).length > 0 &&
        selectedTask?.profileTask
          .filter((profile: any) => profile?.applicationStatus === 'accepted')
          .map((item: any, index: number) => (
            <>
              <h3>Talent working on task</h3>
              <TalentListItem
                handleApprove={handleApprove}
                task_status={selectedTask?.status}
                taskId={selectedTask?.taskId}
                data={item}
              />
            </>
          ))}
      <h3>Talent Applied</h3>
      {selectedTask?.profileTask
        .filter((profile: any) => profile.applicationStatus !== 'accepted')
        .map((item: any, index: number) => (
          <TalentListItem
            key={index}
            handleApprove={handleApprove}
            task_status={selectedTask?.status}
            taskId={selectedTask?.taskId}
            data={item}
          />
        ))}
      <button
        className={styles['btn-back']}
        onClick={() => setViewTalentList(false)}
      >
        BACK
      </button>
    </div>
  );
};

export default TalentList;
