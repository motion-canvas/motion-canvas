import {
  Layout,
  LayoutProps,
  Node,
  NodeProps,
  Rect,
} from '@motion-canvas/2d/lib/components';
import {initial, signal} from '@motion-canvas/2d/lib/decorators';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {createRef, range} from '@motion-canvas/core/lib/utils';

/**
 * The Motion Canvas Icon as a component.
 * Code has been taken from the example repository.
 *
 * See https://github.com/motion-canvas/examples/blob/master/examples/logo/src/scenes/logo.tsx
 * for original implementation.
 */
export class AnimatedMotionCanvasIcon extends Node {
  /**
   * Defines Animations progress between [0,1]
   *
   * @remarks
   * Range outside 0,1 is allowed and causes the animation
   * to keep looping.
   *
   * Best results with a linear tweening function.
   */
  @initial(0)
  @signal()
  public declare readonly timePassed: SimpleSignal<number, this>;

  public constructor(props?: NodeProps & {timePassed?: SignalValue<number>}) {
    super(props);

    const Trail = (props: LayoutProps) => (
      <Layout layout direction={'column'} gap={30} offsetY={-1} {...props} />
    );
    const YELLOW = '#FFC66D';
    const RED = '#FF6470';
    const GREEN = '#99C47A';
    const star = createRef<Node>();
    const trail1 = createRef<Layout>();
    const trail2 = createRef<Layout>();
    const trail3 = createRef<Layout>();
    const dot = createRef<Rect>();

    this.add(
      <>
        <Layout layout={false}>
          <Node rotation={-45} position={44} scale={0.8}>
            <Node cache y={-270}>
              <Trail
                y={() => (-150 * 4 * this.timePassed()) % 150}
                ref={trail1}
              >
                {range(3).map(() => (
                  <Rect width={40} radius={20} height={120} fill={YELLOW} />
                ))}
              </Trail>
              <Rect
                width={40}
                radius={20}
                height={270}
                fill={'white'}
                offsetY={-1}
                compositeOperation={'destination-in'}
              />
            </Node>
            <Node cache x={-70} y={-200}>
              <Trail
                y={() => (-150 * 2 * this.timePassed()) % 150}
                ref={trail2}
              >
                {range(3).map(() => (
                  <Rect width={40} height={120} radius={20} fill={RED} />
                ))}
              </Trail>
              <Rect
                width={40}
                radius={20}
                height={180}
                fill={'white'}
                offsetY={-1}
                compositeOperation={'destination-in'}
              />
            </Node>
            <Node cache x={70} y={-300}>
              <Trail
                y={() => (-130 * 2 * this.timePassed()) % 130}
                ref={trail3}
              >
                {range(4).map(i => (
                  <Rect
                    ref={i === 1 ? dot : undefined}
                    width={40}
                    radius={20}
                    height={100}
                    fill={GREEN}
                    offsetY={1}
                  />
                ))}
              </Trail>
              <Rect
                width={40}
                radius={20}
                height={220}
                fill={'white'}
                offsetY={-1}
                y={60}
                compositeOperation={'destination-in'}
              />
            </Node>
            <Node rotation={() => this.timePassed() * 360} ref={star}>
              {range(5).map(i => (
                <Rect
                  width={100}
                  radius={50}
                  height={150}
                  fill={'#36393F'}
                  offsetY={1}
                  rotation={(360 / 5) * i}
                />
              ))}
              {range(5).map(i => (
                <Rect
                  width={40}
                  radius={20}
                  height={120}
                  fill={'white'}
                  offsetY={1}
                  rotation={(360 / 5) * i}
                />
              ))}
            </Node>
          </Node>
        </Layout>
      </>,
    );
  }
}
