import {
  createBoldPlugin,
  createHeadingPlugin,
  createItalicPlugin,
  createParagraphPlugin,
  createPlugins,
  createUnderlinePlugin,
  createListPlugin,
  Plate,
  PlateProvider,
} from '@udecode/plate';
import { FC, useMemo, useRef } from 'react';
import BasicElementToolbarButtons from 'components/Plate/BasicElementToolbarButtons';
import Toolbar from 'components/Plate/Toolbar';
import { editableProps } from '../../Plate/editableProps';
import { MyValue } from '../../Plate/plateTypes';
import BasicElementsValue from '../../Plate/basicElementsValue';
import plateUI from '../../Plate/plateUI';
import styles from './index.module.scss';

interface JobDescriptionEditProps {
  setEditorVal: any;
}

const JobDescriptionEdit: FC<JobDescriptionEditProps> = ({ setEditorVal }) => {
  const containerRef = useRef(null);
  const plugins = useMemo(
    () =>
      createPlugins<MyValue>(
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
      ),
    []
  );

  const handleChange = (val: any) => {
    setEditorVal(val);
  };

  return (
    <div ref={containerRef} className={styles['plate-editor-wrap']}>
      <PlateProvider<MyValue>
        initialValue={BasicElementsValue}
        plugins={plugins}
        onChange={handleChange}
      >
        <Toolbar>
          <BasicElementToolbarButtons />
        </Toolbar>

        <div ref={containerRef}>
          <Plate editableProps={editableProps} />
        </div>
      </PlateProvider>
    </div>
  );
};

export default JobDescriptionEdit;
