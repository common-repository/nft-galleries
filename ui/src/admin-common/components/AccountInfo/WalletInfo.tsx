import React from "react"
import {AnyAction} from "redux"
import styles from "./WalletInfo.pcss"
import {WpUploadMedia} from "spotlight/admin-common/components/Wp/WpUploadMedia"
import wp from "spotlight/admin-common/libs/wp"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {useDispatch, useSelector} from "react-redux"
import {ThunkDispatch} from "@reduxjs/toolkit"
import {selectWallet} from "spotlight/admin-common/stores/wallets/selectors"
import {Wallets} from "spotlight/common/modules/wallets"

interface Props {
    address: string;
    onUpdate?: () => void;
}

export default function WalletInfo({address, onUpdate}: Props) {
    const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const wallet = useSelector(selectWallet(address));
    const [isSaving, setIsSaving] = React.useState(false);

    const updatePic = async (url: string) => {
        // setIsSaving(true);
        //
        // const newAccount = withPartial(wallet, {customProfilePicUrl: url});
        // await dispatch(updateAccount(newAccount));
        //
        // setIsSaving(false);
        // onUpdate && onUpdate();
    };

    const handleChangePic = (attachments: wp.media.Attachment[]) => {
        // const id = parseInt(attachments[0].attributes.id);
        // const url = wp.media.attachment(id).attributes.url;
        //
        // updatePic(url);
    };

    const handleResetPic = () => {
        // updatePic("");
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.infoColumn}>
                    {/* USERNAME */}
                    <a href={Wallets.getOpenSeaUrl(wallet.address)} target="_blank" className={styles.name}>
                        {wallet.name}
                    </a>

                    <div className={styles.row}>
                        <span className={styles.label}>Address:</span>
                        <code>{wallet.address}</code>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className={styles.picColumn}>
                    <div className={styles.centerContainer}>
                        {/*
                        <ProfilePic account={wallet} className={styles.profilePic} />
                        */}
                    </div>

                    <WpUploadMedia
                        id="account-custom-profile-pic"
                        title="Select profile picture"
                        mediaType="image"
                        onSelect={handleChangePic}>
                        {({open}) => (
                            <Button
                                type={ButtonType.SECONDARY}
                                size={ButtonSize.LARGE}
                                className={styles.setCustomPic}
                                onClick={open}>
                                Change profile picture
                            </Button>
                        )}
                    </WpUploadMedia>

                    {/*
                    wallet.customProfilePicUrl.length > 0 && (
                        <a className={styles.resetCustomPic} onClick={handleResetPic}>
                            Reset profile picture
                        </a>
                    )
                    */
                    }
                </div>
            </div>
        </div>
    );
}
