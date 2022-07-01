import { FC } from 'react';
import styles from './index.module.scss';
import timezoneData from 'assets/data/timezones.json';
import gradient from 'assets/illustrations/project/gradient.svg';

const ProjectCreateForm: FC = () => {
  return (
    <>
      <div
        className={styles.container}
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: 'cover',
        }}
      >
        <h1>Create a Project</h1>
        <div className={styles.space}></div>
        <div className={styles.formContentWrap}>
          <div>
            <input
              className={styles.input}
              type="text"
              id="name"
              placeholder="Project Name"
              style={{ width: '530px' }}
            />
          </div>
          <div className={styles.space}></div>
          <div>
            <input
              id="description"
              placeholder="Description"
              className={styles.input}
              style={{ height: '100px', width: '530px' }}
            />
          </div>
          <div className={styles.formFieldSpace}></div>
          <div>
            <input
              className={styles.input}
              type="date"
              id="startDate"
              placeholder="Project Start Date"
              style={{ width: '530px' }}
            />
          </div>
          <div className={styles.formFieldSpace}></div>
          <div>
            <select id="category" className={styles.select}>
              <option value="">Preferred Timezones</option>
              {timezoneData.map((t) => {
                return <option value={t.value}>{t.text}</option>;
              })}
            </select>
            <div className={styles.formFieldSpace}></div>
          </div>
          <div className={styles.formFieldSpace}></div>
          <div>
            <h2>Resources needed</h2>
            <div className={styles.formFieldSpace}></div>
            <div>
              <input
                type="text"
                id="name"
                placeholder="Resource Name"
                className={styles.input}
              />
            </div>
            <div>
              <p className={styles.pointer}>
                Add more resources <span className={styles.plus}>+</span>
              </p>
              <div className={styles.formFieldSpace}></div>
            </div>
          </div>
          <div className={styles.formFieldSpace}></div>
          <div>
            <h2>Budget</h2>
            <div className={styles.formFieldSpace}></div>
            <input
              type="text"
              id="name"
              placeholder="Write a category"
              className={styles.input}
            />
            &nbsp; &nbsp;
            {/* label for input */}
            <span style={{ position: 'relative' }}>
              <label style={{ position: 'absolute', top: '-42px' }}>
                % of Budget
              </label>
              <input
                type="text"
                id="budget"
                className={styles.input}
                placeholder="Budget"
              />
            </span>
            <p className={styles.pointer}>
              Add more Categories <span className={styles.plus}>+</span>
            </p>
            <div className={styles.formFieldSpace}></div>
          </div>
          <div className={styles.formFieldSpace}></div>
          <button className={styles.cancelBtn}>CANCEL</button> &nbsp; &nbsp;
          <button className={styles.saveBtn}>SAVE</button>
        </div>
      </div>
    </>
  );
};

export default ProjectCreateForm;
