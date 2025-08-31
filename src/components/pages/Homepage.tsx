"use client";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import EmailEditor, {
  EditorRef,
  EmailEditorProps,
} from "react-email-editor";
import { SetupDialog } from "../common";
import { Dayjs } from "dayjs";
import { JobScheduleSchema } from "@/schema";
import { scheduleEmailJob } from "@/lib/schedules";
import {
  NewsletterGroup,
  ScheduleOption,
  SchedulePayload,
} from "@/types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  templateJson1,
  templateJson2,
  templateJson3,
  templateJson4,
} from "@/templates";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { signOut } from "next-auth/react";
const templates = [
  { id: "0", label: "Blank", json: templateJson1 },
  { id: "1", label: "Template 1", json: templateJson1 },
  { id: "2", label: "Template 2", json: templateJson2 },
  { id: "3", label: "Template 3", json: templateJson3 },
  { id: "4", label: "Template 4", json: templateJson4 },
];


interface LocalOption extends Omit<ScheduleOption, "startDate" | "endDate"> {
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}

interface LocalState
  extends Omit<
    SchedulePayload,
    "scheduleAt" | "htmlContent" | "jsonContent" | "options"
  > {
  scheduleAt: Dayjs | null;
  options?: LocalOption;
}


type JsonBody = {
  rows: {
    columns: {
      contents: any[]; // Can be any type, assuming it's an array
    }[];
  }[];
};
function hasNonEmptyContent(body: JsonBody) {
  return body.rows.some((row) =>
    row.columns.some((column) => column.contents.length > 0)
  );
}

type InitialState = {
  open: boolean;
  messages: string[];
  template: string;
  show: boolean;
  message: string;
}

const initialState: InitialState = {
  open: false,
  messages: [],
  template: templates[1].id,
  show: false,
  message: ""
}

const Homepage = ({ groups }: { groups: NewsletterGroup[] }) => {
  const [state, setState] = React.useState<InitialState>(initialState);

  const emailEditorRef = useRef<EditorRef>(null);

  const toggleDialog = (isOpen: boolean) => {
    setState((prev) => ({ ...prev, open: isOpen }));
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prev) => ({ ...prev, show: false }));
  };


  const handleTemplateChange = (event: SelectChangeEvent) => {
    const unlayer = emailEditorRef.current?.editor;
    const value = event.target.value;
    if (value === "0") {
      unlayer?.loadBlank();
    }else{
      const template = templates.find((item) => item.id === value);
      if (template) unlayer?.loadDesign(template.json);
    }
    
    setState((prev) => ({ ...prev, template: value }));
  };

  const exportHtml = (): Promise<{ design: any; html: string }> => {
    const unlayer = emailEditorRef.current?.editor;
    return new Promise((resolve, reject) => {
      unlayer?.exportHtml((data) => {
        if (data) {
          resolve(data);
        } else {
          reject("Error exporting HTML");
        }
      });
    });
  };
  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    const template = templates.find((item) => item.id === state.template);
    if (template) unlayer.loadDesign(template?.json);
    
  };

  const handleSubmit = async (args: LocalState) => {
    try {
      setState((prev) => ({ ...prev, messages: [] }));
      const data = await exportHtml();
      const payload = {
        ...args,
        htmlContent: data.html,
        jsonContent: data.design,
        scheduleAt: String(args.scheduleAt?.toISOString()),
        ...(args.options && {
          options: {
            ...args.options,
            startDate: args?.options?.startDate
              ? String(args.options.startDate?.toISOString())
              : undefined,
            endDate: args?.options?.endDate
              ? String(args.options.endDate?.toISOString())
              : undefined,
          },
        }),
      };
      const nonEmpty = hasNonEmptyContent(payload?.jsonContent?.body);
      const validationResult = JobScheduleSchema.safeParse(payload);
      if (!validationResult.success || !nonEmpty) {
        let messages = nonEmpty ? [] : ["Email template can not be empty"];
        const issues =
          validationResult?.error?.issues?.map((err) => err.message) ?? [];
        setState((prev) => ({
          ...prev,
          messages: [...messages, ...issues],
        }));
        return false
      }
      await scheduleEmailJob(validationResult.data as SchedulePayload);
      // empty editor
      const unlayer = emailEditorRef.current?.editor;
      unlayer?.loadBlank();
      setState((prev) => ({
        ...prev,
        template: "0",
        show: true,
        message: "Newsletter scheduled successfully",
      }));
      return true
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        show: true,
        message: error?.message,
      }));
      return false
    }
  };
  return (
    <Box>
      <Box
        sx={[
          (theme) => ({
            px: 1,
            height: 100,
            backgroundColor: theme.vars.palette.primary.dark,
            display: "flex",
            // justifyContent: "center",
            alignItems: "center",
            ...theme.applyStyles("dark", {
              backgroundColor: theme.vars.palette.background.default,
            }),
          }),
        ]}
      >
        {/* <Box sx={{ position: "absolute", right: 20, top: 20 }}>
          <ToggleThemeButton />
        </Box> */}
        <Stack
          spacing={2}
          direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
          sx={{ justifyContent: "space-between", width: "100%" }}
        >
          <Typography
            variant="h3"
            sx={[
              (theme) => ({
                color: theme.vars.palette.common.white,
                fontWeight: 800,
              }),
            ]}
          >
            Email Job Scheduling App
          </Typography>

          <Box>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-template-label">Template</InputLabel>
              <Select
                labelId="demo-select-template-label"
                id="demo-select-template"
                value={state.template}
                label="Template"
                onChange={handleTemplateChange}
                color="info"
                sx={{ color: theme => theme.palette.common.white }}
              >
                {templates.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            sx={[
              (theme) => ({
                backgroundColor: theme.vars.palette.common.black,
              }),
            ]}
            size="small"
            variant="contained"
            onClick={(ev) => toggleDialog(true)}
          >
            Schedule Email
          </Button>
        </Stack>
      </Box>
      <Container maxWidth="xl">
        <Box sx={{ position: "relative" }}>
          <EmailEditor
            minHeight={"80vh"}
            ref={emailEditorRef}
            onReady={onReady}
          />
        </Box>
      </Container>
      <Box sx={{
        position: "fixed",
        bottom: 20,
        right: 20
      }}>
        <IconButton size="large" onClick={() => signOut()}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
      <SetupDialog
        open={state.open}
        toggleDialog={toggleDialog}
        handleSubmit={handleSubmit}
        messages={state.messages}
        newsletterGroups={groups}
      />
      <Snackbar
        open={state.show}
        autoHideDuration={5000}
        onClose={handleClose}
        message={state.message}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      />

    </Box>
  );
};

export default Homepage;
