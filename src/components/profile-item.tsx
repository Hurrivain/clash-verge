import React from "react";
import dayjs from "dayjs";
import {
  alpha,
  Box,
  ButtonBase,
  styled,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { MenuRounded } from "@mui/icons-material";
import { ProfileItem } from "../services/command";
import parseTraffic from "../utils/parse-traffic";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Wrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "block",
  cursor: "pointer",
  textAlign: "left",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  padding: "8px 16px",
  boxSizing: "border-box",
}));

interface Props {
  selected: boolean;
  itemData: ProfileItem;
  onClick: () => void;
  onUpdate: () => void;
}

const ProfileItemComp: React.FC<Props> = (props) => {
  const { selected, itemData, onClick, onUpdate } = props;

  const { name = "Profile", extra, updated = 0 } = itemData;
  const { upload = 0, download = 0, total = 0 } = extra ?? {};
  const from = parseUrl(itemData.url);
  const expire = parseExpire(extra?.expire);
  const progress = Math.round(((download + upload) * 100) / (total + 0.1));
  const fromnow = updated > 0 ? dayjs(updated * 1000).fromNow() : "";

  return (
    <Wrapper
      sx={({ palette }) => {
        const { mode, primary, text, grey } = palette;
        const isDark = mode === "dark";

        if (selected) {
          const bgcolor = isDark
            ? alpha(primary.main, 0.35)
            : alpha(primary.main, 0.15);

          return {
            bgcolor,
            color: isDark ? alpha(text.secondary, 0.6) : text.secondary,
            "& h2": {
              color: isDark ? primary.light : primary.main,
            },
          };
        }
        const bgcolor = isDark
          ? alpha(grey[700], 0.35)
          : palette.background.paper;
        return {
          bgcolor,
          color: isDark ? alpha(text.secondary, 0.6) : text.secondary,
          "& h2": {
            color: isDark ? text.primary : text.primary,
          },
        };
      }}
      onClick={onClick}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography
          width="calc(100% - 40px)"
          variant="h6"
          component="h2"
          noWrap
          title={name}
        >
          {name}
        </Typography>

        <IconButton
          sx={{ width: 30, height: 30 }}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate();
          }}
        >
          <MenuRounded />
        </IconButton>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography noWrap title={`From: ${from}`}>
          {from}
        </Typography>

        <Typography
          noWrap
          flex="1 0 auto"
          fontSize={14}
          textAlign="right"
          title="updated time"
        >
          {fromnow}
        </Typography>
      </Box>

      <Box
        sx={{
          my: 0.5,
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span title="used / total">
          {parseTraffic(upload + download)} / {parseTraffic(total)}
        </span>
        <span title="expire time">{expire}</span>
      </Box>

      <LinearProgress variant="determinate" value={progress} color="inherit" />
    </Wrapper>
  );
};

function parseUrl(url?: string) {
  if (!url) return "";
  const regex = /https?:\/\/(.+?)\//;
  const result = url.match(regex);
  return result ? result[1] : "local file";
}

function parseExpire(expire?: number) {
  if (!expire) return "-";
  return dayjs(expire * 1000).format("YYYY-MM-DD");
}

export default ProfileItemComp;
