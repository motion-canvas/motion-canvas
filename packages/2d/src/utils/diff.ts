interface TransformDiff<T> {
  inserted: TransformDiffItem<T>[];
  deleted: TransformDiffItem<T>[];
  transformed: TransformDiffItemTransformed<T>[];
}

interface TransformDiffItem<T> {
  before?: T;
  beforeIdIndex: number;
  current: T;
  currentIndex: number;
}

interface TransformDiffItemTransformed<T> {
  insert: boolean;
  remove: boolean;
  from: TransformDiffItem<T>;
  to: TransformDiffItem<T>;
}

interface ApplyTransformInserted<T> {
  item: TransformDiffItem<T>;
  order: number;
}

interface ApplyTransformResult<T> {
  inserted: ApplyTransformInserted<T>[];
}

interface Idable {
  id: string;
}

function getIdMap<T extends Idable>(list: T[]) {
  const map = new Map<string, TransformDiffItem<T>[]>();
  let before: T | undefined = undefined;
  for (const [index, current] of list.entries()) {
    const currentArray = map.get(current.id) ?? [];
    if (!map.has(current.id)) {
      map.set(current.id, currentArray);
    }

    currentArray.push({
      before,
      current,
      beforeIdIndex: before ? map.get(before.id)!.length - 1 : -1,
      currentIndex: index,
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
  const toMap = getIdMap(to);

  for (const [key, fromItem] of fromMap.entries()) {
    const toItem = toMap.get(key);
    if (toItem) {
      toMap.delete(key);
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

  for (const toItem of toMap.values()) {
    for (const node of toItem) {
      diff.inserted.push(node);
    }
  }

  return diff;
}

export function applyTransformDiff<T extends Idable>(
  current: T[],
  diff: TransformDiff<T>,
  cloner: (original: T) => T,
): ApplyTransformResult<T> {
  function insert(item: TransformDiffItem<T>) {
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

  const result: ApplyTransformResult<T> = {
    inserted: diff.inserted.map(item => ({
      item,
      order: item.currentIndex,
    })),
  };

  for (const item of diff.transformed) {
    if (!item.insert) continue;

    const from = item.from;
    item.from = {
      ...item.to,
      current: cloner(from.current),
    };
    result.inserted.push({
      item: item.from,
      order: item.to.currentIndex,
    });
  }

  result.inserted.sort((a, b) => a.order - b.order);

  for (const item of result.inserted) {
    insert(item.item);
  }

  return result;
}
