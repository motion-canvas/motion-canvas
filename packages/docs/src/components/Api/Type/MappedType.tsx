import Token from '@site/src/components/Api/Code/Token';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function MappedType({type}: {type: JSONOutput.MappedType}) {
  return (
    <>
      <TokenList type={ListType.Curly}>
        <>
          [<Token type="class">{type.parameter}</Token>
          <Token type="keyword"> in </Token>
          {type.parameterType && <Type type={type.parameterType} />}
          ]: {type.templateType && <Type type={type.templateType} />}
        </>
      </TokenList>
    </>
  );
}
