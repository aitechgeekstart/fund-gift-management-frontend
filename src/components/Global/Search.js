import { Button } from "@/components/Global";
import TextField from "@/components/Global/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Grid } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

const SearchTextField = styled((props) => (
  <TextField
    placeholder="Search"
    autoComplete="off"
    fullWidth
    size="small"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" sx={{ pl: 1 }}>
          <SearchOutlinedIcon />
        </InputAdornment>
      ),
    }}
    {...props}
  />
))(({ theme }) => ({
  input: {
    fontSize: "14px",
    padding: "5px",
    minHeight: "23px",
  },
  ".MuiInputBase-root": {
    marginBottom: "5px",
    paddingLeft: "8px",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "18px",
    color: theme.palette.grey.main,
  },
  ".MuiOutlinedInput": {
    backgroundColor: "white",
  },
}));

export default function Search(props) {
  const {
    initialData,
    setSearchTerm,
    xs,
    sm,
    md,
    containerMD,
    action,
    setPaginationModel,
    pageSize,
    apply,
    ...others
  } = props;
  const [formSearch, setFormSearch] = useState("");

  useEffect(() => {
    if (!initialData) {
      setFormSearch("");
    }
  }, [initialData, setSearchTerm]);

  useEffect(() => {
    if (!apply) {
      const delayDebounceFn = setTimeout(() => {
        // back to first page
        if (!!formSearch && !!setPaginationModel) {
          setPaginationModel({ pageSize: pageSize, page: 0 });
        }
        setSearchTerm(formSearch);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [formSearch, apply]);

  const onApply = () => {
    const delayDebounceFn = setTimeout(() => {
      // back to first page
      if (!!formSearch && !!setPaginationModel) {
        setPaginationModel({ pageSize: pageSize, page: 0 });
      }
      setSearchTerm(formSearch);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  };

  return (
    <Grid
      container
      direction="row"
      spacing={1}
      sx={{ alignItems: "flex-start" }}
    >
      {!!action && (
        <Grid container size={{ xs: 12, sm: 12, md: 6 }}>
          {action}
        </Grid>
      )}
      <Grid container size={{ xs: 12, sm: 12, md: containerMD || 12 }}>
        <Grid
          container
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "flex-end" }}
        >
          <Grid
            container
            direction="row"
            size={{ xs: xs || 12, sm: sm || 12, md: md || 4 }}
            sx={{ alignItems: "center", justifyContent: "flex-end" }}
          >
            <SearchTextField
              value={formSearch}
              placeholder={props.placeholder ? props.placeholder : "SEARCH"}
              onChange={(e) => {
                setFormSearch(e.target.value);
              }}
              {...others}
            />
          </Grid>
          {apply && (
            <Grid
              container
              direction="row"
              size={{ xs: xs || 12, sm: sm || 12, md: md || 4 }}
              sx={{ alignItems: "center", pb: 0.5 }}
            >
              <Button variant="contained" onClick={() => onApply()}>
                ค้นหา
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
