import React, {useCallback} from "react";
import classes from "./FeedEditorUpsell.pcss";
import {useDispatch} from "react-redux";
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField";
import {ProUpgradeBtn} from "spotlight/admin-common/components/ProUpgradeBtn/ProUpgradeBtn";
import {useEditorSelector} from "spotlight/feed-editor/store/hooks";
import {FeedEditorActions} from "spotlight/feed-editor/store";

const upgradeUrl = "https://spotlightwp.com/pricing/?utm_source=sl_plugin&utm_medium=sl_plugin_upgrade&utm_campaign=sl_plugin_upgrade_editor";

export function FeedEditorUpsell() {
    const dispatch = useDispatch();
    const showPro = useEditorSelector(state => state.showProOptions);

    const toggleProOptions = useCallback(() => {
        dispatch(FeedEditorActions.toggleProOptions());
    }, [dispatch]);

    return (
        <div className={classes.proUpsell}>
            <label className={classes.toggle}>
                <span className={classes.toggleLabel}>
                    Show PRO features
                </span>
                <CheckboxField value={showPro} onChange={toggleProOptions} />
            </label>

            <ProUpgradeBtn url={upgradeUrl} />
        </div>
    );
}
