import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CampaignDropdownSelect({
  items,
  placeholder,
  defaultValue,
}) {
  const [selectedItem, setSelectedItem] = React.useState(defaultValue);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedItem(value);
  };

  return (
    <div>
      <FormControl sx={{ width: 400 }}>
        <Select
          id="demo-multiple-name"
          value={selectedItem}
          onChange={handleChange}
          input={<OutlinedInput />}
          MenuProps={MenuProps}
          placeholder={placeholder}
        >
          {items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
