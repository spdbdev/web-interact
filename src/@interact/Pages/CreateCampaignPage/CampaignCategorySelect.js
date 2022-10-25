import InteractChip from "@interact/Components/Chips/InteractChip";
import { Clear, Close, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
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
  "Gaming",
  "Humor",
  "Just chatting, commentary",
  "News & politics",
  "Sports",
  "Academic/educational topics",
  "Films, shows & anime",
  "Animation",
  "Travel, vlogs & lifestyle",
];

export default function CampaignCategorySelect() {
  const [selectedCategories, setSelectedCategories] = React.useState([
    "Gaming",
  ]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedCategories(
      selectedCategories.filter((category) => category !== value)
    );
  };

  return (
    <Box sx={{ zIndex: 9999 }}>
      <FormControl sx={{ width: 400 }}>
        <Select
          id="campaign-categories"
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Stack direction="row" spacing={0.5}>
              {selected.map((value) => (
                <InteractChip
                  key={value}
                  label={value}
                  deleteIcon={<Close sx={{ color: "primary.main" }} />}
                  onDelete={(e) => handleDelete(e, value)}
                />
              ))}
            </Stack>
          )}
          MenuProps={MenuProps}
        >
          {categories.map((category) => {
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
