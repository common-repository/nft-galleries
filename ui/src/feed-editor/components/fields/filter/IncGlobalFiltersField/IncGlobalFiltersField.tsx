import React from "react";
import classes from "spotlight/feed-editor/components/fields/filter/IncGlobalFiltersField/IncGlobalFiltersField.pcss";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import {GlobalFiltersModal} from "spotlight/admin-common/components/GlobalFiltersModal/GlobalFiltersModal";
import {useFeedEditorContext} from "spotlight/feed-editor/context";

interface Props {
    id?: string;
    value: boolean;
    onChange?: (value: boolean) => void;
    onSaveGlobals?: () => void;
}

export function IncGlobalFiltersField({id, value, onChange, onSaveGlobals}: Props) {
    const {config} = useFeedEditorContext();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSaveGlobalFilters = () => {
        onSaveGlobals && onSaveGlobals();
    };

    return (
        <div className={classes.incGlobalFilters}>
            <label className={classes.label}>
                <div className={classes.field}>
                    <input
                        id={id}
                        type="checkbox"
                        value="1"
                        checked={value}
                        onChange={(e) => onChange && onChange(e.target.checked)}
                    />
                    <span>Include global filters</span>
                </div>

                {config.useSettings && (
                    <Button
                        type={ButtonType.LINK}
                        size={ButtonSize.SMALL}
                        onClick={openModal}>
                        Edit global filters
                    </Button>
                )}

                {config.useSettings && (
                    <GlobalFiltersModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveGlobalFilters} />
                )}
            </label>
        </div>
    );
}
