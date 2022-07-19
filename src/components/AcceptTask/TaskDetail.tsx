import { FC, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import FileAttachmentCard from "./FileAttachmetCard";
import { RootState } from "reducers";
import { ReactComponent as ProjectIcon } from 'assets/illustrations/icons/project.svg';
import { ReactComponent as CategoryIcon } from 'assets/illustrations/icons/category.svg';
import { ReactComponent as LinkIcon } from 'assets/illustrations/icons/link.svg';
import { ReactComponent as CoinIcon } from 'assets/illustrations/icons/coin.svg';
import styles from './index.module.scss';

interface ITaskDetail {
    setViewTalentList: Dispatch<SetStateAction<boolean>>;
    project_name: string;
}

const TaskDetail: FC<ITaskDetail> = ({ setViewTalentList, project_name }) => {

    const { founder, selectedTask } = useSelector((state: RootState) => state.flProject);
    const walletId = useSelector((state: RootState) => state.user.user?.walletId);
    // console.log("<<<<<<<<<<", selectedTask?.profileTask.filter((profile: any) => profile.applicationStatus === 'accepted'))
    return (
        <div>
            <div className={styles['avatar-container']}>
                <button>{selectedTask?.status}</button>
                {
                    selectedTask?.profileTask.length > 0 && <div onClick={() => setViewTalentList(true)}>
                        {
                            selectedTask?.status !== 'open' && selectedTask?.profileTask.filter((profile: any) => profile.applicationStatus === 'accepted').length > 0 ?
                                selectedTask?.profileTask.filter((profile: any) => profile.applicationStatus === 'accepted').map((item: any, index: number) =>
                                    item.Profile.picture !== null ?
                                        <img src="" alt="" key={index} /> :
                                        <div className={styles['builder-avatar']} key={index}></div>
                                ) : (
                                    <>
                                        {
                                            selectedTask?.profileTask.map((item: any, index: number) => item.Profile.picture !== null ?
                                                <img src="" alt="" key={index} /> :
                                                <div className={styles['builder-avatar']} key={index}></div>
                                            )
                                        }
                                    </>
                                )
                        }
                    </div>
                }
            </div>
            <div className={styles['project-details']}>
                <div>
                    <div className={styles['project-detail-item']}>
                        <ProjectIcon width={24} height={24} />
                        <div>Project: {project_name}</div>
                    </div>
                    <div className={styles['project-detail-item']}>
                        <i className='material-icons'>star</i>
                        <div><span>Difficulty:</span>&nbsp;
                            {
                                [0, 1, 2, 3, 4].slice(0, selectedTask?.estimatedDifficulty).map((item: number, index: number) => (
                                    <i className={clsx('material-icons', styles['rating-star'])} key={index}>star</i>
                                ))
                            }
                            {
                                [0, 1, 2, 3, 4].slice(0, 5 - selectedTask?.estimatedDifficulty).map((item: number, index: number) => (
                                    <i className='material-icons' key={index}>star</i>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles['project-detail-item']}>
                        <CategoryIcon width={24} height={24} />
                        <div>Category: {selectedTask?.flProjectCategory?.categoryName}</div>
                    </div>
                    <div className={styles['project-detail-item']}>
                        <i className='material-icons'>attach_money</i>
                        <div>Value: {selectedTask?.price} USDC</div>
                    </div>
                </div>
                <div>
                    <div className={styles['project-detail-item']}>
                        <span>&nbsp;XP</span>
                        <div>Point: 180XP</div>
                    </div>
                    <div className={styles['project-detail-item']}>
                        <i className='material-icons'>local_fire_department</i>
                        <div>Burned: 120 &emsp;<CoinIcon width={20} height={20} /></div>
                    </div>
                </div>
            </div>
            <div className={styles['project-description']}>
                <p>
                    {selectedTask?.description}
                </p>
                {selectedTask?.taskAttachment.length > 0 && <div className={styles['project-attachments']}>
                    {
                        selectedTask?.taskAttachment.map((file: any, index: number) => <FileAttachmentCard key={index} label="Wireframes v1.0" />)
                    }
                </div>}
            </div>
            <div className={styles['project-check-list']}>
                <p>Checklist: </p>
                {
                    selectedTask?.taskChecklist.map((item: any, index: number) => (
                        <p key={index}>
                            <span></span>
                            <div>{item.title}</div>
                            <LinkIcon width={18} height={18} />
                        </p>
                    ))
                }
            </div>
            <div className={styles['project-action-delete']}>
                {
                    founder.toLowerCase() === walletId?.toLowerCase() ? (
                        <span>
                            <i className='material-icons'>delete</i>
                            <span>Delete Task</span>
                        </span>
                    ) : (
                        <button>Apply for task</button>
                    )
                }
            </div>
        </div>
    )
}

export default TaskDetail;