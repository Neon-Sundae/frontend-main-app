import { FC, useState } from 'react';
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
  const [value, setValue] = useState('');
  const setValFunc = () => {
    setEditorVal(value);
    setValue(value);
  };
  // eslint-disable-next-line no-param-reassign
  editorVal = value;
  console.log(editorVal);
  console.log(value);
  return (
    <div className={styles['quill-editor-wrap']}>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  );
};

export default JobDescriptionEdit;
