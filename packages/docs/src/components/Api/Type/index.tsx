import ArrayType from '@site/src/components/Api/Type/ArrayType';
import ConditionalType from '@site/src/components/Api/Type/ConditionalType';
import IndexedAccessType from '@site/src/components/Api/Type/IndexedAccessType';
import InferredType from '@site/src/components/Api/Type/InferredType';
import IntersectionType from '@site/src/components/Api/Type/IntersectionType';
import IntrinsicType from '@site/src/components/Api/Type/IntrinsicType';
import LiteralType from '@site/src/components/Api/Type/LiteralType';
import MappedType from '@site/src/components/Api/Type/MappedType';
import NamedTupleMemberType from '@site/src/components/Api/Type/NamedTupleMemberType';
import PredicateType from '@site/src/components/Api/Type/PredicateType';
import QueryType from '@site/src/components/Api/Type/QueryType';
import ReferenceType from '@site/src/components/Api/Type/ReferenceType';
import ReflectionType from '@site/src/components/Api/Type/ReflectionType';
import TemplateLiteralType from '@site/src/components/Api/Type/TemplateLiteralType';
import TupleType from '@site/src/components/Api/Type/TupleType';
import TypeOperatorType from '@site/src/components/Api/Type/TypeOperatorType';
import UnionType from '@site/src/components/Api/Type/UnionType';
import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';

export interface CodeTypeProps {
  type: JSONOutput.SomeType;
}

export default function CodeType(props: CodeTypeProps) {
  const TypeComponent = useMemo(() => {
    switch (props.type.type) {
      case 'rest':
        break;
      case 'typeOperator':
        return TypeOperatorType;
      case 'conditional':
        return ConditionalType;
      case 'reflection':
        return ReflectionType;
      case 'query':
        return QueryType;
      case 'named-tuple-member':
        return NamedTupleMemberType;
      case 'optional':
        break;
      case 'union':
        return UnionType;
      case 'intrinsic':
        return IntrinsicType;
      case 'literal':
        return LiteralType;
      case 'unknown':
        break;
      case 'reference':
        return ReferenceType;
      case 'predicate':
        return PredicateType;
      case 'tuple':
        return TupleType;
      case 'array':
        return ArrayType;
      case 'intersection':
        return IntersectionType;
      case 'inferred':
        return InferredType;
      case 'mapped':
        return MappedType;
      case 'template-literal':
        return TemplateLiteralType;
      case 'indexedAccess':
        return IndexedAccessType;
    }

    throw new Error(`Missing component for type: ${props.type.type}`);
  }, [props.type]) as React.FC<CodeTypeProps>;

  return <TypeComponent {...props} />;
}
