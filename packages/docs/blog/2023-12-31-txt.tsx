import {Txt, makeScene2D} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  view.fill('#141414');
  view.add(
    // prettier-ignore
    <Txt fill={'white'} fontSize={32} width={720} textWrap>
      Whereas recognition of the inherent dignity and of the{' '}
      <Txt.i>equal</Txt.i> and inalienable rights of all members of
      the human family is the foundation of <Txt.b>freedom</Txt.b>,
      justice and <Txt fill="#25C281">peace</Txt> in the world.
    </Txt>,
  );
});
