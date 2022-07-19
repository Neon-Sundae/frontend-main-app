/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/self-closing-comp */
// @ts-nocheck

import { FC, useEffect, useState, useMemo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import userImage from 'assets/images/profile/user-image.png';
import { useFetchProjectCategories } from 'components/CreateTask/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { updateProjectCategory } from 'actions/flProject';
import { useQueryClient } from 'react-query';
import CreateTaskModal from 'components/CreateTask/CreateTaskModal';
import AcceptTask from 'components/AcceptTask';
import SelectBuilder from 'components/AcceptTask/SelectBuilder';
import { useFetchProjects } from 'components/Project/Landing/hooks';
import { useFetchProjectTasks, useUpdateTaskStatus } from './hooks';
import styles from './index.module.scss';
import { onDragEnd } from './dndMethods';

const lists = [
  'open',
  'interviewing',
  'in progress',
  'in review',
  'completed',
  'cancelled',
];

interface ITaskManagement {
  project_budget: number;
  project_name: string;
}

const TaskManagement: FC<ITaskManagement> = ({
  project_budget,
  project_name,
}) => {
  useFetchProjectCategories();
  const [filterOpen, setFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);

  const toggleFilterMenu = () => setFilterOpen(p => !p);

  return (
    <div className={styles['task-management']}>
      <div className={styles['task-management-header']}>
        <h1 className={styles['task-header']}>Tasks</h1>
        <div className={styles['task-header-action']}>
          <button
            className={clsx(styles['add-task-btn'], styles['filter-btn'])}
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
      queryClient.invalidateQueries('projectTasks');
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

const TaskManagementBoard: FC<ITaskManagement> = ({
  project_budget,
  project_name,
}) => {
  const { create } = useParams();
  const updateTask = useUpdateTaskStatus();
  const { projectData } = useFetchProjects(create);
  const { projectTasks } = useFetchProjectTasks();
  const user = useSelector((state: RootState) => state.user.user);

  const [elements, setElements] = useState(projectTasks);
  const [openTask, setOpenTask] = useState(false);
  const [openSelectBuilder, setOpenSelectBuilder] = useState(false);
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
    onDragEnd({
      elements,
      result,
      setElements,
      updateTask,
      projectData,
      userId: user?.userId,
    });
  };

  if (elements) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles['container']}>
          {lists.map(listKey => (
            <Column
              elements={elements[listKey]}
              key={listKey}
              prefix={listKey}
              setOpenTask={handleOpenTask}
            />
          ))}
        </div>
        {openTask && (
          <AcceptTask
            setOpen={setOpenTask}
            taskId={selectedTaskId}
            handleApprove={handleApprove}
            project_name={project_name}
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
      </DragDropContext>
    );
  }

  return null;
};

interface IColumn {
  elements: any;
  prefix: string;
  setOpenTask: any;
}

const Column: FC<IColumn> = ({ elements, prefix, setOpenTask }) => {
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
                  setOpenTask={setOpenTask}
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
  setOpenTask: any;
}

const Card: FC<ICard> = ({ item, index, setOpenTask }) => {
  const title = useMemo(() => `${item.name}`, []);
  const difficultyArray = useMemo(
    () => [...Array(item.estimatedDifficulty).keys()],
    []
  );

  const getTextOrAvatar = () => {
    switch (item.status) {
      case 'open':
        return <span className={styles['apply-task-text']}>Apply to task</span>;
      case 'interviewing':
        return null;
      default:
        return (
          <div className={styles['avatar-image-wrapper']}>
            <img alt="user" src={userImage} />
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
            <p className={styles['task-organisation-name']}>Axie Infinity</p>
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
                <div />
                <span>{item.price} USDC</span>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskManagement;
