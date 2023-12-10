import {FilteredGroup} from '@site/src/components/Api/Group/index';
import Item from '@site/src/components/Api/Item';
import ReferenceType from '@site/src/components/Api/Type/ReferenceType';
import React from 'react';

export default function Category({group}: {group: FilteredGroup}) {
  if (
    group.title === 'Constructors' &&
    group.external.length === 0 &&
    group.nested.length === 1
  ) {
    return <Item reflection={group.nested[0]} />;
  }

  return (
    <>
      {group.external.length > 0 && (
        <ul>
          {group.external.map(child => (
            <li key={child.id}>
              <code>
                <ReferenceType type={child} />
              </code>
            </li>
          ))}
        </ul>
      )}
      {group.nested.length > 0 &&
        group.nested.map((child, index) => (
          <React.Fragment key={child.id}>
            {index > 0 && <hr />}
            <Item reflection={child} />
          </React.Fragment>
        ))}
    </>
  );
}
