import AllJobsLanding from 'components/Jobs/AllJobs';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';

const AllJobsContainer = () => {
  return (
    <ArcanaAuthLayout>
      <AllJobsLanding />
    </ArcanaAuthLayout>
  );
};

export default AllJobsContainer;
