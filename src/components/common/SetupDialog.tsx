"use client";
import {
  Box,
  Button,
  FormControl,
  Grid2,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  NewsletterGroup,
  RepeatStrategy,
  RetryStrategy,
  ScheduleOption,
  SchedulePayload,
} from "@/types";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

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

enum Pattern {
  SEC = "sec",
  MIN = "min",
  HR = "hr",
  DOM = "dom",
  MON = "mon",
  DOW = "dow",
}
const inputPattern = {
  [Pattern.SEC]: /^(\*|[0-5]?[0-9])?$/, // * or 0-59 or empty
  [Pattern.MIN]: /^(\*|[0-5]?[0-9])?$/, // * or 0-59 or empty
  [Pattern.HR]: /^(\*|[0-1]?[0-9]|2[0-3])?$/, // * or 0-23 or empty
  [Pattern.DOM]: /^(\*|L|[1-9]|[12][0-9]|3[01])?$/, // * or L or 1-31 or empty
  [Pattern.MON]: /^(\*|[1-9]|1[0-2])?$/, // * or 1-12 or empty
  [Pattern.DOW]:
    /^(\*|([0-7]L?-[0-7]L?)|([0-7]L?-)|([0-7]L?)|([0-7](?:,[0-7])*)|(\*\/[1-7]))?$/, // * or 0-7, L, 1-7, 1-4, 1-5, 0,7, */5 or empty
};

const initialState: LocalState = {
    scheduleAt: dayjs().add(5, "minute"),
    subject: "",
    retryAttempts: 3,
    retryStrategy: RetryStrategy.FIXED,
    groups: [],
  }

const SetupDialog = ({
  open,
  toggleDialog,
  handleSubmit,
  messages,
  newsletterGroups,
}: {
  open: boolean;
  toggleDialog: (open: boolean) => void;
  handleSubmit: (args: LocalState) => Promise<boolean>;
  messages: string[];
  newsletterGroups: NewsletterGroup[];
}) => {
  const [state, setState] = React.useState<LocalState>(initialState);

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const isOpen = useMemo(() => open, [open]);

  const handleClose = () => {
    toggleDialog(false);
  };

  const handleCronPatternChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    kind: Pattern
  ) => {
    const value = ev.target.value;
    const validate = inputPattern[kind].test(value);
    if (validate) {
      // Allow "*" or numbers between 0-59
      setState((prev) => {
        if (!prev.options) return prev;
        return {
          ...prev,
          options: {
            ...prev.options,
            pattern: {
              ...prev.options?.pattern,
              [kind]: value,
            },
          },
        };
      });
    }
  };

  const handleGroupChange = (event: SelectChangeEvent<typeof state.groups>) => {
    const {
      target: { value },
    } = event;
    setState((prev) => ({
      ...prev,
      groups: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const onSubmit = async(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();
    const isDone = await handleSubmit(state);
    if (isDone) {
        setState(initialState)
        toggleDialog(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Configure Email Schedule
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                id="outlined-basic"
                label="Subject"
                variant="outlined"
                value={state.subject}
                onChange={(ev) =>
                  setState((prev) => ({ ...prev, subject: ev.target.value }))
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Groups</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={state.groups}
                onChange={handleGroupChange}
                input={<OutlinedInput label="Group" />}
                renderValue={(selected) =>
                  newsletterGroups
                    .filter((item) => selected.includes(item.id))
                    .map((item) => item.name)
                    .join(", ")
                }
                MenuProps={MenuProps}
              >
                {newsletterGroups.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={state.groups.includes(item.id)} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateTimePicker", "DateTimePicker"]}
                >
                  <DateTimePicker
                    label="Schedule At"
                    value={state.scheduleAt}
                    onChange={(newValue) =>
                      setState((prev) => ({ ...prev, scheduleAt: newValue }))
                    }
                    disablePast
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Retry Strategy
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="repeatStrategy-row-radio"
                name="retryStrategy-row-radio-buttons-group"
                value={state?.retryStrategy}
                onChange={(ev, value) =>
                  setState((prev) => ({
                    ...prev,
                    retryStrategy: value as RetryStrategy,
                  }))
                }
              >
                <FormControlLabel
                  value={RetryStrategy.FIXED}
                  control={<Radio />}
                  label="Fixed"
                />
                <FormControlLabel
                  value={RetryStrategy.EXPONENTIAL}
                  control={<Radio />}
                  label="Exponential"
                />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                id="outlined-attempts"
                label="Retry Attempts"
                variant="outlined"
                value={state?.retryAttempts}
                placeholder="Optional"
                type="number"
                onChange={(ev) =>
                  setState((prev) => ({
                    ...prev,
                    retryAttempts: parseInt(ev.target.value) ?? 1,
                  }))
                }
              />
              <Typography variant="caption">
                Enter the number of failed retry attempts.
              </Typography>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormControlLabel
                sx={{ display: "block" }}
                value={state.repeatable}
                onChange={(ev, checked) =>
                  setState((prev) => ({
                    ...prev,
                    repeatable: checked,
                    options: {
                      ...prev?.options,
                      repeatStrategy: !prev.options?.repeatStrategy
                        ? RepeatStrategy.EVERY
                        : prev.options?.repeatStrategy,
                      //   startDate:
                      //     prev?.options?.startDate ?? dayjs().add(5, "minute"),
                      //   endDate: prev?.options?.endDate ?? dayjs().add(7, "day"),
                    },
                  }))
                }
                control={<Switch color="warning" />}
                label="Repeatable Schedule?"
                labelPlacement="end"
              />
            </FormControl>
            {state.repeatable && (
              <React.Fragment>
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Repeat Strategy
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="repeatStrategy-row-radio"
                    name="repeatStrategy-row-radio-buttons-group"
                    value={state.options?.repeatStrategy}
                    onChange={(ev, value) =>
                      setState((prev) => ({
                        ...prev,
                        options: {
                          ...prev?.options,
                          repeatStrategy: value as RepeatStrategy,
                        },
                      }))
                    }
                  >
                    <FormControlLabel
                      value={RepeatStrategy.EVERY}
                      control={<Radio />}
                      label="Every"
                    />
                    <FormControlLabel
                      value={RepeatStrategy.CRON}
                      control={<Radio />}
                      label="Cron Job"
                    />
                  </RadioGroup>
                </FormControl>
                {state.options?.repeatStrategy === RepeatStrategy.EVERY && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                      id="outlined-interval"
                      label="Time Interval"
                      variant="outlined"
                      placeholder="E.g 10,000 = 10 seconds"
                      type="number"
                      value={state.options?.interval}
                      onChange={(ev) =>
                        setState((prev) => ({
                          ...prev,
                          options: {
                            ...prev?.options,
                            interval: parseInt(ev.target.value, 10),
                          },
                        }))
                      }
                    />
                    <Typography variant="caption">
                      Enter in milliseconds e.g 1m = (1 * 60 * 1000)
                      milliseconds
                    </Typography>
                  </FormControl>
                )}
                {state.options?.repeatStrategy === RepeatStrategy.CRON && (
                  <Box>
                    <Typography variant="body2">Create Cron Pattern</Typography>
                    <Grid2 container spacing={2} mt={2}>
                      <Grid2 size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            id="outlined-sec"
                            label="Seconds"
                            variant="outlined"
                            placeholder="* or 0-59"
                            value={state.options.pattern?.sec}
                            onChange={(ev) =>
                              handleCronPatternChange(ev, Pattern.SEC)
                            }
                          />
                        </FormControl>
                      </Grid2>
                      <Grid2 size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            id="outlined-min"
                            label="Minutes"
                            variant="outlined"
                            placeholder="* or 0 - 59"
                            value={state.options.pattern?.min}
                            onChange={(ev) =>
                              handleCronPatternChange(ev, Pattern.MIN)
                            }
                          />
                        </FormControl>
                      </Grid2>
                      <Grid2 size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            id="outlined-basic"
                            label="Hours"
                            variant="outlined"
                            placeholder="* or 0 - 23"
                            value={state.options.pattern?.hr}
                            onChange={(ev) =>
                              handleCronPatternChange(ev, Pattern.HR)
                            }
                          />
                        </FormControl>
                      </Grid2>
                      <Grid2 size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            id="outlined-dom"
                            label="Day of Month"
                            variant="outlined"
                            placeholder="* or L or 1 - 31"
                            value={state.options.pattern?.dom}
                            onChange={(ev) =>
                              handleCronPatternChange(ev, Pattern.DOM)
                            }
                          />
                        </FormControl>
                      </Grid2>
                      <Grid2 size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            id="outlined-mon"
                            label="Month"
                            variant="outlined"
                            placeholder="* or 1 - 12"
                            value={state.options.pattern?.mon}
                            onChange={(ev) =>
                              handleCronPatternChange(ev, Pattern.MON)
                            }
                          />
                        </FormControl>
                      </Grid2>
                      <Grid2 size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            id="outlined-dow"
                            label="Day of Week"
                            variant="outlined"
                            placeholder="* or 2L-5L or 0 - 7"
                            value={state.options.pattern?.dow}
                            onChange={(ev) =>
                              handleCronPatternChange(ev, Pattern.DOW)
                            }
                          />
                        </FormControl>
                      </Grid2>
                    </Grid2>
                  </Box>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    id="outlined-limit"
                    label="Limit"
                    variant="outlined"
                    value={state.options?.limit}
                    placeholder="Optional"
                    onChange={(ev) =>
                      setState((prev) => ({
                        ...prev,
                        options: {
                          ...prev?.options,
                          limit: parseInt(ev.target.value),
                        },
                      }))
                    }
                  />
                  <Typography variant="caption">
                    Limit no of times a job will be repeated
                  </Typography>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value={state.options?.immediately}
                    control={<Switch color="warning" />}
                    label="Start Immediately?"
                    labelPlacement="end"
                    onChange={(ev, checked) =>
                      setState((prev) => ({
                        ...prev,
                        options: {
                          ...prev?.options,
                          immediately: checked,
                        },
                      }))
                    }
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DateTimePicker", "DateTimePicker"]}
                    >
                      <DateTimePicker
                        label="Start Date"
                        value={state?.options?.startDate}
                        onChange={(newValue) =>
                          setState((prev) => ({
                            ...prev,
                            options: {
                              ...prev?.options,
                              startDate: newValue,
                            },
                          }))
                        }
                        disablePast
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DateTimePicker", "DateTimePicker"]}
                    >
                      <DateTimePicker
                        label="End Date"
                        value={state?.options?.endDate}
                        onChange={(newValue) =>
                          setState((prev) => ({
                            ...prev,
                            options: {
                              ...prev?.options,
                              endDate: newValue,
                            },
                          }))
                        }
                        disablePast
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </React.Fragment>
            )}
            <Box>
              {messages.map((message, index) => (
                <Typography variant="body2" key={index} color="error">
                  {message}
                </Typography>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button color="error" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={(ev) => onSubmit(ev)} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default SetupDialog;
