import { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import Modal from "components/Modal";
import styles from './index.module.scss';
import TaskDetail from "./TaskDetail";
import TalentList from "./TalentList";
import { useFetchTaskData } from "./hooks";

interface IAcceptTask {
    setOpen: Dispatch<SetStateAction<boolean>>;
    data: any,
    handleApprove: any;
    selected: boolean;
    selectedBuilder: any;
    project_budget: number;
    project_name: string;
}

const AcceptTask: FC<IAcceptTask> = ({ setOpen, data, handleApprove, selected, selectedBuilder, project_budget, project_name }) => {

    const { taskData } = useFetchTaskData(data?.taskId);
    const [viewTalentList, setViewTalentList] = useState(false);
    const [task, setTask] = useState<any>(null);

    useEffect(() => {
        if (taskData) {
            console.log(">>>>>>>>>>>", taskData);
            setTask(taskData);
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
                <h2 className={styles['project-name']}>{task?.name}</h2>
                <h5 className={styles['founder-name']}>{task?.organisation?.name}</h5>
                {
                    viewTalentList ?
                        <TalentList
                            setViewTalentList={setViewTalentList}
                            handleApprove={handleApprove}
                            selected={selected}
                            acceptedBuilder={selectedBuilder}
                            project_budget={project_budget}
                        /> : <TaskDetail
                            data={task}
                            setViewTalentList={setViewTalentList}
                            selected={selected}
                            selectedBuilder={selectedBuilder}
                            project_name={project_name}
                        />
                }
            </div>
        </Modal>
    )
}

export default AcceptTask;