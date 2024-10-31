import React from "react";
import classes from "./ModalLayer.pcss";
import {classList} from "spotlight/utils/jsx/classes";

export function ModalLayer() {
    return <div className={classList(classes.modalLayer, "spotlight-modal-target")} />;
}
