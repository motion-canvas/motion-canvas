import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import IconGitHub from '@site/src/Icon/GitHub';
import NavbarLink from '@site/src/components/NavbarLink/Link';
import useStorage from '@site/src/utils/useStorage';
import React, {useEffect} from 'react';

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
