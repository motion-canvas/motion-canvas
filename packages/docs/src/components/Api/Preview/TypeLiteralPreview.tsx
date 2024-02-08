import React from 'react';

import type {JSONOutput} from 'typedoc';
import Token from '@site/src/components/Api/Code/Token';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import SignaturePreview from '@site/src/components/Api/Preview/SignaturePreview';
import Preview from '@site/src/components/Api/Preview';
import {useApiFinder} from '@site/src/contexts/api';

export default function TypeLiteralPreview({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  const find = useApiFinder();
  if (reflection.signatures) {
    return <SignaturePreview reflection={reflection.signatures[0]} />;
  }
  if (reflection.children) {
    return (
      <TokenList type={ListType.Curly}>
        {reflection.children.map(child => (
          <Preview key={child.id} reflection={find(child)} />
        ))}
      </TokenList>
    );
  }

  return (
    <>
      <Token type="keyword">unknown</Token>
    </>
  );
}
