import React from 'react';
import Buttons from "../pages/components/mui/Buttons";
import Chips from "../pages/components/mui/Chips";
import Avatars from "../pages/components/mui/Avatars"
import Badges from "../pages/components/mui/Badges"
import Alerts from "../pages/components/mui/Alerts";
import Dialogs from "../pages/components/mui/Dialogs";
import Steppers from "../pages/components/mui/Steppers";
import AutoCompletes from "../pages/components/mui/AutoCompletes";
import BottomNavigations from "../pages/components/mui/BottomNavigations";
import Breadcrumbs from "../pages/components/mui/Breadcrumbs";
import Dividers from "../pages/components/mui/Dividers";
import Lists from "../pages/components/mui/Lists";
import Progress from "../pages/components/mui/Progress";
import Snackbars from "../pages/components/mui/Snackbars";
import Tabs from "../pages/components/mui/Tabs";
import Pickers from "../pages/components/mui/Pickers";
import Popovers from "../pages/components/mui/Popovers";
import Selects from "../pages/components/mui/Selects";
import TextFields from "../pages/components/mui/TextFields";
import Tooltips from "../pages/components/mui/Tooltips";
import Checkboxes from "../pages/components/mui/Checkboxes";
import Ratings from "../pages/components/mui/Ratings";
import Sliders from "../pages/components/mui/Sliders";
import Switches from "../pages/components/mui/Switches/Switches";
import TransfersList from "../pages/components/mui/TransfersList";
import ToggleButtons from "../pages/components/mui/ToggleButtons";
import Backdrops from "../pages/components/mui/Backdrops";
import Skeletons from "../pages/components/mui/Skeletons";
import Accordions from "../pages/components/mui/Accordions";
import Links from "../pages/components/mui/Links";
import Menus from "../pages/components/mui/Menus";
import Paginations from "../pages/components/mui/Paginations";
import ImagesList from "../pages/components/mui/ImagesList";
import SpeedDials from "../pages/components/mui/SpeedDials";
import Typographies from "../pages/components/mui/Typography";
import RadioButtons from "../pages/components/mui/RadioButtons/RadioButtons";
import Stacks from "../pages/components/mui/Stacks";
import Poppers from "../pages/components/mui/Poppers";
import Papers from "../pages/components/mui/Papers";
import Containers from "../pages/components/mui/Containers";
import Grids from "../pages/components/mui/Grids/Grids";
import Modals from "../pages/components/mui/Modals";
import Transitions from "../pages/components/mui/Transitions";
import TextareaAutosizes from "../pages/components/mui/TextareaAutosizes/TextareaAutosizes";
import ClickAwayListeners from "../pages/components/mui/ClickAwayListeners";
import Timelines from "../pages/components/mui/Timelines/Timelines";
import Masonry from "../pages/components/mui/Masonry";
import Treeviews from "../pages/components/mui/Treeviews";
import Portals from "../pages/components/mui/Portals";
import ButtonsGroup from "../pages/components/mui/ButtonsGroup";

const muiRoutes = [
    {
        path: "/mui/accordions",
        element: <Accordions/>
    },
    {
        path: "/mui/alerts",
        element: <Alerts/>
    },
    {
        path: "/mui/autocomplete",
        element: <AutoCompletes/>
    },
    {
        path: "/mui/avatars",
        element: <Avatars/>
    },
    {
        path: "/mui/backdrop",
        element: <Backdrops/>
    },
    {
        path: "/mui/badges",
        element: <Badges/>
    },
    {
        path: "/mui/bottom-navigation",
        element: <BottomNavigations/>
    },
    {
        path: "/mui/breadcrumbs",
        element: <Breadcrumbs/>
    },
    {
        path: "/mui/button-group",
        element: <ButtonsGroup/>
    },
    {
        path: "/mui/buttons",
        element: <Buttons/>
    },
    {
        path: "/mui/checkbox",
        element: <Checkboxes/>
    },
    {
        path: "/mui/chips",
        element: <Chips/>
    },
    {
        path: "/mui/click-away-listener",
        element: <ClickAwayListeners/>
    },
    {
        path: "/mui/container",
        element: <Containers/>
    },
    {
        path: "/mui/dialogs",
        element: <Dialogs/>
    },
    {
        path: "/mui/dividers",
        element: <Dividers/>
    },
    {
        path: "/mui/grid",
        element: <Grids/>
    },
    {
        path: "/mui/images-list",
        element: <ImagesList/>
    },
    {
        path: "/mui/links",
        element: <Links/>
    },
    {
        path: "/mui/lists",
        element: <Lists/>
    },
    {
        path: "/mui/masonry",
        element: <Masonry/>
    },
    {
        path: "/mui/menus",
        element: <Menus/>
    },
    {
        path: "/mui/modal",
        element: <Modals/>
    },
    {
        path: "/mui/paginations",
        element: <Paginations/>
    },
    {
        path: "/mui/papers",
        element: <Papers/>
    },
    {
        path: "/mui/pickers",
        element: <Pickers/>
    },
    {
        path: "/mui/popovers",
        element: <Popovers/>
    },
    {
        path: "/mui/poppers",
        element: <Poppers/>
    },
    {
        path: "/mui/portals",
        element: <Portals/>
    },
    {
        path: "/mui/progress",
        element: <Progress/>
    },
    {
        path: "/mui/radio-buttons",
        element: <RadioButtons/>
    },
    {
        path: "/mui/rating",
        element: <Ratings/>
    },
    {
        path: "/mui/selects",
        element: <Selects/>
    },
    {
        path: "/mui/skeletons",
        element: <Skeletons/>
    },
    {
        path: "/mui/slider",
        element: <Sliders/>
    },
    {
        path: "/mui/snackbars",
        element: <Snackbars/>
    },
    {
        path: "/mui/speed-dial",
        element: <SpeedDials/>
    },
    {
        path: "/mui/stacks",
        element: <Stacks/>
    },
    {
        path: "/mui/steppers",
        element: <Steppers/>
    },
    {
        path: "/mui/switches",
        element: <Switches/>
    },
    {
        path: "/mui/tabs",
        element: <Tabs/>
    },
    {
        path: "/mui/textarea-autosize",
        element: <TextareaAutosizes/>
    },
    {
        path: "/mui/text-fields",
        element: <TextFields/>
    },
    {
        path: "/mui/timeline",
        element: <Timelines/>
    },
    {
        path: "/mui/toggle-buttons",
        element: <ToggleButtons/>
    },
    {
        path: "/mui/tooltips",
        element: <Tooltips/>
    },
    {
        path: "/mui/transfers-list",
        element: <TransfersList/>
    },
    {
        path: "/mui/transitions",
        element: <Transitions/>
    },
    {
        path: "/mui/tree-view",
        element: <Treeviews/>
    },
    {
        path: "/mui/typography",
        element: <Typographies/>
    },
];

export {muiRoutes};
