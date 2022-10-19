import { Delete } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from "@mui/material";
import * as React from "react";

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

const categories = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

export default function CampaignCategorySelect() {
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Box sx={{ zIndex: 9999 }}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="campaign-categories-label">Category</InputLabel>
        <Select
          labelId="campaign-categories-label"
          id="campaign-categories"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Category" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} deleteIcon={<Delete />} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {categories.map((category) => {
            console.log(category);
            return (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
