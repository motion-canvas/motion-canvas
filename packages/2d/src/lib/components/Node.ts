import {
  BBox,
  ColorSignal,
  DependencyContext,
  PossibleColor,
  PossibleSpacing,
  PossibleVector2,
  Promisable,
  ReferenceReceiver,
  Signal,
  SignalValue,
  SimpleSignal,
  SimpleVector2Signal,
  SpacingSignal,
  ThreadGenerator,
  TimingFunction,
  UNIFORM_DESTINATION_MATRIX,
  UNIFORM_SOURCE_MATRIX,
  UNIFORM_TIME,
  Vector2,
  Vector2Signal,
  all,
  clamp,
  createSignal,
  easeInOutCubic,
  isReactive,
  modify,
  threadable,
  transformAngle,
  transformScalar,
  unwrap,
  useLogger,
} from '@motion-canvas/core';
import {
  NODE_NAME,
  cloneable,
  colorSignal,
  computed,
  getPropertiesOf,
  initial,
  initializeSignals,
  inspectable,
  nodeName,
  parser,
  signal,
  vector2Signal,
  wrapper,
} from '../decorators';
import {FiltersSignal, filtersSignal} from '../decorators/filtersSignal';
import {spacingSignal} from '../decorators/spacingSignal';
import {Filter} from '../partials';
import {
  PossibleShaderConfig,
  ShaderConfig,
  parseShader,
} from '../partials/ShaderConfig';
import {useScene2D} from '../scenes/useScene2D';
import {drawLine} from '../utils';
import type {View2D} from './View2D';
import type {ComponentChild, ComponentChildren, NodeConstructor} from './types';

export type NodeState = NodeProps & Record<string, any>;

export interface NodeProps {
  ref?: ReferenceReceiver<any>;
  children?: SignalValue<ComponentChildren>;
  /**
   * @deprecated Use {@link children} instead.
   */
  spawner?: SignalValue<ComponentChildren>;
  key?: string;

  x?: SignalValue<number>;
  y?: SignalValue<number>;
  position?: SignalValue<PossibleVector2>;
  rotation?: SignalValue<number>;
  scaleX?: SignalValue<number>;
  scaleY?: SignalValue<number>;
  scale?: SignalValue<PossibleVector2>;
  skewX?: SignalValue<number>;
  skewY?: SignalValue<number>;
  skew?: SignalValue<PossibleVector2>;
  zIndex?: SignalValue<number>;

  opacity?: SignalValue<number>;
  filters?: SignalValue<Filter[]>;

  shadowColor?: SignalValue<PossibleColor>;
  shadowBlur?: SignalValue<number>;
  shadowOffsetX?: SignalValue<number>;
  shadowOffsetY?: SignalValue<number>;
  shadowOffset?: SignalValue<PossibleVector2>;

  cache?: SignalValue<boolean>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingTop?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingBottom?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingLeft?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingRight?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePadding?: SignalValue<PossibleSpacing>;

  composite?: SignalValue<boolean>;
  compositeOperation?: SignalValue<GlobalCompositeOperation>;
  /**
   * @experimental
   */
  shaders?: PossibleShaderConfig;
}

@nodeName('Node')
export class Node implements Promisable<Node> {
  /**
   * @internal
   */
  public declare readonly [NODE_NAME]: string;
  public declare isClass: boolean;

  /**
   * Represents the position of this node in local space of its parent.
   *
   * @example
   * Initializing the position:
   * ```tsx
   * // with a possible vector:
   * <Node position={[1, 2]} />
   * // with individual components:
   * <Node x={1} y={2} />
   * ```
   *
   * Accessing the position:
   * ```tsx
   * // retrieving the vector:
   * const position = node.position();
   * // retrieving an individual component:
   * const x = node.position.x();
   * ```
   *
   * Setting the position:
   * ```tsx
   * // with a possible vector:
   * node.position([1, 2]);
   * node.position(() => [1, 2]);
   * // with individual components:
   * node.position.x(1);
   * node.position.x(() => 1);
   * ```
   */
  @vector2Signal()
  public declare readonly position: Vector2Signal<this>;

  public get x() {
    return this.position.x as SimpleSignal<number, this>;
  }
  public get y() {
    return this.position.y as SimpleSignal<number, this>;
  }

  /**
   * A helper signal for operating on the position in world space.
   *
   * @remarks
   * Retrieving the position using this signal returns the position in world
   * space. Similarly, setting the position using this signal transforms the
   * new value to local space.
   *
   * If the new value is a function, the position of this node will be
   * continuously updated to always match the position returned by the function.
   * This can be useful to "pin" the node in a specific place or to make it
   * follow another node's position.
   *
   * Unlike {@link position}, this signal is not compound - it doesn't contain
   * separate signals for the `x` and `y` components.
   */
  @wrapper(Vector2)
  @cloneable(false)
  @signal()
  public declare readonly absolutePosition: SimpleVector2Signal<this>;

  protected getAbsolutePosition(): Vector2 {
    return new Vector2(this.parentToWorld().transformPoint(this.position()));
  }

  protected setAbsolutePosition(value: SignalValue<PossibleVector2>) {
    this.position(
      modify(value, unwrapped =>
        new Vector2(unwrapped).transformAsPoint(this.worldToParent()),
      ),
    );
  }

  /**
   * Represents the rotation (in degrees) of this node relative to its parent.
   */
  @initial(0)
  @signal()
  public declare readonly rotation: SimpleSignal<number, this>;

  /**
   * A helper signal for operating on the rotation in world space.
   *
   * @remarks
   * Retrieving the rotation using this signal returns the rotation in world
   * space. Similarly, setting the rotation using this signal transforms the
   * new value to local space.
   *
   * If the new value is a function, the rotation of this node will be
   * continuously updated to always match the rotation returned by the function.
   */
  @cloneable(false)
  @signal()
  public declare readonly absoluteRotation: SimpleSignal<number, this>;

  protected getAbsoluteRotation() {
    const matrix = this.localToWorld();
    return Vector2.degrees(matrix.m11, matrix.m12);
  }

  protected setAbsoluteRotation(value: SignalValue<number>) {
    this.rotation(
      modify(value, unwrapped =>
        transformAngle(unwrapped, this.worldToParent()),
      ),
    );
  }

  /**
   * Represents the scale of this node in local space of its parent.
   *
   * @example
   * Initializing the scale:
   * ```tsx
   * // with a possible vector:
   * <Node scale={[1, 2]} />
   * // with individual components:
   * <Node scaleX={1} scaleY={2} />
   * ```
   *
   * Accessing the scale:
   * ```tsx
   * // retrieving the vector:
   * const scale = node.scale();
   * // retrieving an individual component:
   * const scaleX = node.scale.x();
   * ```
   *
   * Setting the scale:
   * ```tsx
   * // with a possible vector:
   * node.scale([1, 2]);
   * node.scale(() => [1, 2]);
   * // with individual components:
   * node.scale.x(1);
   * node.scale.x(() => 1);
   * ```
   */
  @initial(Vector2.one)
  @vector2Signal('scale')
  public declare readonly scale: Vector2Signal<this>;

  /**
   * Represents the skew of this node in local space of its parent.
   *
   * @example
   * Initializing the skew:
   * ```tsx
   * // with a possible vector:
   * <Node skew={[40, 20]} />
   * // with individual components:
   * <Node skewX={40} skewY={20} />
   * ```
   *
   * Accessing the skew:
   * ```tsx
   * // retrieving the vector:
   * const skew = node.skew();
   * // retrieving an individual component:
   * const skewX = node.skew.x();
   * ```
   *
   * Setting the skew:
   * ```tsx
   * // with a possible vector:
   * node.skew([40, 20]);
   * node.skew(() => [40, 20]);
   * // with individual components:
   * node.skew.x(40);
   * node.skew.x(() => 40);
   * ```
   */
  @initial(Vector2.zero)
  @vector2Signal('skew')
  public declare readonly skew: Vector2Signal<this>;

  /**
   * A helper signal for operating on the scale in world space.
   *
   * @remarks
   * Retrieving the scale using this signal returns the scale in world space.
   * Similarly, setting the scale using this signal transforms the new value to
   * local space.
   *
   * If the new value is a function, the scale of this node will be continuously
   * updated to always match the position returned by the function.
   *
   * Unlike {@link scale}, this signal is not compound - it doesn't contain
   * separate signals for the `x` and `y` components.
   */
  @wrapper(Vector2)
  @cloneable(false)
  @signal()
  public declare readonly absoluteScale: SimpleVector2Signal<this>;

  protected getAbsoluteScale(): Vector2 {
    const matrix = this.localToWorld();
    return new Vector2(
      Vector2.magnitude(matrix.m11, matrix.m12),
      Vector2.magnitude(matrix.m21, matrix.m22),
    );
  }

  protected setAbsoluteScale(value: SignalValue<PossibleVector2>) {
    this.scale(
      modify(value, unwrapped => this.getRelativeScale(new Vector2(unwrapped))),
    );
  }

  private getRelativeScale(scale: Vector2): Vector2 {
    const parentScale = this.parent()?.absoluteScale() ?? Vector2.one;
    return scale.div(parentScale);
  }

  @initial(0)
  @signal()
  public declare readonly zIndex: SimpleSignal<number, this>;

  @initial(false)
  @signal()
  public declare readonly cache: SimpleSignal<boolean, this>;

  /**
   * Controls the padding of the cached canvas used by this node.
   *
   * @remarks
   * By default, the size of the cache is determined based on the bounding box
   * of the node and its children. That includes effects such as stroke or
   * shadow. This property can be used to expand the cache area further.
   * Usually used to account for custom effects created by {@link shaders}.
   */
  @spacingSignal('cachePadding')
  public declare readonly cachePadding: SpacingSignal<this>;

  @initial(false)
  @signal()
  public declare readonly composite: SimpleSignal<boolean, this>;

  @initial('source-over')
  @signal()
  public declare readonly compositeOperation: SimpleSignal<
    GlobalCompositeOperation,
    this
  >;

  private readonly compositeOverride = createSignal(0);

  @threadable()
  protected *tweenCompositeOperation(
    value: SignalValue<GlobalCompositeOperation>,
    time: number,
    timingFunction: TimingFunction,
  ) {
    const nextValue = unwrap(value);
    if (nextValue === 'source-over') {
      yield* this.compositeOverride(1, time, timingFunction);
      this.compositeOverride(0);
      this.compositeOperation(nextValue);
    } else {
      this.compositeOperation(nextValue);
      this.compositeOverride(1);
      yield* this.compositeOverride(0, time, timingFunction);
    }
  }

  /**
   * Represents the opacity of this node in the range 0-1.
   *
   * @remarks
   * The value is clamped to the range 0-1.
   */
  @initial(1)
  @parser((value: number) => clamp(0, 1, value))
  @signal()
  public declare readonly opacity: SimpleSignal<number, this>;

  @computed()
  public absoluteOpacity(): number {
    return (this.parent()?.absoluteOpacity() ?? 1) * this.opacity();
  }

  @filtersSignal()
  public declare readonly filters: FiltersSignal<this>;

  @initial('#0000')
  @colorSignal()
  public declare readonly shadowColor: ColorSignal<this>;

  @initial(0)
  @signal()
  public declare readonly shadowBlur: SimpleSignal<number, this>;

  @vector2Signal('shadowOffset')
  public declare readonly shadowOffset: Vector2Signal<this>;

  /**
   * @experimental
   */
  @initial([])
  @parser(parseShader)
  @signal()
  public declare readonly shaders: Signal<
    PossibleShaderConfig,
    ShaderConfig[],
    this
  >;

  @computed()
  protected hasFilters(): boolean {
    return !!this.filters().find(filter => filter.isActive());
  }

  @computed()
  protected hasShadow() {
    return (
      !!this.shadowColor() &&
      (this.shadowBlur() > 0 ||
        this.shadowOffset.x() !== 0 ||
        this.shadowOffset.y() !== 0)
    );
  }

  @computed()
  protected filterString(): string {
    let filters = '';
    const matrix = this.compositeToWorld();
    for (const filter of this.filters()) {
      if (filter.isActive()) {
        filters += ' ' + filter.serialize(matrix);
      }
    }

    return filters;
  }

  /**
   * @deprecated Use {@link children} instead.
   */
  @inspectable(false)
  @cloneable(false)
  @signal()
  protected declare readonly spawner: SimpleSignal<ComponentChildren, this>;
  protected getSpawner(): ComponentChildren {
    return this.children();
  }
  protected setSpawner(value: SignalValue<ComponentChildren>) {
    this.children(value);
  }

  @inspectable(false)
  @cloneable(false)
  @signal()
  public declare readonly children: Signal<ComponentChildren, Node[], this>;
  protected setChildren(value: SignalValue<ComponentChildren>) {
    if (this.children.context.raw() === value) {
      return;
    }

    this.children.context.setter(value);
    if (!isReactive(value)) {
      this.spawnChildren(false, value);
    } else if (!this.hasSpawnedChildren) {
      for (const oldChild of this.realChildren) {
        oldChild.parent(null);
      }
    }
  }
  protected getChildren(): Node[] {
    this.children.context.getter();
    return this.spawnedChildren();
  }

  @computed()
  protected spawnedChildren(): Node[] {
    const children = this.children.context.getter();
    if (isReactive(this.children.context.raw())) {
      this.spawnChildren(true, children);
    }
    return this.realChildren;
  }

  @computed()
  protected sortedChildren(): Node[] {
    return [...this.children()].sort((a, b) =>
      Math.sign(a.zIndex() - b.zIndex()),
    );
  }

  protected view2D: View2D;
  private stateStack: NodeState[] = [];
  protected realChildren: Node[] = [];
  protected hasSpawnedChildren = false;
  private unregister: () => void;
  public readonly parent = createSignal<Node | null>(null);
  public readonly properties = getPropertiesOf(this);
  public readonly key: string;
  public readonly creationStack?: string;

  public constructor({children, spawner, key, ...rest}: NodeProps) {
    const scene = useScene2D();
    [this.key, this.unregister] = scene.registerNode(this, key);
    this.view2D = scene.getView();
    this.creationStack = new Error().stack;
    initializeSignals(this, rest);
    if (spawner) {
      useLogger().warn({
        message: 'Node.spawner() has been deprecated.',
        remarks: 'Use <code>Node.children()</code> instead.',
        inspect: this.key,
        stack: new Error().stack,
      });
    }
    this.children(spawner ?? children);
  }

  /**
   * Get the local-to-world matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node to world
   * space.
   *
   * @example
   * Calculate the absolute position of a point located 200 pixels to the right
   * of the node:
   * ```ts
   * const local = new Vector2(0, 200);
   * const world = local.transformAsPoint(node.localToWorld());
   * ```
   */
  @computed()
  public localToWorld(): DOMMatrix {
    const parent = this.parent();
    return parent
      ? parent.localToWorld().multiply(this.localToParent())
      : this.localToParent();
  }

  /**
   * Get the world-to-local matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from world space to local space of this
   * node.
   *
   * @example
   * Calculate the position relative to this node for a point located in the
   * top-left corner of the screen:
   * ```ts
   * const world = new Vector2(0, 0);
   * const local = world.transformAsPoint(node.worldToLocal());
   * ```
   */
  @computed()
  public worldToLocal() {
    return this.localToWorld().inverse();
  }

  /**
   * Get the world-to-parent matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from world space to local space of this
   * node's parent.
   */
  @computed()
  public worldToParent(): DOMMatrix {
    return this.parent()?.worldToLocal() ?? new DOMMatrix();
  }

  /**
   * Get the parent-to-world matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node's parent to
   * world space.
   */
  @computed()
  public parentToWorld(): DOMMatrix {
    return this.parent()?.localToWorld() ?? new DOMMatrix();
  }

  /**
   * Get the local-to-parent matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node to local space
   * of this node's parent.
   */
  @computed()
  public localToParent(): DOMMatrix {
    const matrix = new DOMMatrix();
    matrix.translateSelf(this.x(), this.y());
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scale.x(), this.scale.y());
    matrix.skewXSelf(this.skew.x());
    matrix.skewYSelf(this.skew.y());

    return matrix;
  }

  /**
   * A matrix mapping composite space to world space.
   *
   * @remarks
   * Certain effects such as blur and shadows ignore the current transformation.
   * This matrix can be used to transform their parameters so that the effect
   * appears relative to the closest composite root.
   */
  @computed()
  public compositeToWorld(): DOMMatrix {
    return this.compositeRoot()?.localToWorld() ?? new DOMMatrix();
  }

  @computed()
  protected compositeRoot(): Node | null {
    if (this.composite()) {
      return this;
    }

    return this.parent()?.compositeRoot() ?? null;
  }

  @computed()
  public compositeToLocal() {
    const root = this.compositeRoot();
    if (root) {
      const worldToLocal = this.worldToLocal();
      worldToLocal.m44 = 1;
      return root.localToWorld().multiply(worldToLocal);
    }
    return new DOMMatrix();
  }

  public view(): View2D {
    return this.view2D;
  }

  /**
   * Add the given node(s) as the children of this node.
   *
   * @remarks
   * The nodes will be appended at the end of the children list.
   *
   * @example
   * ```tsx
   * const node = <Layout />;
   * node.add(<Rect />);
   * node.add(<Circle />);
   * ```
   * Result:
   * ```mermaid
   * graph TD;
   *   layout([Layout])
   *   circle([Circle])
   *   rect([Rect])
   *     layout-->rect;
   *     layout-->circle;
   * ```
   *
   * @param node - A node or an array of nodes to append.
   */
  public add(node: ComponentChildren): this {
    return this.insert(node, Infinity);
  }

  /**
   * Insert the given node(s) at the specified index in the children list.
   *
   * @example
   * ```tsx
   * const node = (
   *   <Layout>
   *     <Rect />
   *     <Circle />
   *   </Layout>
   * );
   *
   * node.insert(<Txt />, 1);
   * ```
   *
   * Result:
   * ```mermaid
   * graph TD;
   *   layout([Layout])
   *   circle([Circle])
   *   text([Text])
   *   rect([Rect])
   *     layout-->rect;
   *     layout-->text;
   *     layout-->circle;
   * ```
   *
   * @param node - A node or an array of nodes to insert.
   * @param index - An index at which to insert the node(s).
   */
  public insert(node: ComponentChildren, index = 0): this {
    const array: ComponentChild[] = Array.isArray(node) ? node : [node];
    if (array.length === 0) {
      return this;
    }

    const children = this.children();
    const newChildren = children.slice(0, index);

    for (const node of array) {
      if (node instanceof Node) {
        newChildren.push(node);
        node.remove();
        node.parent(this);
      }
    }

    newChildren.push(...children.slice(index));
    this.setParsedChildren(newChildren);

    return this;
  }

  /**
   * Remove this node from the tree.
   */
  public remove(): this {
    const current = this.parent();
    if (current === null) {
      return this;
    }

    current.removeChild(this);
    this.parent(null);
    return this;
  }

  /**
   * Rearrange this node in relation to its siblings.
   *
   * @remarks
   * Children are rendered starting from the beginning of the children list.
   * We can change the rendering order by rearranging said list.
   *
   * A positive `by` arguments move the node up (it will be rendered on top of
   * the elements it has passed). Negative values move it down.
   *
   * @param by - Number of places by which the node should be moved.
   */
  public move(by = 1): this {
    const parent = this.parent();
    if (by === 0 || !parent) {
      return this;
    }

    const children = parent.children();
    const newChildren: Node[] = [];

    if (by > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child === this) {
          const target = i + by;
          for (; i < target && i + 1 < children.length; i++) {
            newChildren[i] = children[i + 1];
          }
        }
        newChildren[i] = child;
      }
    } else {
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child === this) {
          const target = i + by;
          for (; i > target && i > 0; i--) {
            newChildren[i] = children[i - 1];
          }
        }
        newChildren[i] = child;
      }
    }

    parent.setParsedChildren(newChildren);

    return this;
  }

  /**
   * Move the node up in relation to its siblings.
   *
   * @remarks
   * The node will exchange places with the sibling right above it (if any) and
   * from then on will be rendered on top of it.
   */
  public moveUp(): this {
    return this.move(1);
  }

  /**
   * Move the node down in relation to its siblings.
   *
   * @remarks
   * The node will exchange places with the sibling right below it (if any) and
   * from then on will be rendered under it.
   */
  public moveDown(): this {
    return this.move(-1);
  }

  /**
   * Move the node to the top in relation to its siblings.
   *
   * @remarks
   * The node will be placed at the end of the children list and from then on
   * will be rendered on top of all of its siblings.
   */
  public moveToTop(): this {
    return this.move(Infinity);
  }

  /**
   * Move the node to the bottom in relation to its siblings.
   *
   * @remarks
   * The node will be placed at the beginning of the children list and from then
   * on will be rendered below all of its siblings.
   */
  public moveToBottom(): this {
    return this.move(-Infinity);
  }

  /**
   * Move the node to the provided position relative to its siblings.
   *
   * @remarks
   * If the node is getting moved to a lower position, it will be placed below
   * the sibling that's currently at the provided index (if any).
   * If the node is getting moved to a higher position, it will be placed above
   * the sibling that's currently at the provided index (if any).
   *
   * @param index - The index to move the node to.
   */
  public moveTo(index: number): this {
    const parent = this.parent();
    if (!parent) {
      return this;
    }

    const currentIndex = parent.children().indexOf(this);
    const by = index - currentIndex;

    return this.move(by);
  }

  /**
   * Move the node below the provided node in the parent's layout.
   *
   * @remarks
   * The node will be moved below the provided node and from then on will be
   * rendered below it. By default, if the node is already positioned lower than
   * the sibling node, it will not get moved.
   *
   * @param node - The sibling node below which to move.
   * @param directlyBelow - Whether the node should be positioned directly below
   *                        the sibling. When true, will move the node even if
   *                        it is already positioned below the sibling.
   */
  public moveBelow(node: Node, directlyBelow = false): this {
    const parent = this.parent();
    if (!parent) {
      return this;
    }

    if (node.parent() !== parent) {
      useLogger().error(
        "Cannot position nodes relative to each other if they don't belong to the same parent.",
      );
      return this;
    }

    const children = parent.children();
    const ownIndex = children.indexOf(this);
    const otherIndex = children.indexOf(node);

    if (!directlyBelow && ownIndex < otherIndex) {
      // Nothing to do if the node is already positioned below the target node.
      // We could move the node so it's directly below the sibling node, but
      // that might suddenly move it on top of other nodes. This is likely
      // not what the user wanted to happen when calling this method.
      return this;
    }

    const by = otherIndex - ownIndex - 1;

    return this.move(by);
  }

  /**
   * Move the node above the provided node in the parent's layout.
   *
   * @remarks
   * The node will be moved above the provided node and from then on will be
   * rendered on top of it. By default, if the node is already positioned
   * higher than the sibling node, it will not get moved.
   *
   * @param node - The sibling node below which to move.
   * @param directlyAbove - Whether the node should be positioned directly above the
   *                        sibling. When true, will move the node even if it is
   *                        already positioned above the sibling.
   */
  public moveAbove(node: Node, directlyAbove = false): this {
    const parent = this.parent();
    if (!parent) {
      return this;
    }

    if (node.parent() !== parent) {
      useLogger().error(
        "Cannot position nodes relative to each other if they don't belong to the same parent.",
      );
      return this;
    }

    const children = parent.children();
    const ownIndex = children.indexOf(this);
    const otherIndex = children.indexOf(node);

    if (!directlyAbove && ownIndex > otherIndex) {
      // Nothing to do if the node is already positioned above the target node.
      // We could move the node so it's directly above the sibling node, but
      // that might suddenly move it below other nodes. This is likely not what
      // the user wanted to happen when calling this method.
      return this;
    }

    const by = otherIndex - ownIndex + 1;

    return this.move(by);
  }

  /**
   * Change the parent of this node while keeping the absolute transform.
   *
   * @remarks
   * After performing this operation, the node will stay in the same place
   * visually, but its parent will be changed.
   *
   * @param newParent - The new parent of this node.
   */
  public reparent(newParent: Node): this {
    const position = this.absolutePosition();
    const rotation = this.absoluteRotation();
    const scale = this.absoluteScale();
    newParent.add(this);
    this.absolutePosition(position);
    this.absoluteRotation(rotation);
    this.absoluteScale(scale);

    return this;
  }

  /**
   * Remove all children of this node.
   */
  public removeChildren(): this {
    for (const oldChild of this.realChildren) {
      oldChild.parent(null);
    }
    this.setParsedChildren([]);

    return this;
  }

  /**
   * Get the current children of this node.
   *
   * @remarks
   * Unlike {@link children}, this method does not have any side effects.
   * It does not register the `children` signal as a dependency, and it does not
   * spawn any children. It can be used to safely retrieve the current state of
   * the scene graph for debugging purposes.
   */
  public peekChildren(): readonly Node[] {
    return this.realChildren;
  }

  /**
   * Find all descendants of this node that match the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findAll<T extends Node>(predicate: (node: any) => node is T): T[];
  /**
   * Find all descendants of this node that match the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findAll<T extends Node = Node>(predicate: (node: any) => boolean): T[];
  public findAll<T extends Node>(predicate: (node: any) => node is T): T[] {
    const result: T[] = [];
    const queue = this.reversedChildren();
    while (queue.length > 0) {
      const node = queue.pop()!;
      if (predicate(node)) {
        result.push(node);
      }
      const children = node.children();
      for (let i = children.length - 1; i >= 0; i--) {
        queue.push(children[i]);
      }
    }

    return result;
  }

  /**
   * Find the first descendant of this node that matches the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findFirst<T extends Node>(
    predicate: (node: Node) => node is T,
  ): T | null;
  /**
   * Find the first descendant of this node that matches the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findFirst<T extends Node = Node>(
    predicate: (node: Node) => boolean,
  ): T | null;
  public findFirst<T extends Node>(
    predicate: (node: Node) => node is T,
  ): T | null {
    const queue = this.reversedChildren();
    while (queue.length > 0) {
      const node = queue.pop()!;
      if (predicate(node)) {
        return node;
      }
      const children = node.children();
      for (let i = children.length - 1; i >= 0; i--) {
        queue.push(children[i]);
      }
    }

    return null;
  }

  /**
   * Find the last descendant of this node that matches the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findLast<T extends Node>(
    predicate: (node: Node) => node is T,
  ): T | null;
  /**
   * Find the last descendant of this node that matches the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findLast<T extends Node = Node>(
    predicate: (node: Node) => boolean,
  ): T | null;
  public findLast<T extends Node>(
    predicate: (node: Node) => node is T,
  ): T | null {
    const search: Node[] = [];
    const queue = this.reversedChildren();

    while (queue.length > 0) {
      const node = queue.pop()!;
      search.push(node);
      const children = node.children();
      for (let i = children.length - 1; i >= 0; i--) {
        queue.push(children[i]);
      }
    }

    while (search.length > 0) {
      const node = search.pop()!;
      if (predicate(node)) {
        return node;
      }
    }

    return null;
  }

  /**
   * Find the closest ancestor of this node that matches the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findAncestor<T extends Node>(
    predicate: (node: Node) => node is T,
  ): T | null;
  /**
   * Find the closest ancestor of this node that matches the given predicate.
   *
   * @param predicate - A function that returns true if the node matches.
   */
  public findAncestor<T extends Node = Node>(
    predicate: (node: Node) => boolean,
  ): T | null;
  public findAncestor<T extends Node>(
    predicate: (node: Node) => node is T,
  ): T | null {
    let parent: Node | null = this.parent();
    while (parent) {
      if (predicate(parent)) {
        return parent;
      }
      parent = parent.parent();
    }

    return null;
  }

  /**
   * Get the nth children cast to the specified type.
   *
   * @param index - The index of the child to retrieve.
   */
  public childAs<T extends Node = Node>(index: number): T | null {
    return (this.children()[index] as T) ?? null;
  }

  /**
   * Get the children array cast to the specified type.
   */
  public childrenAs<T extends Node = Node>(): T[] {
    return this.children() as T[];
  }

  /**
   * Get the parent cast to the specified type.
   */
  public parentAs<T extends Node = Node>(): T | null {
    return (this.parent() as T) ?? null;
  }

  /**
   * Prepare this node to be disposed of.
   *
   * @remarks
   * This method is called automatically when a scene is refreshed. It will
   * be called even if the node is not currently attached to the tree.
   *
   * The goal of this method is to clean any external references to allow the
   * node to be garbage collected.
   */
  public dispose() {
    if (!this.unregister) {
      return;
    }

    this.stateStack = [];
    this.unregister();
    this.unregister = null!;
    for (const {signal} of this) {
      signal?.context.dispose();
    }
    for (const child of this.realChildren) {
      child.dispose();
    }
  }

  /**
   * Create a copy of this node.
   *
   * @param customProps - Properties to override.
   */
  public clone(customProps: NodeState = {}): this {
    const props = {...customProps};
    if (isReactive(this.children.context.raw())) {
      props.children ??= this.children.context.raw();
    } else if (this.children().length > 0) {
      props.children ??= this.children().map(child => child.clone());
    }

    for (const {key, meta, signal} of this) {
      if (!meta.cloneable || key in props) continue;
      if (meta.compound) {
        for (const [key, property] of meta.compoundEntries) {
          if (property in props) continue;
          const component = (<Record<string, SimpleSignal<any>>>(
            (<unknown>signal)
          ))[key];
          if (!component.context.isInitial()) {
            props[property] = component.context.raw();
          }
        }
      } else if (!signal.context.isInitial()) {
        props[key] = signal.context.raw();
      }
    }

    return this.instantiate(props);
  }

  /**
   * Create a copy of this node.
   *
   * @remarks
   * Unlike {@link clone}, a snapshot clone calculates any reactive properties
   * at the moment of cloning and passes the raw values to the copy.
   *
   * @param customProps - Properties to override.
   */
  public snapshotClone(customProps: NodeState = {}): this {
    const props = {
      ...this.getState(),
      ...customProps,
    };

    if (this.children().length > 0) {
      props.children ??= this.children().map(child => child.snapshotClone());
    }

    return this.instantiate(props);
  }

  /**
   * Create a reactive copy of this node.
   *
   * @remarks
   * A reactive copy has all its properties dynamically updated to match the
   * source node.
   *
   * @param customProps - Properties to override.
   */
  public reactiveClone(customProps: NodeState = {}): this {
    const props = {...customProps};
    if (this.children().length > 0) {
      props.children ??= this.children().map(child => child.reactiveClone());
    }

    for (const {key, meta, signal} of this) {
      if (!meta.cloneable || key in props) continue;
      props[key] = () => signal();
    }

    return this.instantiate(props);
  }

  /**
   * Create an instance of this node's class.
   *
   * @param props - Properties to pass to the constructor.
   */
  public instantiate(props: NodeProps = {}): this {
    return new (<NodeConstructor<NodeProps, this>>this.constructor)(props);
  }

  /**
   * Set the children without parsing them.
   *
   * @remarks
   * This method assumes that the caller took care of parsing the children and
   * updating the hierarchy.
   *
   * @param value - The children to set.
   */
  protected setParsedChildren(value: Node[]) {
    this.children.context.setter(value);
    this.realChildren = value;
  }

  protected spawnChildren(reactive: boolean, children: ComponentChildren) {
    const parsedChildren = this.parseChildren(children);

    const keep = new Set<string>();
    for (const newChild of parsedChildren) {
      const current = newChild.parent.context.raw() as Node | null;
      if (current && current !== this) {
        current.removeChild(newChild);
      }
      keep.add(newChild.key);
      newChild.parent(this);
    }

    for (const oldChild of this.realChildren) {
      if (!keep.has(oldChild.key)) {
        oldChild.parent(null);
      }
    }

    this.hasSpawnedChildren = reactive;
    this.realChildren = parsedChildren;
  }

  /**
   * Parse any `ComponentChildren` into an array of nodes.
   *
   * @param children - The children to parse.
   */
  protected parseChildren(children: ComponentChildren): Node[] {
    const result: Node[] = [];
    const array = Array.isArray(children) ? children : [children];
    for (const child of array) {
      if (child instanceof Node) {
        result.push(child);
      }
    }

    return result;
  }

  /**
   * Remove the given child.
   */
  protected removeChild(child: Node) {
    this.setParsedChildren(this.children().filter(node => node !== child));
  }

  /**
   * Whether this node should be cached or not.
   */
  protected requiresCache(): boolean {
    return (
      this.cache() ||
      this.opacity() < 1 ||
      this.compositeOperation() !== 'source-over' ||
      this.hasFilters() ||
      this.hasShadow() ||
      this.shaders().length > 0
    );
  }

  @computed()
  protected cacheCanvas(): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas').getContext('2d');
    if (!canvas) {
      throw new Error('Could not create a cache canvas');
    }

    return canvas;
  }

  /**
   * Get a cache canvas with the contents of this node rendered onto it.
   */
  @computed()
  protected cachedCanvas() {
    const context = this.cacheCanvas();
    const cache = this.worldSpaceCacheBBox();
    const matrix = this.localToWorld();

    context.canvas.width = cache.width;
    context.canvas.height = cache.height;

    context.setTransform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e - cache.x,
      matrix.f - cache.y,
    );
    this.draw(context);

    return context;
  }

  /**
   * Get a bounding box for the contents rendered by this node.
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  protected getCacheBBox(): BBox {
    return new BBox();
  }

  /**
   * Get a bounding box for the contents rendered by this node as well
   * as its children.
   */
  @computed()
  public cacheBBox(): BBox {
    const cache = this.getCacheBBox();
    const children = this.children();
    const padding = this.cachePadding();
    if (children.length === 0) {
      return cache.addSpacing(padding);
    }

    const points: Vector2[] = cache.corners;
    for (const child of children) {
      const childCache = child.fullCacheBBox();
      const childMatrix = child.localToParent();
      points.push(
        ...childCache.corners.map(r => r.transformAsPoint(childMatrix)),
      );
    }

    const bbox = BBox.fromPoints(...points);
    return bbox.addSpacing(padding);
  }

  /**
   * Get a bounding box for the contents rendered by this node (including
   * effects applied after caching).
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  @computed()
  protected fullCacheBBox(): BBox {
    const matrix = this.compositeToLocal();
    const shadowOffset = this.shadowOffset().transform(matrix);
    const shadowBlur = transformScalar(this.shadowBlur(), matrix);

    const result = this.cacheBBox().expand(
      this.filters.blur() * 2 + shadowBlur,
    );

    if (shadowOffset.x < 0) {
      result.x += shadowOffset.x;
      result.width -= shadowOffset.x;
    } else {
      result.width += shadowOffset.x;
    }

    if (shadowOffset.y < 0) {
      result.y += shadowOffset.y;
      result.height -= shadowOffset.y;
    } else {
      result.height += shadowOffset.y;
    }

    return result;
  }

  /**
   * Get a bounding box in world space for the contents rendered by this node as
   * well as its children.
   *
   * @remarks
   * This is the same the bounding box returned by {@link cacheBBox} only
   * transformed to world space.
   */
  @computed()
  protected worldSpaceCacheBBox(): BBox {
    const viewBBox = BBox.fromSizeCentered(this.view().size()).expand(
      this.view().cachePadding(),
    );
    const canvasBBox = BBox.fromPoints(
      ...viewBBox.transformCorners(this.view().localToWorld()),
    );
    const cacheBBox = BBox.fromPoints(
      ...this.cacheBBox().transformCorners(this.localToWorld()),
    );

    return canvasBBox.intersection(cacheBBox).pixelPerfect.expand(2);
  }

  @computed()
  protected parentWorldSpaceCacheBBox(): BBox {
    return (
      this.findAncestor(node => node.requiresCache())?.worldSpaceCacheBBox() ??
      new BBox(Vector2.zero, useScene2D().getRealSize())
    );
  }

  /**
   * Prepare the given context for drawing a cached node onto it.
   *
   * @remarks
   * This method is called before the contents of the cache canvas are drawn
   * on the screen. It can be used to apply effects to the entire node together
   * with its children, instead of applying them individually.
   * Effects such as transparency, shadows, and filters use this technique.
   *
   * Whether the node is cached is decided by the {@link requiresCache} method.
   *
   * @param context - The context using which the cache will be drawn.
   */
  protected setupDrawFromCache(context: CanvasRenderingContext2D) {
    context.globalCompositeOperation = this.compositeOperation();
    context.globalAlpha *= this.opacity();
    if (this.hasFilters()) {
      context.filter = this.filterString();
    }
    if (this.hasShadow()) {
      const matrix = this.compositeToWorld();
      const offset = this.shadowOffset().transform(matrix);
      const blur = transformScalar(this.shadowBlur(), matrix);

      context.shadowColor = this.shadowColor().serialize();
      context.shadowBlur = blur;
      context.shadowOffsetX = offset.x;
      context.shadowOffsetY = offset.y;
    }

    const matrix = this.worldToLocal();
    context.transform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e,
      matrix.f,
    );
  }

  protected renderFromSource(
    context: CanvasRenderingContext2D,
    source: CanvasImageSource,
    x: number,
    y: number,
  ) {
    this.setupDrawFromCache(context);

    const compositeOverride = this.compositeOverride();
    context.drawImage(source, x, y);
    if (compositeOverride > 0) {
      context.save();
      context.globalAlpha *= compositeOverride;
      context.globalCompositeOperation = 'source-over';
      context.drawImage(source, x, y);
      context.restore();
    }
  }

  private shaderCanvas(destination: TexImageSource, source: TexImageSource) {
    const shaders = this.shaders();
    if (shaders.length === 0) {
      return null;
    }

    const scene = useScene2D();
    const size = scene.getRealSize();
    const parentCacheRect = this.parentWorldSpaceCacheBBox();
    const cameraToWorld = new DOMMatrix()
      .scaleSelf(
        size.width / parentCacheRect.width,
        size.height / -parentCacheRect.height,
      )
      .translateSelf(
        parentCacheRect.x / -size.width,
        parentCacheRect.y / size.height - 1,
      );

    const cacheRect = this.worldSpaceCacheBBox();
    const cameraToCache = new DOMMatrix()
      .scaleSelf(size.width / cacheRect.width, size.height / -cacheRect.height)
      .translateSelf(cacheRect.x / -size.width, cacheRect.y / size.height - 1)
      .invertSelf();

    const gl = scene.shaders.getGL();
    scene.shaders.copyTextures(destination, source);
    scene.shaders.clear();

    for (const shader of shaders) {
      const program = scene.shaders.getProgram(shader.fragment);
      if (!program) {
        continue;
      }

      if (shader.uniforms) {
        for (const [name, uniform] of Object.entries(shader.uniforms)) {
          const location = gl.getUniformLocation(program, name);
          if (location === null) {
            continue;
          }

          const value = unwrap(uniform);
          if (typeof value === 'number') {
            gl.uniform1f(location, value);
          } else if ('toUniform' in value) {
            value.toUniform(gl, location);
          } else if (value.length === 1) {
            gl.uniform1f(location, value[0]);
          } else if (value.length === 2) {
            gl.uniform2f(location, value[0], value[1]);
          } else if (value.length === 3) {
            gl.uniform3f(location, value[0], value[1], value[2]);
          } else if (value.length === 4) {
            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
          }
        }
      }

      gl.uniform1f(
        gl.getUniformLocation(program, UNIFORM_TIME),
        this.view2D.globalTime(),
      );

      gl.uniform1i(
        gl.getUniformLocation(program, UNIFORM_TIME),
        scene.playback.frame,
      );

      gl.uniformMatrix4fv(
        gl.getUniformLocation(program, UNIFORM_SOURCE_MATRIX),
        false,
        cameraToCache.toFloat32Array(),
      );

      gl.uniformMatrix4fv(
        gl.getUniformLocation(program, UNIFORM_DESTINATION_MATRIX),
        false,
        cameraToWorld.toFloat32Array(),
      );

      shader.setup?.(gl, program);
      scene.shaders.render();
      shader.teardown?.(gl, program);
    }

    return gl.canvas;
  }

  /**
   * Render this node onto the given canvas.
   *
   * @param context - The context to draw with.
   */
  public render(context: CanvasRenderingContext2D) {
    if (this.absoluteOpacity() <= 0) {
      return;
    }

    context.save();
    this.transformContext(context);

    if (this.requiresCache()) {
      const cacheRect = this.worldSpaceCacheBBox();
      if (cacheRect.width !== 0 && cacheRect.height !== 0) {
        const cache = this.cachedCanvas().canvas;
        const source = this.shaderCanvas(context.canvas, cache);
        if (source) {
          this.renderFromSource(context, source, 0, 0);
        } else {
          this.renderFromSource(
            context,
            cache,
            cacheRect.position.x,
            cacheRect.position.y,
          );
        }
      }
    } else {
      this.draw(context);
    }

    context.restore();
  }

  /**
   * Draw this node onto the canvas.
   *
   * @remarks
   * This method is used when drawing directly onto the screen as well as onto
   * the cache canvas.
   * It assumes that the context have already been transformed to local space.
   *
   * @param context - The context to draw with.
   */
  protected draw(context: CanvasRenderingContext2D) {
    this.drawChildren(context);
  }

  protected drawChildren(context: CanvasRenderingContext2D) {
    for (const child of this.sortedChildren()) {
      child.render(context);
    }
  }

  /**
   * Draw an overlay for this node.
   *
   * @remarks
   * The overlay for the currently inspected node is displayed on top of the
   * canvas.
   *
   * The provided context is in screen space. The local-to-screen matrix can be
   * used to transform all shapes that need to be displayed.
   * This approach allows to keep the line widths and gizmo sizes consistent,
   * no matter how zoomed-in the view is.
   *
   * @param context - The context to draw with.
   * @param matrix - A local-to-screen matrix.
   */
  public drawOverlay(context: CanvasRenderingContext2D, matrix: DOMMatrix) {
    const box = this.cacheBBox().transformCorners(matrix);
    const cache = this.getCacheBBox().transformCorners(matrix);
    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();

    context.strokeStyle = 'blue';
    context.beginPath();
    drawLine(context, cache);
    context.closePath();
    context.stroke();
  }

  protected transformContext(context: CanvasRenderingContext2D) {
    const matrix = this.localToParent();
    context.transform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e,
      matrix.f,
    );
  }

  /**
   * Try to find a node intersecting the given position.
   *
   * @param position - The searched position.
   */
  public hit(position: Vector2): Node | null {
    let hit: Node | null = null;
    const local = position.transformAsPoint(this.localToParent().inverse());
    const children = this.children();
    for (let i = children.length - 1; i >= 0; i--) {
      hit = children[i].hit(local);
      if (hit) {
        break;
      }
    }

    return hit;
  }

  /**
   * Collect all asynchronous resources used by this node.
   */
  protected collectAsyncResources() {
    for (const child of this.children()) {
      child.collectAsyncResources();
    }
  }

  /**
   * Wait for any asynchronous resources that this node or its children have.
   *
   * @remarks
   * Certain resources like images are always loaded asynchronously.
   * Awaiting this method makes sure that all such resources are done loading
   * before continuing the animation.
   */
  public async toPromise(): Promise<this> {
    do {
      await DependencyContext.consumePromises();
      this.collectAsyncResources();
    } while (DependencyContext.hasPromises());
    return this;
  }

  /**
   * Return a snapshot of the node's current signal values.
   *
   * @remarks
   * This method will calculate the values of any reactive properties of the
   * node at the time the method is called.
   */
  public getState(): NodeState {
    const state: NodeState = {};
    for (const {key, meta, signal} of this) {
      if (!meta.cloneable || key in state) continue;
      state[key] = signal();
    }
    return state;
  }

  /**
   * Apply the given state to the node, setting all matching signal values to
   * the provided values.
   *
   * @param state - The state to apply to the node.
   */
  public applyState(state: NodeState): void;
  /**
   * Smoothly transition between the current state of the node and the given
   * state.
   *
   * @param state - The state to transition to.
   * @param duration - The duration of the transition.
   * @param timing - The timing function to use for the transition.
   */
  public applyState(
    state: NodeState,
    duration: number,
    timing?: TimingFunction,
  ): ThreadGenerator;
  public applyState(
    state: NodeState,
    duration?: number,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator | void {
    if (duration === undefined) {
      for (const key in state) {
        const signal = this.signalByKey(key);
        if (signal) {
          signal(state[key]);
        }
      }
    }

    const tasks: ThreadGenerator[] = [];
    for (const key in state) {
      const signal = this.signalByKey(key);
      if (state[key] !== signal.context.raw()) {
        tasks.push(signal(state[key], duration!, timing));
      }
    }

    return all(...tasks);
  }

  /**
   * Push a snapshot of the node's current state onto the node's state stack.
   *
   * @remarks
   * This method can be used together with the {@link restore} method to save a
   * node's current state and later restore it. It is possible to store more
   * than one state by calling `save` method multiple times.
   */
  public save(): void {
    this.stateStack.push(this.getState());
  }

  /**
   * Restore the node to its last saved state.
   *
   * @remarks
   * This method can be used together with the {@link save} method to restore a
   * node to a previously saved state. Restoring a node to a previous state
   * removes that state from the state stack.
   *
   * @example
   * ```tsx
   * const node = <Circle width={100} height={100} fill={"lightseagreen"} />
   *
   * view.add(node);
   *
   * // Save the node's current state
   * node.save();
   *
   * // Modify some of the node's properties
   * yield* node.scale(2, 1);
   * yield* node.fill('hotpink', 1);
   *
   * // Restore the node to its saved state
   * node.restore();
   * ```
   */
  public restore(): void;
  /**
   * Tween the node to its last saved state.
   *
   * @remarks
   * This method can be used together with the {@link save} method to restore a
   * node to a previously saved state. Restoring a node to a previous state
   * removes that state from the state stack.
   *
   * @example
   * ```tsx
   * const node = <Circle width={100} height={100} fill={"lightseagreen"} />
   *
   * view.add(node);
   *
   * // Save the node's current state
   * node.save();
   *
   * // Modify some of the node's properties
   * yield* node.scale(2, 1);
   * yield* node.fill('hotpink', 1);
   *
   * // Tween the node to its saved state over 1 second
   * yield* node.restore(1);
   * ```
   *
   * @param duration - The duration of the transition.
   * @param timing - The timing function to use for the transition.
   */
  public restore(duration: number, timing?: TimingFunction): ThreadGenerator;
  public restore(
    duration?: number,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator | void {
    const state = this.stateStack.pop();

    if (state !== undefined) {
      return this.applyState(state, duration!, timing);
    }
  }

  public *[Symbol.iterator]() {
    for (const key in this.properties) {
      const meta = this.properties[key];
      const signal = this.signalByKey(key);
      yield {meta, signal, key};
    }
  }

  private signalByKey(key: string): SimpleSignal<any> {
    return (<Record<string, SimpleSignal<any>>>(<unknown>this))[key];
  }

  private reversedChildren() {
    const children = this.children();
    const result: Node[] = [];
    for (let i = children.length - 1; i >= 0; i--) {
      result.push(children[i]);
    }
    return result;
  }
}

Node.prototype.isClass = true;
