import {
  createBoldPlugin,
  createHeadingPlugin,
  createItalicPlugin,
  createParagraphPlugin,
  createPlugins,
  createUnderlinePlugin,
  createListPlugin,
  Plate,
} from '@udecode/plate';
import { FC } from 'react';
import { editableProps } from '../../Plate/editableProps';
import { MyValue } from '../../Plate/plateTypes';
import BasicElementsValue from '../../Plate/basicElementsValue';
import plateUI from '../../Plate/plateUI';
import MarkBalloonToolbar from '../../Plate/MarkBalloonToolbar';
import styles from './index.module.scss';

interface JobDescriptionEditProps {
  setEditorVal: any;
}

const JobDescriptionEdit: FC<JobDescriptionEditProps> = ({ setEditorVal }) => {
  const plugins = createPlugins<MyValue>(
    [
      createParagraphPlugin(),
      createHeadingPlugin(),
      createBoldPlugin(),
      createItalicPlugin(),
      createUnderlinePlugin(),
      createListPlugin(),
    ],
    {
      components: plateUI,
    }
  );
  const handleChange = (val: any) => {
    setEditorVal(val);
  };

  return (
    <div className={styles['plate-editor-wrap']}>
      <Plate<MyValue>
        editableProps={editableProps}
        initialValue={[...BasicElementsValue]}
        plugins={plugins}
        onChange={newValue => {
          handleChange(newValue);
        }}
      >
        <MarkBalloonToolbar />
      </Plate>
    </div>
  );
};

export default JobDescriptionEdit;
