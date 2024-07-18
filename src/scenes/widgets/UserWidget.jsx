import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  CalendarMonth,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Modal,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const loggedUser = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
    // console.log(userId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    createdAt,
  } = user;

  const formatJoinDate = (isoDateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(isoDateString);
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `Joined ${month} ${year}`;
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        // onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <Box onClick={handleOpen} sx={{ "&:hover": { cursor: "pointer" } }}>
            <UserImage image={picturePath} />
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="enlarged-user-image"
            aria-describedby="enlarged-user-image-description"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "40%",
                height: "60%",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                objectFit: "contain",
              }}
            >
              {/* <UserImage
                image={picturePath}
                style={{ width: "100%", height: "100%" }}
              /> */}
              <UserImage
                image={picturePath}
                size="400px"
                // style={{
                //   width: "90%",
                //   height: "auto",
                //   maxWidth: "100%",
                //   maxHeight: "100%",
                // }}
              />
            </Box>
          </Modal>

          {/* ----------------------------------------------------- */}
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate(`/profile/${userId}`)}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>
              {Array.isArray(friends) && friends.length} friends
            </Typography>
          </Box>
        </FlexBetween>
        {loggedUser._id === userId && (
          <Tooltip title={<Typography fontSize={13}>Edit</Typography>} arrow>
            <IconButton
              onClick={() => {
                navigate("/profile/edit");
              }}
              sx={{ border: "2px solid #3f51b5" }}
            >
              <ManageAccountsOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
        )}
      </FlexBetween>

      <Divider />

      {/* Second Row */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <CalendarMonth fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{formatJoinDate(createdAt)}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Third Row */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* Fourth Row */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Networking</Typography>
            </Box>
          </FlexBetween>

          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkein
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
