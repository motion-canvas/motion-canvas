import ClassItem from '@site/src/components/Api/Item/ClassItem';
import FunctionItem from '@site/src/components/Api/Item/FunctionItem';
import ModuleItem from '@site/src/components/Api/Item/ModuleItem';
import ProjectItem from '@site/src/components/Api/Item/ProjectItem';
import PropertyItem from '@site/src/components/Api/Item/PropertyItem';
import TypeAliasItem from '@site/src/components/Api/Item/TypeAliasItem';
import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';
import {ReflectionKind} from '../ReflectionKind';

export default function Item({
  reflection,
  headless = false,
}: {
  reflection: JSONOutput.DeclarationReflection;
  headless?: boolean;
}) {
  const Component = useMemo(() => {
    switch (reflection.kind as ReflectionKind) {
      case ReflectionKind.Project:
        return ProjectItem;
      case ReflectionKind.Module:
        return ModuleItem;
      case ReflectionKind.Namespace:
      case ReflectionKind.Enum:
      case ReflectionKind.Class:
      case ReflectionKind.Interface:
        return ClassItem;
      case ReflectionKind.Function:
      case ReflectionKind.Accessor:
      case ReflectionKind.Constructor:
      case ReflectionKind.Method:
        return FunctionItem;
      case ReflectionKind.Variable:
      case ReflectionKind.Property:
      case ReflectionKind.EnumMember:
        return PropertyItem;
      case ReflectionKind.CallSignature:
        break;
      case ReflectionKind.IndexSignature:
        break;
      case ReflectionKind.ConstructorSignature:
        break;
      case ReflectionKind.Parameter:
        break;
      case ReflectionKind.TypeLiteral:
        break;
      case ReflectionKind.TypeParameter:
        break;
      case ReflectionKind.GetSignature:
        break;
      case ReflectionKind.SetSignature:
        break;
      case ReflectionKind.ObjectLiteral:
        break;
      case ReflectionKind.TypeAlias:
        return TypeAliasItem;
      case ReflectionKind.Reference:
        break;
    }

    throw new Error(
      `Missing component for reflection: ${reflection.kindString}`,
    );
  }, [reflection.kind]);

  return <Component reflection={reflection} headless={headless} />;
}
