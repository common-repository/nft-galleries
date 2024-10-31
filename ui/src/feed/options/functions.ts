import {FeedOptions} from "spotlight/feed/types"
import {Responsive} from "spotlight/utils/responsive"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {uniqueValues} from "spotlight/utils/arrays/uniqueValues"
import {DefaultFeedOptions} from "spotlight/feed/options/defaults"
import {ButtonDesign} from "spotlight/utils/design"

export function createFeedOptions(data: Partial<FeedOptions> & { [k: string]: any }): FeedOptions {
    const result = withPartial(DefaultFeedOptions, data)

    // Remove invalid account IDs
    result.wallets = uniqueValues(result.wallets).filter(a => !!a)

    result.loadMoreBtnDesign = normalizeBtnDesign(
        Responsive.extract(result.loadMoreBtnDesign),
        Responsive.extract(DefaultFeedOptions.loadMoreBtnDesign),
        data.loadMoreBtnTextColor,
        data.loadMoreBtnBgColor,
    )

    // Un-set the deprecated options
    result.followBtnBgColor = result.followBtnTextColor = result.loadMoreBtnBgColor = result.loadMoreBtnTextColor = undefined

    return result
}

/**
 * Normalizes a button design option.
 *
 * If the deprecated text color or background color options are set, they will be used to construct a button design
 * object. Otherwise, the argument design is used.
 *
 * @param design The design.
 * @param def The default design.
 * @param textColor The deprecated text color option.
 * @param bgColor The deprecated background color option.
 */
export function normalizeBtnDesign(design?: ButtonDesign | null, def?: ButtonDesign, textColor?, bgColor?): ButtonDesign {
    if ((textColor || bgColor)) {
        return withPartial(def, {
            text: {
                color: textColor,
            },
            bgColor,
            onHover: {
                text: textColor,
                bgColor,
            },
        })
    } else {
        return design ?? def
    }
}
