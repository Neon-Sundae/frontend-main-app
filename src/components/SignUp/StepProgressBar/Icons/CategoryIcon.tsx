import { FC } from 'react';

interface ICategoryIcon {
  active: boolean;
}

const CategoryIcon: FC<ICategoryIcon> = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none">
    <path
      fill="#fff"
      fillOpacity={active ? 1 : 0.5}
      fillRule="evenodd"
      d="M5.675 2.5H9.9c1.762 0 3.175 1.438 3.175 3.201v4.262c0 1.775-1.413 3.2-3.175 3.2H5.675a3.185 3.185 0 0 1-3.175-3.2V5.7C2.5 3.938 3.925 2.5 5.675 2.5Zm0 14.337H9.9a3.178 3.178 0 0 1 3.175 3.201V24.3c0 1.762-1.413 3.2-3.175 3.2H5.675c-1.75 0-3.175-1.438-3.175-3.2v-4.262c0-1.775 1.425-3.2 3.175-3.2ZM24.325 2.5H20.1c-1.763 0-3.175 1.438-3.175 3.201v4.262c0 1.775 1.412 3.2 3.175 3.2h4.225a3.185 3.185 0 0 0 3.175-3.2V5.7c0-1.763-1.425-3.201-3.175-3.201ZM20.1 16.837h4.225c1.75 0 3.175 1.426 3.175 3.201V24.3c0 1.762-1.425 3.2-3.175 3.2H20.1c-1.763 0-3.175-1.438-3.175-3.2v-4.262a3.178 3.178 0 0 1 3.175-3.2Z"
      clipRule="evenodd"
    />
  </svg>
);
export default CategoryIcon;
