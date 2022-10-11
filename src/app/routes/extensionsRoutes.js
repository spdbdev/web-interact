import React from 'react';
import CkEditor from "../pages/extensions/editor/CkEditor";
import WysiwygEditor from "../pages/extensions/editor/WysiwygEditor";
import DragAndDrop from "../pages/extensions/dnd/DragAndDrop";
import ReactDropzone from "../pages/extensions/dropzone/ReactDropzone";
import SweetAlerts from "../pages/extensions/sweetalert/SweetAlert";

const extensionsRoutes = [
    {
        path: "extensions/editors/ck",
        element: <CkEditor/>
    },
    {
        path: "extensions/editors/wysiwyg",
        element: <WysiwygEditor/>
    },
    {
        path: "extensions/dnd",
        element: <DragAndDrop/>
    },
    {
        path: "extensions/dropzone",
        element: <ReactDropzone/>
    },
    {
        path: "extensions/sweet-alert",
        element: <SweetAlerts/>
    },
]
export default extensionsRoutes;
