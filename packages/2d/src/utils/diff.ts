interface TransformDiff<T> {
  inserted: TransformDiffItem<T>[];
  deleted: TransformDiffItem<T>[];
  transformed: TransformDiffItemTransformed<T>[];
}

interface TransformDiffItem<T> {
  before?: T;
  current: T;
  beforeIdIndex: number;
}

interface TransformDiffItemTransformed<T> {
  insert: boolean;
  remove: boolean;
  from: TransformDiffItem<T>;
  to: TransformDiffItem<T>;
}

interface ApplyTransformResult<T> {
  inserted: TransformDiffItem<T>[];
}

interface Idable {
  id: string;
}

function getIdMap<T extends Idable>(list: T[]) {
  const map: Record<string, TransformDiffItem<T>[]> = {};
  let before: T | undefined = undefined;
  for (const current of list) {
    if (!map[current.id]) map[current.id] = [];

    map[current.id].push({
      before,
      current,
      beforeIdIndex: before ? map[before.id].length - 1 : -1,
    });
    before = current;
  }
  return map;
}

export function getTransformDiff<T extends Idable>(
  from: T[],
  to: T[],
): TransformDiff<T> {
  const diff: TransformDiff<T> = {
    inserted: [],
    deleted: [],
    transformed: [],
  };

  const fromMap = getIdMap(from);
  const fromKeys = Object.keys(fromMap);
  const toMap = getIdMap(to);
  const toKeys = Object.keys(toMap);

  while (fromKeys.length > 0) {
    const key = fromKeys.pop()!;
    const fromItem = fromMap[key];
    const toIndex = toKeys.indexOf(key);
    if (toIndex >= 0) {
      toKeys.splice(toIndex, 1);
      const toItem = toMap[key];

      for (let i = 0; i < Math.max(fromItem.length, toItem.length); i++) {
        const insert = i >= fromItem.length;
        const remove = i >= toItem.length;

        const fromNode = !insert ? fromItem[i] : fromItem[fromItem.length - 1];
        const toNode = !remove ? toItem[i] : toItem[toItem.length - 1];

        diff.transformed.push({
          insert,
          remove,
          from: fromNode,
          to: toNode,
        });
      }
    } else {
      for (const node of fromItem) {
        diff.deleted.push(node);
      }
    }
  }

  if (toKeys.length > 0) {
    for (const key of toKeys) {
      for (const node of toMap[key]) {
        diff.inserted.push(node);
      }
    }
  }

  return diff;
}

export function applyTransformDiff<T extends Idable>(
  current: T[],
  diff: TransformDiff<T>,
  cloner: (original: T) => T,
): ApplyTransformResult<T> {
  const result: ApplyTransformResult<T> = {
    inserted: [],
  };
  function insert(item: TransformDiffItem<T>) {
    result.inserted.push(item);
    let idIndex = -1;
    const index = item.before
      ? current.findIndex(({id}) => {
          if (id === item.before?.id) {
            idIndex++;
            if (idIndex === item.beforeIdIndex) return true;
          }
          return false;
        })
      : 0;
    current.splice(index + 1, 0, item.current);
  }

  for (const item of diff.inserted) {
    insert(item);
  }

  for (const item of diff.transformed) {
    if (!item.insert) continue;

    const from = item.from;
    item.from = {
      ...item.to,
      current: cloner(from.current),
    };
    insert(item.from);
  }

  return result;
}
