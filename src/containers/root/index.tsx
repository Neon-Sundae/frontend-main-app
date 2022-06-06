import { FC } from 'react';
import useConditionalRender from './hook';

const RootPage: FC = () => {
  useConditionalRender();
  return <div />;
};

export default RootPage;
