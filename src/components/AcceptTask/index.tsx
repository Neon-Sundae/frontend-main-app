import { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import Modal from "components/Modal";
import styles from './index.module.scss';
import TaskDetail from "./TaskDetail";
import TalentList from "./TalentList";
import { useFetchTaskData } from "./hooks";
import { useDispatch } from "react-redux";
import { GET_SELECTED_TASK } from "actions/flProject/types";
import { useSelector } from "react-redux";
import { RootState } from "reducers";

interface IAcceptTask {
    setOpen: Dispatch<SetStateAction<boolean>>;
    taskId: number,
    handleApprove: any;
    selected: boolean;
    selectedBuilder: any;
    project_budget: number;
    project_name: string;
    handleCommit: any
}

const AcceptTask: FC<IAcceptTask> = ({ setOpen, taskId, handleApprove, project_name, handleCommit }) => {

    const dispatch = useDispatch();

    const { taskData } = useFetchTaskData(taskId);
    const [viewTalentList, setViewTalentList] = useState(false);

    const { selectedTask } = useSelector((state: RootState) => state.flProject);

    useEffect(() => {
        if (taskData) {
            console.log(">>>>>>>>>>>", taskData);
            dispatch({
                type: GET_SELECTED_TASK,
                payload: taskData
            })
        }
    }, [taskData]);

    const handleClose = () => setOpen(false);

    return (
        <Modal
            onClose={handleClose}
            width="clamp(20rem, 45vw, 45rem)"
            maxHeight="min(90%, 45rem)"
            overflowY="auto">
            <div className={styles['assign-task-container']}>
                <h2 className={styles['project-name']}>{selectedTask?.name}</h2>
                <h5 className={styles['founder-name']}>{selectedTask?.organisation?.name}</h5>
                {
                    viewTalentList ?
                        <TalentList
                            setViewTalentList={setViewTalentList}
                            handleApprove={handleApprove}
                        /> : <TaskDetail
                            setViewTalentList={setViewTalentList}
                            project_name={project_name}
                            handleCommit={handleCommit}
                        />
                }
            </div>
        </Modal>
    )
}

export default AcceptTask;