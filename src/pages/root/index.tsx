import { FC } from 'react';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';
import useConditionalRender from './hook';

const RootPage: FC = () => {
  useConditionalRender();
  return (
    <ArcanaAuthLayout>
      <div />
    </ArcanaAuthLayout>
  );
};

export default RootPage;
