import React, {ReactElement, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FeedOptions} from "spotlight/feed";
import {FeedEditorActions} from "spotlight/feed-editor/store";
import {selectFeedOption, selectPreviewDevice} from "spotlight/feed-editor/store/selectors";
import {FieldRow, Props as FieldRowProps} from "spotlight/admin-common/components/fields/FieldRow/FieldRow";
import {Responsive} from "spotlight/utils/responsive";
import {useFeedEditorContext} from "spotlight/feed-editor/context";
import {FeedEditorProElement} from "spotlight/feed-editor/components/core/FeedEditorProElement";
import {fn} from "spotlight/utils/functions";

type ParentProps = Omit<FieldRowProps, "labelId" | "isPro" | "children">;

export type Props = ParentProps & {
    /** The ID of the field, used to associate it with the corresponding HTML label */
    id?: string;
    /** The key of the feed option that the field modifies */
    option: keyof FeedOptions;
    /** For responsive fields. If true, empty values for non-desktop devices will not fallback to the desktop value. */
    noFallback?: boolean;
    /** If true, a <FieldRow> component is not rendered. FieldRow props (such as the label) will be ignored. */
    noContainer?: boolean;
    /** A decorator for the `onChange` function that is given to the field. */
    decorator?: (onChange: OnChangeFn) => OnChangeFn;
    /** A function that renders the field */
    children: (props: ChildProps) => ReactElement;
}

type OnChangeFn = (val: any) => void;

export type ChildProps = {
    /** The string that the field should use for its HTML ID attribute, to associate itself with its label */
    id: string;
    /** The value for the field */
    value: any;
    /** The function that the field should call when the option's value needs to be changed */
    onChange: (value: any) => void;
}

/**
 * This HoC wraps around an actual field to provide it with the correct `value` and `onChange` props for a specific
 * feed option. It can be configured to resolve responsive options as well as handle PRO fields, restricting changes
 * and hiding the field if the editor is not showing PRO options.
 *
 * Children are expected to be functions that render a react node. The child function will receive an object of props
 * that contains {id, value, onChange}. The ID is used to link the field to its corresponding HTML label.
 *
 * Note:
 *
 * This component does something that is strictly-speaking not allowed by React. It uses hooks in an if-statement.
 * React disallows this. Components should use the same hooks on every run. Hooks behind an if-statement may not
 * run all the time. However, this is perfectly fine for this component.
 *
 * For example:
 * The `useFeedEditorContent()` hook (which calls the `useContext()` hook under-the-hood) only if the `proOnly` prop is
 * true. This is fine because fields are expected to give a literal true/false value for this prop. A single field
 * won't suddenly change between a PRO and non-PRO field. So the same hooks will be called each time for a component
 * instance. The same applies to things like `prop.isResponsive`.
 *
 * This is done to ensure that fields are only subscribed to relevant changes. Fields that are not responsive do not
 * need to subscribe to changes to the store's `previewDevice` as that causes unnecessary re-renders.
 */
export function FeedEditorField({id, option, children, noFallback, decorator, ...props}: Props) {
    id = id ?? "feedEditor-" + option;

    const dispatch = useDispatch();
    let value = useSelector(selectFeedOption(option));
    const fullValue = value;
    const canChangeValue = props.proOnly
        ? useFeedEditorContext().config.isPro
        : true;

    let device;
    if (props.isResponsive) {
        device = useSelector(selectPreviewDevice);
        value = Responsive.get(value, device, !noFallback);
    } else {
        value = Responsive.extract(value);
    }

    const onChange = useMemo(() => {
        // Return a function that does nothing if the field is a PRO field but the editor is not PRO
        if (!canChangeValue) {
            return fn.noop;
        }

        // The base onChange function
        const base = (newValue) => {
            newValue = props.isResponsive
                ? Responsive.set(fullValue, device, newValue, true)
                : newValue;

            dispatch(FeedEditorActions.changeFeedOptions({[option]: newValue}));
        };

        // Decorate it if a decorator prop is given
        return decorator ? decorator(base) : base;
    }, [value, decorator, dispatch, device, decorator, props.isResponsive, canChangeValue]);

    const field = children({id, value, onChange});

    return props.proOnly
        ? (
            <FeedEditorProElement>
                {props.noContainer ? field : (
                    <FieldRow {...props} labelId={id} isPro={useFeedEditorContext().config.isPro}>
                        {field}
                    </FieldRow>
                )}
            </FeedEditorProElement>
        ) : (
            props.noContainer ? field : (
                <FieldRow {...props} labelId={id}>
                    {field}
                </FieldRow>
            )
        );
}
