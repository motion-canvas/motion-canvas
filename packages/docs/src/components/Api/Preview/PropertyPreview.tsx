import ParameterPreview from '@site/src/components/Api/Preview/ParameterPreview';
import type {JSONOutput} from 'typedoc';

export default function PropertyPreview({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection | JSONOutput.SignatureReflection;
}) {
  return <ParameterPreview reflection={reflection} />;
}
