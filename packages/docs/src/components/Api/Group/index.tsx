import {useLocation} from '@docusaurus/router';
import Category from '@site/src/components/Api/Group/Category';
import {ApiLookup, useApiLookup} from '@site/src/contexts/api';
import {Filters, matchFilters, useFilters} from '@site/src/contexts/filters';
import Heading from '@theme/Heading';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React, {useEffect, useMemo} from 'react';
import type {JSONOutput} from 'typedoc';

export interface FilteredGroup {
  title: string;
  external: JSONOutput.Reflection[];
  nested: JSONOutput.Reflection[];
  anchors: string[];
}

function filterGroup(
  group: JSONOutput.ReflectionGroup,
  lookup: ApiLookup,
  filters: Filters,
): FilteredGroup {
  const external = [];
  const nested = [];
  const anchors = [];
  for (const child of group.children) {
    const reference = lookup[child];
    if (!reference || !matchFilters(filters, reference)) continue;

    anchors.push(reference.anchor);
    if (reference.hasOwnPage) {
      external.push(reference);
    } else {
      nested.push(reference);
    }
  }

  if (external.length > 0 || nested.length > 0) {
    return {
      title: group.title,
      external,
      nested,
      anchors,
    };
  }
}

export default function Group({
  group,
  project,
}: {
  group: JSONOutput.ReflectionGroup;
  project: number;
}) {
  const location = useLocation();
  const lookup = useApiLookup(project);
  const hash = location.hash.split('-')[0].slice(1);
  const [filters] = useFilters();

  const categories = useMemo(
    () =>
      (group.categories ?? [group])
        .map(group => filterGroup(group, lookup, filters))
        .filter(group => !!group),
    [group, lookup, filters],
  );

  useEffect(() => {
    if (categories.length === 1) return;

    const hash = location.hash.split('-')[0].slice(1);
    for (const category of categories) {
      if (category.anchors.includes(hash)) {
        // TODO Find a way to select the current tab
        // setTabGroupChoices(group.title, category.title);
        return;
      }
    }
  }, [location.hash, categories]);

  if (categories.length === 0) {
    return <></>;
  }

  return (
    <>
      <Heading as={'h2'} id={group.title}>
        {group.title}
      </Heading>
      {categories.length > 1 ? (
        <Tabs groupId={group.title}>
          {categories.map(category => {
            return (
              <TabItem
                default={category.anchors.includes(hash)}
                value={category.title}
                label={category.title}
                className="margin-top--lg"
              >
                <Category group={category} />
              </TabItem>
            );
          })}
        </Tabs>
      ) : (
        <Category group={categories[0]} />
      )}
    </>
  );
}
