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
  useEffect(() => {
    setTextVal(editorVal);
  }, [editorVal]);

  const [textVal, setTextVal] = useState(editorVal);
  const setValFunc = (value: string) => {
    setEditorVal(value);
    setTextVal(value);
  };

  return (
    <div className={styles['quill-editor-wrap']}>
      <ReactQuill theme="snow" value={textVal} onChange={setValFunc} />
    </div>
  );
};

export default JobDescriptionEdit;
