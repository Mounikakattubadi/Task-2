import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

interface FileType {
  _id?: string;
  name: string;
  url?: string;
}

interface FolderType {
  _id?: string;
  name: string;
}

type PublicPayload =
  | {
      kind: "folder";
      folder: FolderType;
      childFolders: FolderType[];
      files: FileType[];
    }
  | {
      kind: "file";
      file: FileType;
    }
  // fallback for older simple shapes
  | any;

const PublicViewPage = () => {
  const { shareId } = useParams();
  const [data, setData] = useState<PublicPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareId) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/public/${shareId}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [shareId]);

  // =======================
  // Loading / Error states
  // =======================
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading shared content…
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LinkOffIcon color="error" sx={{ fontSize: 40 }} />
        <Typography variant="h5" color="error">
          Invalid or expired link
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The item you are trying to access is no longer available.
        </Typography>
      </Box>
    );
  }

  // =======================
  // Normalize backend data
  // =======================
  let isFile = false;
  let folderName = "";
  let files: FileType[] = [];
  let subFolders: FolderType[] = [];
  let sharedFile: FileType | null = null;

  if (data.kind === "folder") {
    // new format from public.controller
    isFile = false;
    folderName = data.folder?.name || "Shared folder";
    files = data.files || [];
    subFolders = data.childFolders || [];
  } else if (data.kind === "file") {
    isFile = true;
    sharedFile = data.file;
  } else {
    // fallback for old simple responses
    if ((data as any).url) {
      isFile = true;
      sharedFile = {
        name: (data as any).name,
        url: (data as any).url,
      };
    } else {
      isFile = false;
      folderName = (data as any).name || "Shared folder";
      files = (data as any).files || [];
      subFolders = (data as any).children || [];
    }
  }

  // =======================
  // UI
  // =======================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(25,118,210,0.06), rgba(156,39,176,0.08))",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LinkIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {isFile ? "Shared File" : "Shared Folder"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This content was shared with you via a public link.
                </Typography>
              </Box>
            </Box>

            <Chip
              label={isFile ? "Read-only file" : "Read-only folder"}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* File view */}
          {isFile && sharedFile && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                File name
              </Typography>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {sharedFile.name}
              </Typography>

              {sharedFile.url ? (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<CloudDownloadIcon />}
                    href={sharedFile.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textTransform: "none" }}
                  >
                    Open / Download
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  No URL available for this file.
                </Typography>
              )}
            </Box>
          )}

          {/* Folder view */}
          {!isFile && (
            <Box>
              {/* Folder name */}
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Folder name
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {folderName}
                </Typography>
              </Box>

              {/* Sub-folders */}
              <Box mb={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Sub-folders
                  </Typography>
                  <Chip
                    size="small"
                    label={`${subFolders.length} item${
                      subFolders.length === 1 ? "" : "s"
                    }`}
                  />
                </Box>

                {subFolders.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No sub-folders in this folder.
                  </Typography>
                ) : (
                  <List dense>
                    {subFolders.map((folder) => (
                      <ListItem key={folder._id || folder.name}>
                        <ListItemIcon>
                          <FolderIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={folder.name} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Files */}
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Files
                  </Typography>
                  <Chip
                    size="small"
                    label={`${files.length} item${
                      files.length === 1 ? "" : "s"
                    }`}
                  />
                </Box>

                {files.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No files in this folder.
                  </Typography>
                ) : (
                  <List dense>
                    {files.map((file) => (
                      <ListItem
                        key={file._id || file.name}
                        secondaryAction={
                          file.url && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<CloudDownloadIcon />}
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              sx={{ textTransform: "none" }}
                            >
                              Open
                            </Button>
                          )
                        }
                      >
                        <ListItemIcon>
                          <InsertDriveFileIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={
                            file.url ? (
                              <MuiLink
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                sx={{
                                  fontSize: "0.75rem",
                                  wordBreak: "break-all",
                                }}
                              >
                                {file.url}
                              </MuiLink>
                            ) : undefined
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicViewPage;
