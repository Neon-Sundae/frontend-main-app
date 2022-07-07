/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/self-closing-comp */
// @ts-nocheck
import { FC, useEffect, useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useFetchProjectTasks, useUpdateTaskStatus } from './hooks';
import styles from './index.module.scss';

// fake data generator
const getItems = (count: number, prefix: string) =>
  Array.from({ length: count }, (v, k) => k).map(k => {
    const randomId = Math.floor(Math.random() * 100000);
    return {
      id: `item-${randomId}`,
      prefix,
      content: `item ${randomId}`,
    };
  });

const removeFromList = (list: string, index: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);

  return [removed, result];
};

const addToList = (list: string, index: number, element: string) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = [
  'open',
  'interviewing',
  'in progress',
  'in review',
  'completed',
  'cancelled',
];

const generateInitialData = () =>
  lists.reduce((acc, listKey) => ({ ...acc, [listKey]: [] }), {});

const TaskManagement: FC = () => {
  const updateTask = useUpdateTaskStatus();
  const { projectTasks } = useFetchProjectTasks();
  const [elements, setElements] = useState(projectTasks);

  useEffect(() => {
    setElements(projectTasks);
  }, [projectTasks]);

  const onDragEnd = async (result: any) => {
    console.log(result);
    if (!result.destination) {
      return;
    }
    const listCopy = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    console.log(destinationList);
    console.log(result);
    console.log(removedElement);

    if (result.source.droppableId !== result.destination.droppableId) {
      setElements(listCopy);

      await updateTask.mutateAsync({
        taskId: removedElement.taskId,
        status: result.destination.droppableId,
      });
    }
  };

  if (elements) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles['container']}>
          {lists.map(listKey => (
            <Column
              elements={elements[listKey]}
              key={listKey}
              prefix={listKey}
            />
          ))}
        </div>
      </DragDropContext>
    );
  }

  return null;
};

interface IColumn {
  elements: any;
  prefix: string;
}

const Column: FC<IColumn> = ({ elements, prefix }) => {
  return (
    <div className={styles['column']}>
      <h1>{prefix.toUpperCase()}</h1>
      <Droppable droppableId={`${prefix}`}>
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements.map((item, index) => (
              <Card key={item.taskId} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface ICard {
  item: any;
  index: any;
}

const Card: FC<ICard> = ({ item, index }) => {
  const randomHeader = useMemo(() => `${item.name}`, []);

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
          >
            <h4>{randomHeader}</h4>
            <div>Content</div>
            <div>{item.description}</div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskManagement;
