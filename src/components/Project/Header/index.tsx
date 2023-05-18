/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from 'reducers';
import toast from 'react-hot-toast';
import config from 'config';
import { GET_DEPLOY_STATE } from 'actions/flProject/types';
import { toggleWalletDrawer } from 'actions/app';
import { ReactComponent as VerifiedIcon } from 'assets/illustrations/icons/verified.svg';
import { ReactComponent as Pencil } from 'assets/illustrations/icons/pencil.svg';
import getProfileContractAddress from 'utils/contractFns/getProfileContractAddress';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import _ from 'lodash';
import getRandomString from 'utils/getRandomString';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import { useFetchOrganisationOwnerManager } from 'queries/organisation';
import isOrganisationMember from 'utils/accessFns/isOrganisationMember';
import isOwner from 'utils/accessFns/isOwner';
import { useAuth } from '@arcana/auth-react';
import { useFetchUserDetailsByWallet } from 'queries/user';
import styles from './index.module.scss';
import CreatePrjModalWithData from '../../StartPrjModal/CreatePrjModalWithData';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectName: string;
  organisationName: string;
  organisationId: string;
}

const Header: FC<IHeaderProps> = props => {
  const auth = useAuth();
  let peopleCount = 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { create: projectUuid } = useParams();
  const { data: userData } = useFetchUserDetailsByWallet();
  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );
  const toggle = useSelector((state: RootState) => state.app.toggle);

  const [showProjectFormModalWithData, setShowProjectFormModalWithData] =
    useState(false);
  const [currentProjectTasks, setCurrentProjectTasks] = useState<any[]>([]);

  const { data: members } = useFetchOrganisationOwnerManager(
    props.organisationId
  );

  const { data } = useQuery(
    ['userTasksData'],
    () =>
      fetch(`${config.ApiBaseUrl}/task/all`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      enabled: currentProjectTasks.length === 0,
      refetchOnWindowFocus: false,
    }
  );
  const accumulatePeopleProjectData = () => {
    let tempArray: any[] = [];
    currentProjectTasks.forEach((task: any) => {
      task.profileTask.forEach((taskUser: any) => {
        tempArray.push(taskUser.Profile);
      });
    });
    if (tempArray.length !== 0) tempArray = [...new Set(tempArray)];
    return tempArray;
  };
  useEffect(() => {
    if (data)
      setCurrentProjectTasks(
        _.filter(data, {
          flProjectCategory: {
            flProject: { flProjectId_uuid: projectUuid },
          },
        })
      );
    accumulatePeopleProjectData();
  }, [data]);

  const handlePublishProject = async () => {
    try {
      const profileAddress = await getProfileContractAddress(
        userData?.user?.walletId,
        auth
      );

      if (profileAddress !== '0x0000000000000000000000000000000000000000') {
        dispatch({
          type: GET_DEPLOY_STATE,
          payload: 'go_live',
        });
        props.setOpen(true);
      } else {
        toast.error('Please mint your profile on chain');
        navigate(`/profile/${userData?.profileId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = () => {
    dispatch(toggleWalletDrawer(!toggle));
  };

  const handleEditButtonClick = () => {
    setShowProjectFormModalWithData(true);
  };

  const peopleProjectDataCount = useMemo(
    () => accumulatePeopleProjectData().length,
    [currentProjectTasks]
  );
  peopleCount = peopleProjectDataCount - peopleProjectDataCount + 1;

  return (
    <div className={styles.container}>
      <div className={styles['project-info']}>
        <div className={styles['name-publish-btn-row']}>
          <span className={styles['project-name-people-wrap']}>
            <p className={styles['project-name']}>{props.projectName}</p>
            <div className={styles['project-people-wrap']}>
              {peopleProjectDataCount > 0 &&
                accumulatePeopleProjectData()
                  .slice(0, 3)
                  .map((projectPerson: any) => {
                    return (
                      <div
                        className={styles['project-people']}
                        key={getRandomString(5)}
                      >
                        <img
                          src={
                            projectPerson.picture ||
                            getDefaultAvatarSrc(
                              projectPerson?.user?.name?.charAt(0).toUpperCase()
                            )
                          }
                          alt=""
                        />
                      </div>
                    );
                  })}
              {peopleProjectDataCount > 0 && (
                <div>
                  <p>+{peopleCount}</p>
                </div>
              )}
            </div>
          </span>
          {isOwner(userData?.user, members) && selectedProjectAddress === '' ? (
            <button
              onClick={handlePublishProject}
              className={styles.transparentBtn}
            >
              Publish a Project
            </button>
          ) : (
            <div>
              {isOwner(userData?.user, members) ? (
                <button
                  onClick={handleToggle}
                  className={styles.transparentBtn}
                >
                  Deposit funds
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
        <div className={styles['org-edit-project-row']}>
          <span className={styles['by-org-name']}>
            <div
              onClick={() => navigate(`/organisation/${props.organisationId}`)}
            >
              <p className={styles['founder-name']}>
                by&nbsp;&nbsp;{props.organisationName}
              </p>
            </div>
            {selectedProjectAddress && (
              <VerifiedIcon
                className={styles['project-verified']}
                width={20}
                height={20}
              />
            )}
          </span>
          {isOrganisationMember(userData?.user, members) && (
            <button
              onClick={handleEditButtonClick}
              className={styles['edit-project-btn']}
            >
              Edit project &nbsp; <Pencil width={15} height={15} />
            </button>
          )}
        </div>
      </div>

      {showProjectFormModalWithData && (
        <CreatePrjModalWithData
          onClose={() =>
            setShowProjectFormModalWithData(!showProjectFormModalWithData)
          }
        />
      )}
    </div>
  );
};

export default Header;
