import ClassPreview from '@site/src/components/Api/Preview/ClassPreview';
import FunctionPreview from '@site/src/components/Api/Preview/FunctionPreview';
import PropertyPreview from '@site/src/components/Api/Preview/PropertyPreview';
import SignaturePreview from '@site/src/components/Api/Preview/SignaturePreview';
import TypeAliasPreview from '@site/src/components/Api/Preview/TypeAliasPreview';
import TypeLiteralPreview from '@site/src/components/Api/Preview/TypeLiteralPreview';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import {ReflectionKind} from '@site/src/components/Api/ReflectionKind';
import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';

export default function CodePreview({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  const Component = useMemo(() => {
    switch (reflection.kind as ReflectionKind) {
      case ReflectionKind.Project:
        break;
      case ReflectionKind.Module:
        break;
      case ReflectionKind.EnumMember:
        break;
      case ReflectionKind.Variable:
        break;
      case ReflectionKind.Function:
        break;
      case ReflectionKind.Namespace:
      case ReflectionKind.Enum:
      case ReflectionKind.Class:
      case ReflectionKind.Interface:
        return ClassPreview;
      case ReflectionKind.Constructor:
        return SignaturePreview;
      case ReflectionKind.Property:
        return PropertyPreview;
      case ReflectionKind.Method:
        return FunctionPreview;
      case ReflectionKind.CallSignature:
        break;
      case ReflectionKind.IndexSignature:
        break;
      case ReflectionKind.ConstructorSignature:
        break;
      case ReflectionKind.Parameter:
        break;
      case ReflectionKind.TypeLiteral:
        return TypeLiteralPreview;
      case ReflectionKind.TypeParameter:
        return TypeParameterPreview;
      case ReflectionKind.Accessor:
        break;
      case ReflectionKind.GetSignature:
        break;
      case ReflectionKind.SetSignature:
        break;
      case ReflectionKind.ObjectLiteral:
        break;
      case ReflectionKind.TypeAlias:
        return TypeAliasPreview;
      case ReflectionKind.Reference:
        break;
    }

    throw new Error(
      `Missing component for reflection: ${reflection.kindString}`,
    );
  }, [reflection.id]);

  return <Component reflection={reflection} />;
}
