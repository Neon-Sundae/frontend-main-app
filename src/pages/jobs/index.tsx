import JobsLanding from 'components/Jobs/Landing';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';

const Jobs = () => {
  return (
    <ArcanaAuthLayout>
      <JobsLanding />
    </ArcanaAuthLayout>
  );
};

export default Jobs;
