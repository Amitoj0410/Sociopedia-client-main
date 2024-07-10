import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  SearchOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setSearchType } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { setSearchValue } from "state";
import UserImage from "components/UserImage";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const searchValue = useSelector((state) => state.searchValue);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const main = theme.palette.neutral.main;
  const medium = theme.palette.neutral.medium;
  const [searchInput, setSearchInput] = useState("");
  const [searchedPeople, setSearchedPeople] = useState([]);
  const fullName = `${user.firstName} ${user.lastName}`;

  const searchOnChange = async (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0) {
      dispatch(setSearchValue(value));
      dispatch(setSearchType("people"));

      const response = await fetch(
        `https://socialpedia-serverr.onrender.com/users/search?firstName=${value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const users = await response.json();
      setSearchedPeople(users); // Update to use users directly
      console.log(users);
    } else {
      setSearchedPeople([]);
    }
  };

  const handleSearch = () => {
    if (searchInput.length > 0) {
      dispatch(setSearchValue(searchInput));
      dispatch(setSearchType("people"));
      navigate("/search");
    }
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Sociopedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween gap={1}>
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="0.5rem"
              padding="0 1rem"
              position="relative"
            >
              {/* <InputBase
                placeholder="Search..."
                value={searchInput}
                onChange={searchOnChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                
              /> */}
              <InputBase
                placeholder="Search..."
                value={searchInput}
                onChange={searchOnChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                sx={{
                  fontSize: "16px", // Adjust font size
                  padding: "8px", // Adjust padding
                  height: "40px", // Adjust height
                  width: "200px", // Adjust width
                }}
              />
              {searchedPeople.length > 0 && (
                <IconButton
                  onClick={() => {
                    setSearchedPeople([]);
                    setSearchInput("");
                  }}
                  // sx={{ border: "1px solid grey" }}
                >
                  <CloseOutlined />
                </IconButton>
              )}

              {searchedPeople.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  width="100%"
                  backgroundColor={neutralLight}
                  boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                  borderRadius="9px"
                  zIndex="1000"
                  mt={1}
                >
                  <List>
                    {searchedPeople.map((person) => (
                      <ListItem
                        key={person._id}
                        onClick={() => navigate(`/profile/${person._id}`)}
                        sx={{
                          "&:hover": {
                            backgroundColor: primaryLight,
                            cursor: "pointer",
                          },
                        }}
                      >
                        <FlexBetween gap={1}>
                          <UserImage image={person.picturePath} size="40px" />
                          <Box>
                            <Typography color={main} variant="h5">
                              {`${person.firstName} ${person.lastName}`}
                            </Typography>
                            <Typography color={medium}>
                              {person.occupation}
                            </Typography>
                          </Box>
                        </FlexBetween>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </FlexBetween>
            <FlexBetween>
              <IconButton
                onClick={handleSearch}
                sx={{ border: "1px solid grey" }}
              >
                <SearchOutlined />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Help sx={{ fontSize: "25px" }} />
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/profile/edit");
                }}
              >
                <Typography>Profile</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/");
                }}
              >
                <Typography>Log Out</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/profile/edit");
                  }}
                >
                  <Typography>Profile</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                  }}
                >
                  <Typography>Log Out</Typography>
                </MenuItem>
              </Select>
            </FormControl>
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase
                placeholder="Search..."
                value={searchInput}
                onChange={searchOnChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <IconButton onClick={handleSearch}>
                <Search />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
