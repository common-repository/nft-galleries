import styles from "./AdvancedSettings.pcss";
import React, {ReactNode} from "react";
import {uniqueNum} from "spotlight/utils/numbers/uniqueNum";
import {classList} from "spotlight/utils/jsx/classes";

interface Props {
}

export default function AdvancedSettings({}: Props) {
    return (
        <div className={styles.root}>
            {/*<h2>Cache</h2>*/}

            {/*<Field label="Enable media caching" className={styles.fieldCentered}>*/}
            {/*    {*/}
            {/*        (id) => <input id={id}*/}
            {/*                       type="checkbox"*/}
            {/*                       checked={store.values.mediaCacheEnabled}*/}
            {/*                       onChange={e => store.values.mediaCacheEnabled = e.target.checked} />*/}
            {/*    }*/}
            {/*</Field>*/}

            {/*<Field label="Cache media for">*/}
            {/*    {*/}
            {/*        (id) => <UnitInput id={id}*/}
            {/*                           type="number"*/}
            {/*                           unit="mins"*/}
            {/*                           min={1}*/}
            {/*                           value={store.values.mediaCacheTtl}*/}
            {/*                           onChange={e => store.values.mediaCacheTtl = parseInt(e.currentTarget.value)} />*/}
            {/*    }*/}
            {/*</Field>*/}

            {/*<Field label="Fetch new media every">*/}
            {/*    {*/}
            {/*        (id) => <UnitInput id={id}*/}
            {/*                           type="number"*/}
            {/*                           unit="mins"*/}
            {/*                           min={1}*/}
            {/*                           value={store.values.mediaFetchInterval}*/}
            {/*                           onChange={e => store.values.mediaFetchInterval = parseInt(e.currentTarget.value)} />*/}
            {/*    }*/}
            {/*</Field>*/}

            {/*<h2>Plugin Data</h2>*/}

            {/*<Field label="Delete data on uninstall" className={styles.fieldCentered}>*/}
            {/*    {*/}
            {/*        (id) => <input id={id}*/}
            {/*                       type="checkbox"*/}
            {/*                       checked={store.values.fullUninstall}*/}
            {/*                       onChange={e => store.values.fullUninstall = e.target.checked} />*/}
            {/*    }*/}
            {/*</Field>*/}
        </div>
    );
};

interface FieldProps {
    className?: string;
    label: string;
    children: (id: string) => ReactNode;
}

function Field({className, label, children}: FieldProps) {
    const id = "settings-field-" + uniqueNum();

    return (
        <div className={classList(styles.fieldContainer, className)}>
            <div className={styles.fieldLabel}>
                <label htmlFor={id}>{label}</label>
            </div>
            <div className={styles.fieldControl}>
                {children(id)}
            </div>
        </div>
    );
}
