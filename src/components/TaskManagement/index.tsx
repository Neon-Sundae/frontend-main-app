/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/self-closing-comp */
// @ts-nocheck

import { FC, useEffect, useState, useMemo, useRef, MouseEvent } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useFetchProjectCategories } from 'components/CreateTask/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { updateProjectCategory } from 'actions/flProject';
import { useQueryClient } from '@tanstack/react-query';
import CreateTaskModal from 'components/CreateTask/CreateTaskModal';
import AcceptTask from 'components/AcceptTask';
import SelectBuilder from 'components/AcceptTask/SelectBuilder';
import CommitTask from 'components/CommitTask';
import CompleteTask from 'components/CompleteTask';
import { useFetchProjects } from 'components/Project/Landing/hooks';
import { GET_SELECTED_TASK } from 'actions/flProject/types';
import useBuilderTaskApply from 'hooks/useBuilderTaskApply';
import { ReactComponent as USDCIcon } from 'assets/illustrations/icons/usdc.svg';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import getRandomString from 'utils/getRandomString';
import useFetchOrganisationOwnerManager from 'hooks/useFetchOrganisationOwnerManager';
import isOrganisationMember from 'utils/accessFns/isOrganisationMember';
import { IMemberData } from 'interfaces/organisation';
import { useFetchProjectTasks, useUpdateTaskStatus } from './hooks';
import styles from './index.module.scss';
import { notAllowedCases, onDragEnd } from './dndMethods';

const lists = ['open', 'in progress', 'in review', 'completed', 'cancelled'];

interface ITaskManagement {
  project_name: string;
  project_budget: number;
  flProjectCategory?: any;
}

const TaskManagement: FC<ITaskManagement> = ({
  project_budget,
  project_name,
  flProjectCategory,
}) => {
  const { create } = useParams();
  useFetchProjectCategories();
  const [filterOpen, setFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const { projectData = {} } = useFetchProjects(create);
  const { members } = useFetchOrganisationOwnerManager(
    projectData.organisationId
  );

  const handleOpenModal = () => {
    if (isOrganisationMember(user, members)) {
      setOpen(true);
    } else {
      toast.error('Only founder can add the task');
    }
  };

  const toggleFilterMenu = () => setFilterOpen(p => !p);

  return (
    <div className={styles['task-management']}>
      <div className={styles['task-management-header']}>
        <h1 className={styles['task-header']}>Tasks</h1>
        <div className={styles['task-header-action']}>
          <button
            className={clsx(styles['filter-btn'])}
            onClick={toggleFilterMenu}
          >
            Filter
          </button>
          {filterOpen && <FilterMenu />}
          {open && <CreateTaskModal setOpen={setOpen} />}
          <button className={styles['add-task-btn']} onClick={handleOpenModal}>
            Add Task
          </button>
        </div>
      </div>
      <hr />
      <TaskManagementBoard
        project_budget={project_budget}
        project_name={project_name}
        flProjectCategory={flProjectCategory}
        projectData={projectData}
        members={members}
      />
    </div>
  );
};

const FilterMenu: FC = () => {
  const queryClient = useQueryClient();
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const filterState = useSelector(
    (state: RootState) => state.flProject.categoryFilter
  );

  useEffect(() => {
    if (mounted.current) {
      queryClient.invalidateQueries(['projectTasks']);
    } else {
      mounted.current = true;
    }
  }, [filterState]);

  const toggleFilterState = (listItem: string) => {
    dispatch(
      updateProjectCategory({
        ...filterState,
        [listItem]: !filterState[listItem],
      })
    );
  };

  return (
    <div className={styles['filter-menu']}>
      <h3>Filter</h3>
      {Object.keys(filterState).map((listItem, idx) => {
        return (
          <label
            key={idx}
            className={styles['filter-label']}
            name={listItem}
            onClick={() => toggleFilterState(listItem)}
          >
            {filterState[listItem] ? (
              <div className={styles['filter-checked']}>
                <i className="material-icons">check</i>
              </div>
            ) : (
              <div className={styles['filter-unchecked']} />
            )}
            {listItem}
          </label>
        );
      })}
    </div>
  );
};

interface ITaskManagementBoard {
  project_name: string;
  project_budget: number;
  flProjectCategory?: any;
  projectData: any;
  members: IMemberData;
}

const TaskManagementBoard: FC<ITaskManagementBoard> = ({
  project_budget,
  project_name,
  flProjectCategory,
  projectData,
  members,
}) => {
  const dispatch = useDispatch();

  const updateTask = useUpdateTaskStatus();
  const { projectTasks } = useFetchProjectTasks();
  const user = useSelector((state: RootState) => state.user.user);

  const [elements, setElements] = useState(projectTasks);
  const [openTask, setOpenTask] = useState(false);

  const [openSelectBuilder, setOpenSelectBuilder] = useState(false);
  const [openCommitTask, setOpenCommitTask] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<any>(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    setElements(projectTasks);
  }, [projectTasks]);

  const handleOpenTask = (data: any) => {
    setSelectedTaskId(data?.taskId);
    setOpenTask(true);
  };

  const handleApprove = (item: any) => {
    setOpenTask(false);
    setOpenSelectBuilder(true);
    setSelectedBuilder(item);
  };

  const handleCloseSelectBuilder = () => {
    setOpenTask(true);
    setOpenSelectBuilder(false);
  };

  const handleSuccess = () => {
    setOpenTask(true);
    setOpenSelectBuilder(false);
    setSuccess(true);
  };

  const handleDragEnd = (result: any) => {
    if (result.destination.droppableId === 'completed') {
      if (
        notAllowedCases(
          result,
          projectData.organisation.OrganisationUser[0].user.userId,
          user?.userId
        )
      ) {
        dispatch({
          type: GET_SELECTED_TASK,
          payload: elements[result.source.droppableId][result.source.index],
        });
        setOpenComplete(true);
      }
    } else {
      onDragEnd({
        elements,
        result,
        setElements,
        updateTask,
        projectData,
        userId: user?.userId,
      });
    }
  };

  const handleCommit = () => {
    setOpenCommitTask(true);
    setOpenSelectBuilder(false);
    setOpenTask(false);
  };

  const handleCloseCommitTask = () => {
    setOpenCommitTask(false);
    setOpenSelectBuilder(false);
    setOpenTask(true);
  };

  const handleOpenComplete = (val: any) => {
    setOpenComplete(val);
    setOpenTask(false);
  };
  if (elements) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.container}>
          {lists.map(listKey => (
            <Column
              elements={elements[listKey]}
              key={listKey}
              prefix={listKey}
              organisationName={projectData.organisation.name}
              setOpenTask={handleOpenTask}
              members={members}
            />
          ))}
        </div>
        {openTask && (
          <AcceptTask
            editable
            setOpen={setOpenTask}
            setViewComplete={handleOpenComplete}
            taskId={selectedTaskId}
            handleApprove={handleApprove}
            project_name={project_name}
            handleCommit={handleCommit}
            setOpenTask={setOpenTask}
            flProjectCategory={flProjectCategory}
          />
        )}
        {openSelectBuilder && (
          <SelectBuilder
            setOpen={handleCloseSelectBuilder}
            handleSuccess={handleSuccess}
            project_budget={project_budget}
            selectedBuilder={selectedBuilder}
          />
        )}
        {openCommitTask && <CommitTask handleClose={handleCloseCommitTask} />}
        {openComplete && <CompleteTask setOpen={val => setOpenComplete(val)} />}
      </DragDropContext>
    );
  }

  return null;
};

interface IColumn {
  elements: any;
  prefix: string;
  organisationName: string;
  setOpenTask: any;
  members: IMemberData;
}

const Column: FC<IColumn> = ({
  elements,
  prefix,
  organisationName,
  setOpenTask,
  members,
}) => {
  return (
    <div className={styles['column-container']}>
      <h1 className={styles['column-title']}>{prefix}</h1>
      <div className={styles['column-content']}>
        <Droppable droppableId={`${prefix}`}>
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {elements.map((item: any, index: number) => (
                <Card
                  key={item.taskId}
                  item={item}
                  index={index}
                  organisationName={organisationName}
                  setOpenTask={setOpenTask}
                  appliedBuilders={item.profileTask}
                  members={members}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

interface ICard {
  item: any;
  index: any;
  organisationName: string;
  setOpenTask: any;
  appliedBuilders: any;
  members: IMemberData;
}

const Card: FC<ICard> = ({
  item,
  index,
  organisationName,
  setOpenTask,
  appliedBuilders,
  members,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const builderTaskApply = useBuilderTaskApply();
  const title = useMemo(() => `${item.name}`, []);
  const difficultyArray = useMemo(
    () => [...Array(item.estimatedDifficulty).keys()],
    []
  );

  const applyToTask = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    if (profile && profile.profileSmartContractId) {
      builderTaskApply.mutate({
        taskId: item.taskId,
      });
    } else {
      toast.error('Please mint your profile');
      navigate(`/profile/${profile?.profileId}`);
    }
  };

  const getTextOrAvatar = () => {
    switch (item.status) {
      case 'open':
        if (isOrganisationMember(user, members)) {
          return <Avatars appliedBuilders={appliedBuilders} />;
        }
        return (
          <span className={styles['apply-task-text']} onClick={applyToTask}>
            Apply to task
          </span>
        );
      default:
        return (
          <div className={styles['avatar-image-wrapper']}>
            <img
              alt="user"
              src={getDefaultAvatarSrc(user?.name?.charAt(0).toUpperCase())}
            />
          </div>
        );
    }
  };

  return (
    <Draggable draggableId={`${item.taskId}`} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            className={styles.card}
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setOpenTask(item)}
          >
            <div className={styles['category-action-container']}>
              <span className={styles['task-category']}>
                {item.flProjectCategory.categoryName}
              </span>
              {getTextOrAvatar()}
            </div>
            <h4 className={styles['task-name']}>{title}</h4>
            <p className={styles['task-organisation-name']}>
              {organisationName}
            </p>
            <div className={styles['rating-price-container']}>
              <span className={styles['rating-container']}>
                {difficultyArray.map(n => (
                  <i
                    key={n}
                    className={clsx('material-icons', styles['rating-star'])}
                  >
                    star
                  </i>
                ))}
              </span>
              <div className={styles['price-container']}>
                <USDCIcon />
                <span>{item.price} USDC</span>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

interface IAvatars {
  appliedBuilders: any;
}

const Avatars: FC<IAvatars> = ({ appliedBuilders }) => {
  return (
    <div className={styles['avatar-container']}>
      {appliedBuilders.map((elem: any) => (
        <img
          src={
            elem.Profile.picture ||
            getDefaultAvatarSrc(
              elem?.Profile?.user?.name?.charAt(0).toUpperCase()
            )
          }
          alt="User Avatar"
          className={styles['builder-avatar']}
          key={getRandomString(5)}
        />
      ))}
    </div>
  );
};

export default TaskManagement;
