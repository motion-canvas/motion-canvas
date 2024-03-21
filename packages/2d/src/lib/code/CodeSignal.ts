import {
  createSignal,
  deepLerp,
  DependencyContext,
  Signal,
  SignalContext,
  SignalValue,
  ThreadGenerator,
  TimingFunction,
  unwrap,
} from '@motion-canvas/core';
import {Code} from '../components';
import {addInitializer, getPropertyMetaOrCreate} from '../decorators';
import {defaultDiffer} from './CodeDiffer';
import {insert, replace} from './CodeFragment';
import {CodeHighlighter} from './CodeHighlighter';
import {CodePoint, CodeRange} from './CodeRange';
import {
  CODE,
  CodeScope,
  CodeTag,
  parseCodeScope,
  PossibleCodeScope,
  resolveCodeTag,
} from './CodeScope';
import {defaultTokenize} from './CodeTokenizer';
import {extractRange} from './extractRange';

interface CodeModifier<TOwner> {
  (code: CodeTag): TOwner;
  (code: CodeTag, duration: number): ThreadGenerator;
  (duration?: number): TagGenerator;
}

interface CodeInsert<TOwner> {
  (point: CodePoint, code: CodeTag): TOwner;
  (point: CodePoint, code: CodeTag, duration: number): ThreadGenerator;
  (point: CodePoint, duration?: number): TagGenerator;
}

interface CodeRemove<TOwner> {
  (range: CodeRange): TOwner;
  (range: CodeRange, duration: number): ThreadGenerator;
}

interface CodeReplace<TOwner> {
  (range: CodeRange, code: CodeTag): TOwner;
  (range: CodeRange, code: CodeTag, duration: number): ThreadGenerator;
  (range: CodeRange, duration?: number): TagGenerator;
}

type TagGenerator = (
  strings: TemplateStringsArray,
  ...tags: CodeTag[]
) => ThreadGenerator;

export interface CodeSignalHelpers<TOwner> {
  edit(duration?: number): TagGenerator;
  append: CodeModifier<TOwner>;
  prepend: CodeModifier<TOwner>;
  insert: CodeInsert<TOwner>;
  remove: CodeRemove<TOwner>;
  replace: CodeReplace<TOwner>;
}

export type CodeSignal<TOwner> = Signal<
  PossibleCodeScope,
  CodeScope,
  TOwner,
  CodeSignalContext<TOwner>
> &
  CodeSignalHelpers<TOwner>;

export class CodeSignalContext<TOwner>
  extends SignalContext<PossibleCodeScope, CodeScope, TOwner>
  implements CodeSignalHelpers<TOwner>
{
  private readonly progress = createSignal(0);

  public constructor(
    initial: SignalValue<PossibleCodeScope>,
    owner: TOwner,
    private readonly highlighter?: SignalValue<CodeHighlighter | null>,
  ) {
    super(initial, deepLerp, owner);
    if (owner instanceof Code) {
      this.highlighter ??= owner.highlighter;
    }
    Object.defineProperty(this.invokable, 'edit', {
      value: this.edit.bind(this),
    });
    Object.defineProperty(this.invokable, 'append', {
      value: this.append.bind(this),
    });
    Object.defineProperty(this.invokable, 'prepend', {
      value: this.prepend.bind(this),
    });
    Object.defineProperty(this.invokable, 'insert', {
      value: this.insert.bind(this),
    });
    Object.defineProperty(this.invokable, 'remove', {
      value: this.remove.bind(this),
    });
    Object.defineProperty(this.invokable, 'replace', {
      value: this.replace.bind(this),
    });
  }

  public override *tweener(
    value: SignalValue<PossibleCodeScope>,
    duration: number,
    timingFunction: TimingFunction,
  ): ThreadGenerator {
    let tokenize = defaultTokenize;
    const highlighter = unwrap(this.highlighter);
    if (highlighter) {
      yield (async () => {
        do {
          await DependencyContext.consumePromises();
          highlighter.initialize();
        } while (DependencyContext.hasPromises());
      })();
      tokenize = (input: string) => highlighter.tokenize(input);
    }

    this.progress(0);
    this.set({
      progress: this.progress,
      fragments: defaultDiffer(this.get(), this.parse(unwrap(value)), tokenize),
    });
    yield* this.progress(1, duration, timingFunction);
    this.set(value);
  }

  public edit(duration: number = 0.6): TagGenerator {
    return (strings, ...tags) =>
      this.editTween(CODE(strings, ...tags), duration);
  }

  public append(code: CodeTag): TOwner;
  public append(code: CodeTag, duration: number): ThreadGenerator;
  public append(duration?: number): TagGenerator;
  public append(
    first: CodeTag | number = 0.6,
    duration?: number,
  ): TOwner | ThreadGenerator | TagGenerator {
    if (typeof first !== 'undefined' && typeof first !== 'number') {
      if (duration === undefined) {
        const current = this.get();
        return this.set({
          progress: 0,
          fragments: [...current.fragments, first],
        });
      } else {
        return this.appendTween(first, duration);
      }
    }

    const savedDuration = first;
    return (strings, ...tags) =>
      this.append(CODE(strings, ...tags), savedDuration);
  }

  public prepend(code: CodeTag): TOwner;
  public prepend(code: CodeTag, duration: number): ThreadGenerator;
  public prepend(duration?: number): TagGenerator;
  public prepend(
    first: CodeTag | number = 0.6,
    duration?: number,
  ): TOwner | ThreadGenerator | TagGenerator {
    if (typeof first !== 'undefined' && typeof first !== 'number') {
      if (duration === undefined) {
        const current = this.get();
        return this.set({
          progress: 0,
          fragments: [first, ...current.fragments],
        });
      } else {
        return this.prependTween(first, duration);
      }
    }

    const savedDuration = first;
    return (strings, ...tags) =>
      this.prepend(CODE(strings, ...tags), savedDuration);
  }

  public insert(point: CodePoint, code: CodeTag): TOwner;
  public insert(
    point: CodePoint,
    code: CodeTag,
    duration: number,
  ): ThreadGenerator;
  public insert(point: CodePoint, duration?: number): TagGenerator;
  public insert(
    point: CodePoint,
    first: CodeTag | number = 0.6,
    duration?: number,
  ): TOwner | ThreadGenerator | TagGenerator {
    return this.replace([point, point], first as CodeTag, duration as number);
  }

  public remove(range: CodeRange): TOwner;
  public remove(range: CodeRange, duration: number): ThreadGenerator;
  public remove(range: CodeRange, duration?: number): TOwner | ThreadGenerator {
    return this.replace(range, '', duration!);
  }

  public replace(range: CodeRange, code: CodeTag): TOwner;
  public replace(
    range: CodeRange,
    code: CodeTag,
    duration: number,
  ): ThreadGenerator;
  public replace(range: CodeRange, duration?: number): TagGenerator;
  public replace(
    range: CodeRange,
    first: CodeTag | number = 0.6,
    duration?: number,
  ): TOwner | ThreadGenerator | TagGenerator {
    if (typeof first !== 'undefined' && typeof first !== 'number') {
      if (duration === undefined) {
        const current = this.get();
        const [fragments, index] = extractRange(range, current.fragments);
        fragments[index] = first;
        return this.set({
          progress: current.progress,
          fragments,
        });
      } else {
        return this.replaceTween(range, first, duration);
      }
    }

    const savedDuration = first;
    return (strings, ...tags) =>
      this.replaceTween(range, CODE(strings, ...tags), savedDuration);
  }

  private *replaceTween(range: CodeRange, code: CodeTag, duration: number) {
    let current = this.get();
    const [fragments, index] = extractRange(range, current.fragments);
    const progress = createSignal(0);
    const resolved = resolveCodeTag(code, true);
    const scope = {
      progress,
      fragments: [replace(fragments[index] as string, resolved)],
    };
    fragments[index] = scope;
    this.set({
      progress: current.progress,
      fragments,
    });

    yield* progress(1, duration);

    current = this.get();
    this.set({
      progress: current.progress,
      fragments: current.fragments.map(fragment =>
        fragment === scope ? code : fragment,
      ),
    });
    progress.context.dispose();
  }

  private *editTween(value: CodeTag[], duration: number) {
    this.progress(0);
    this.set({
      progress: this.progress,
      fragments: value,
    });
    yield* this.progress(1, duration);
    const current = this.get();
    this.set({
      progress: 0,
      fragments: current.fragments.map(fragment =>
        value.includes(fragment) ? resolveCodeTag(fragment, true) : fragment,
      ),
    });
  }

  private *appendTween(value: CodeTag, duration: number) {
    let current = this.get();
    const progress = createSignal(0);
    const resolved = resolveCodeTag(value, true);
    const scope = {
      progress,
      fragments: [insert(resolved)],
    };
    this.set({
      progress: current.progress,
      fragments: [...current.fragments, scope],
    });
    yield* progress(1, duration);
    current = this.get();
    this.set({
      progress: current.progress,
      fragments: current.fragments.map(fragment =>
        fragment === scope ? value : fragment,
      ),
    });
    progress.context.dispose();
  }

  private *prependTween(value: CodeTag, duration: number) {
    let current = this.get();
    const progress = createSignal(0);
    const resolved = resolveCodeTag(value, true);
    const scope = {
      progress,
      fragments: [insert(resolved)],
    };
    this.set({
      progress: current.progress,
      fragments: [scope, ...current.fragments],
    });
    yield* progress(1, duration);
    current = this.get();
    this.set({
      progress: current.progress,
      fragments: current.fragments.map(fragment =>
        fragment === scope ? value : fragment,
      ),
    });
    progress.context.dispose();
  }

  public override parse(value: PossibleCodeScope): CodeScope {
    return parseCodeScope(value);
  }

  public override toSignal(): CodeSignal<TOwner> {
    return this.invokable;
  }
}

export function codeSignal(): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMetaOrCreate<PossibleCodeScope>(target, key);
    addInitializer(target, (instance: any) => {
      instance[key] = new CodeSignalContext(
        meta.default ?? [],
        instance,
      ).toSignal();
    });
  };
}
