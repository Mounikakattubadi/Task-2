import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface Folder {
  _id: string;
  name: string;
  parentFolder?: string | null;
}

interface FileItem {
  _id: string;
  name: string;
  url: string;
}

const FolderViewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [folder, setFolder] = useState<Folder | null>(null);
  const [childFolders, setChildFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("https://dummyfile.com/file.txt");
  const [lastShareUrl, setLastShareUrl] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await api.get(`/folders/${id}`);
    setFolder(res.data.folder);
    setChildFolders(res.data.childFolders);
    setFiles(res.data.files);
  };

  useEffect(() => {
    if (id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await api.post("/folders", { name: newFolderName.trim(), parentFolder: id });
    setNewFolderName("");
    fetchData();
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    await api.post("/files", {
      name: newFileName.trim(),
      url: newFileUrl,
      folderId: id,
    });
    setNewFileName("");
    fetchData();
  };

  const handleRenameFolder = async (f: Folder) => {
    const name = window.prompt("New name", f.name);
    if (!name?.trim()) return;
    await api.patch(`/folders/${f._id}`, { name: name.trim() });
    fetchData();
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm("Delete this folder?")) return;
    await api.delete(`/folders/${folderId}`);
    fetchData();
  };

  const handleRenameFile = async (file: FileItem) => {
    const name = window.prompt("New name", file.name);
    if (!name?.trim()) return;
    await api.patch(`/files/${file._id}`, { name: name.trim() });
    fetchData();
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm("Delete this file?")) return;
    await api.delete(`/files/${fileId}`);
    fetchData();
  };

  const shareFolder = async () => {
    const res = await api.post(`/folders/${id}/share`);
    const link = `${window.location.origin}/public/${res.data.shareId}`;
    setLastShareUrl(link);
    navigator.clipboard.writeText(link).catch(() => {});
  };

  const shareFile = async (fileId: string) => {
    const res = await api.post(`/files/${fileId}/share`);
    const link = `${window.location.origin}/public/${res.data.shareId}`;
    setLastShareUrl(link);
    navigator.clipboard.writeText(link).catch(() => {});
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(25,118,210,0.06), rgba(156,39,176,0.08))",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 4,
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <IconButton onClick={goBack} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {folder?.name || "Folder"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage sub-folders, files and share links.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={shareFolder}
              sx={{ textTransform: "none" }}
            >
              Share folder
            </Button>
          </Box>

          {lastShareUrl && (
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 2,
                borderLeft: "4px solid",
                borderColor: "primary.main",
                bgcolor: "primary.main",
                bgcolorOpacity: 0.04,
              }}
            >
              <Typography variant="body2">
                Share link copied:&nbsp;
                <Box
                  component="span"
                  sx={{
                    fontFamily: "monospace",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: "background.default",
                  }}
                >
                  {lastShareUrl}
                </Box>
              </Typography>
            </Paper>
          )}

          {/* Create section */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Add items to this folder
            </Typography>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              mb={2}
            >
              <TextField
                label="New folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleCreateFolder}
                sx={{ textTransform: "none", whiteSpace: "nowrap" }}
              >
                Create folder
              </Button>
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              <TextField
                label="File name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="File URL"
                value={newFileUrl}
                onChange={(e) => setNewFileUrl(e.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={handleCreateFile}
                sx={{ textTransform: "none", whiteSpace: "nowrap" }}
              >
                Add file
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Combined list: folders first, then files */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Items in this folder
            </Typography>
            <Chip
              size="small"
              label={`${childFolders.length + files.length} item${
                childFolders.length + files.length === 1 ? "" : "s"
              }`}
            />
          </Box>

          <List dense>
            {/* Folders */}
            {childFolders.map((f) => (
              <ListItem
                key={f._id}
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleRenameFolder(f)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteFolder(f._id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/folders/${f._id}`)}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <FolderIcon fontSize="small" color="primary" />
                  <ListItemText primary={f.name} />
                </Box>
              </ListItem>
            ))}

            {/* Files */}
            {files.map((file) => (
              <ListItem
                key={file._id}
                secondaryAction={
                  <>
                    <IconButton onClick={() => shareFile(file._id)} size="small">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleRenameFile(file)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteFile(file._id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                <Box display="flex" flexDirection="column" width="100%">
                  <Box display="flex" alignItems="center" gap={1}>
                    <InsertDriveFileIcon fontSize="small" color="secondary" />
                    <ListItemText primary={file.name} />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 3.5, mt: 0.2, wordBreak: "break-all" }}
                  >
                    {file.url}
                  </Typography>
                </Box>
              </ListItem>
            ))}

            {childFolders.length === 0 && files.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                This folder is empty. Use the fields above to add folders or
                files.
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default FolderViewPage;
