import React, {useEffect} from 'react';
import NavbarLink from '@site/src/components/NavbarLink/Link';
import IconGitHub from '@site/src/Icon/GitHub';
import useStorage from '@site/src/utils/useStorage';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GitHubNavbarLink() {
  const {siteConfig} = useDocusaurusContext();
  const [stars, setStars] = useStorage('github-stars', null);
  useEffect(() => {
    fetch(siteConfig.customFields.githubApi as string)
      .then(response => response.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(false));
  }, []);

  return (
    <NavbarLink
      href={siteConfig.customFields.githubUrl as string}
      suffix={'stars'}
      amount={stars}
    >
      <IconGitHub width={20} height={20} />
    </NavbarLink>
  );
}
