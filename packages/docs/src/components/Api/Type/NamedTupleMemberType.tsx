import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function NamedTupleMemberType({
  type,
}: {
  type: JSONOutput.NamedTupleMemberType;
}) {
  return (
    <>
      {type.name}
      {type.isOptional ? '?' : ''}: <Type type={type.element} />
    </>
  );
}
