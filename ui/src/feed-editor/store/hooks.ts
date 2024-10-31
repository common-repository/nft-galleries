import {FeedEditorState} from "spotlight/feed-editor/store"
import {useDispatch, useSelector} from "react-redux"
import {FeedOptions} from "spotlight/feed"
import {FeedEditorActions} from "spotlight/feed-editor/store/index"
import {Device, NonResponsive, Responsive} from "spotlight/utils/responsive"
import {areEqual} from "spotlight/utils/generic/areEqual"

type SelectorFn<T> = (state: FeedEditorState["editor"]) => T;
type Setter<T> = (val: T) => void;
type ValueSetterPair<T> = [T, Setter<T>]

export function useEditorSelector<T>(selector: SelectorFn<T>, equalityFn?: (left: T, right: T) => boolean) {
  return useSelector<FeedEditorState, T>(state => selector(state.editor), equalityFn)
}

export function usePreviewDevice(): Device {
  return useEditorSelector(state => state.previewDevice)
}

export function useResponsiveSelector<T>(selector: SelectorFn<Responsive<T>>, device?: Device): T {
  device = device ?? useEditorSelector(state => state.previewDevice)

  const value = useSelector(selector)

  return Responsive.get<T>(value, device)
}

export function useFeedOptionSetter<K extends keyof FeedOptions>(dispatch, option: K) {
  return React.useCallback((value: FeedOptions[K]) => {
    const payload = {
      [option]: value,
    }

    dispatch(FeedEditorActions.changeFeedOptions(payload))
  }, [option, dispatch])
}

export function useNumberFeedOptionSetter<K extends keyof FeedOptions>(dispatch, option: keyof FeedOptions) {
  return React.useCallback((value: FeedOptions[K]) => {
    dispatch(FeedEditorActions.changeFeedOptions({
      [option]: typeof value === "number" ? value : 0,
    }))
  }, [option, dispatch])
}

export function useFeedOption<T>(option: keyof FeedOptions, selector: SelectorFn<T>): ValueSetterPair<T> {
  let value = useEditorSelector(selector, areEqual)
  let setter = useFeedOptionSetter(useDispatch(), option)

  return [value, setter]
}

export function wrapResponsive<R, T = NonResponsive<R>>(
  pair: ValueSetterPair<R>, fallbackToDesktop?: boolean,
): [T, Setter<T>, R, Setter<R>, Device] {
  const [rValue, rSetter] = pair
  const device = useEditorSelector(state => state.previewDevice)

  return [
    // @ts-ignore
    Responsive.get(rValue, device, fallbackToDesktop ?? true),
    // @ts-ignore
    React.useCallback((value: T) => rSetter(Responsive.set(rValue, device, value)), [rSetter, device, rValue]),
    rValue,
    rSetter,
    device,
  ]
}
