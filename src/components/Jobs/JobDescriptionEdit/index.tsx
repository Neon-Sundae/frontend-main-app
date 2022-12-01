import { FC, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import styles from './index.module.scss';

interface JobDescriptionEditProps {
  setEditorVal: any;
  editorVal: any;
}

const JobDescriptionEdit: FC<JobDescriptionEditProps> = ({
  setEditorVal,
  editorVal,
}) => {
  const [value, setValue] = useState(editorVal || '');
  return (
    <div className={styles['quill-editor-wrap']}>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  );
};

export default JobDescriptionEdit;
