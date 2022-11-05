import { FC } from 'react';
import { ReactComponent as InstagramIcon } from 'assets/illustrations/profile/instagram.svg';
import { ReactComponent as LinkedinIcon } from 'assets/illustrations/profile/linkedin.svg';
import { ReactComponent as TwitterIcon } from 'assets/illustrations/profile/twitter.svg';
import { ReactComponent as PortfolioIcon } from 'assets/illustrations/profile/portfolio.svg';
import { ReactComponent as GithubIcon } from 'assets/illustrations/profile/github.svg';
import { ReactComponent as DiscordIcon } from 'assets/illustrations/profile/discord.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';

const ProfileSocials: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const user = useSelector((state: RootState) => state.user.user);
  console.log('user', user);
  return (
    <div className={styles['profile-socials-container']}>
      {profile?.linkedin && <LinkedinIcon width={25.36} height={25.36} />}
      {profile?.twitter && <TwitterIcon width={25.36} height={25.36} />}
      {profile?.instagram && <InstagramIcon width={25.36} height={25.36} />}
      {profile?.github && <GithubIcon width={25.36} height={25.36} />}
      {profile?.portfolio && <PortfolioIcon width={25.36} height={25.36} />}
      {profile?.linkedin && <LinkedinIcon width={40} height={40} />}
      {profile?.twitter && <TwitterIcon width={40} height={40} />}
      {profile?.instagram && <InstagramIcon width={40} height={40} />}
      {profile?.github && <GithubIcon width={40} height={40} />}
      {profile?.portfolio && <PortfolioIcon width={40} height={40} />}
      {user?.discordId && <DiscordIcon width={40} height={40} />}
    </div>
  );
};

export default ProfileSocials;
