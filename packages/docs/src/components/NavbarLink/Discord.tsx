import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import IconDiscord from '@site/src/Icon/Discord';
import NavbarLink from '@site/src/components/NavbarLink/Link';
import useStorage from '@site/src/utils/useStorage';
import React, {useEffect} from 'react';

export default function DiscordNavbarLink() {
  const {siteConfig} = useDocusaurusContext();
  const [activeUsers, setActiveUsers] = useStorage('discord-users', null);
  useEffect(() => {
    fetch(siteConfig.customFields.discordApi as string)
      .then(response => response.json())
      .then(async data => setActiveUsers(data.presence_count))
      .catch(() => setActiveUsers(false));
  }, []);

  return (
    <NavbarLink
      href={siteConfig.customFields.discordUrl as string}
      suffix={'online'}
      amount={activeUsers}
    >
      <IconDiscord width={20} height={20} />
    </NavbarLink>
  );
}
