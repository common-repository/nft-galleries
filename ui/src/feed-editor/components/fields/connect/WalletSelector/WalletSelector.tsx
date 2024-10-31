import React from "react"
import styles from "./WalletSelector.pcss"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {useKeyboardActivate} from "spotlight/utils/react/useKeyboardActivate"
import {Wallet} from "spotlight/common/modules/wallets"

export type Props = {
    wallets: Wallet[];
    value: string[];
    singleMode?: boolean;
    disabled?: boolean;
    onChange?: (value: string[]) => void;
}

export function WalletSelector({wallets, value, onChange, singleMode, disabled}: Props) {
    value = value ?? []

    const filtered = value.filter(address => wallets.some(wallet => wallet.address === address))
    const valueSet = new Set<string>(filtered)

    const handleChange = React.useCallback((address: string, selected: boolean) => {
        if (disabled) {
            return
        }

        if (selected) {
            if (singleMode) {
                valueSet.clear()
            }
            valueSet.add(address)
        } else {
            if (!singleMode) {
                valueSet.delete(address)
            }
        }

        onChange(Array.from(valueSet))
    }, [disabled, valueSet, onChange])

    return (
        <div className={styles.root}>
            {wallets.map(wallet => {
                return (
                    <Row
                        key={wallet.address}
                        wallet={wallet}
                        selected={valueSet.has(wallet.address)}
                        onChange={(s) => handleChange(wallet.address, s)}
                        singleMode={singleMode}
                        disabled={disabled}
                    />
                )
            })}
        </div>
    )
}

export interface RowProps {
    wallet: Wallet;
    selected: boolean;
    singleMode?: boolean;
    disabled?: boolean;
    onChange: (selected: boolean) => void;
}

export function Row({wallet, selected, singleMode, disabled, onChange}: RowProps) {
    const handleClick = () => {
        !disabled && onChange(!selected)
    }

    const handleKey = useKeyboardActivate(handleClick)
    const className = disabled
        ? (selected ? styles.walletSelectedDisabled : styles.walletDisabled)
        : (selected ? styles.walletSelected : styles.wallet)

    return (
        <div className={styles.row}>
            <div
                className={className}
                onClick={handleClick}
                onKeyPress={handleKey}
                role="button"
                tabIndex={0}
            >
                <div className={styles.name}>
                    {wallet.name}
                </div>
                <div className={styles.address}>
                    {wallet.address}
                </div>

                {selected && !singleMode && (
                    <Dashicon icon="yes-alt" className={styles.tickIcon} />
                )}
            </div>
        </div>
    )
}
