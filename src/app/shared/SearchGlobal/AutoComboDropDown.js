import { Popper } from '@mui/material';
/*
Component for AutoComboDropdown
Developed to change the width of dropdown now
*/
const AutoComboDropDown = function (props) {
  return (
    <Popper {...props} style={{width: props.isonmobile === "true" ? '110px' : '250px'}} />
  )
};


export default AutoComboDropDown;
