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
  IconButton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  }, [id]);

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    await api.post("/folders", { name: newFolderName, parentFolder: id });
    setNewFolderName("");
    fetchData();
  };

  const handleCreateFile = async () => {
    if (!newFileName) return;
    await api.post("/files", {
      name: newFileName,
      url: newFileUrl,
      folderId: id
    });
    setNewFileName("");
    fetchData();
  };

  const handleRenameFolder = async (f: Folder) => {
    const name = window.prompt("New name", f.name);
    if (!name) return;
    await api.patch(`/folders/${f._id}`, { name });
    fetchData();
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm("Delete this folder?")) return;
    await api.delete(`/folders/${folderId}`);
    fetchData();
  };

  const handleRenameFile = async (file: FileItem) => {
    const name = window.prompt("New name", file.name);
    if (!name) return;
    await api.patch(`/files/${file._id}`, { name });
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
    // Very simple: if parent exists, navigate to it, else dashboard
    navigate(-1);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          Folder: {folder?.name}
        </Typography>
      </Box>

      {lastShareUrl && (
        <Typography variant="body2" mt={1}>
          Share link copied: {lastShareUrl}
        </Typography>
      )}

      {/* Child folders */}
      <Typography variant="h6" mt={4}>
        Sub-Folders
      </Typography>
      <Box display="flex" gap={2} mt={1}>
        <TextField
          label="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreateFolder}>
          Create Folder
        </Button>
        <Button variant="outlined" onClick={shareFolder}>
          Share This Folder
        </Button>
      </Box>

      <List>
        {childFolders.map((f) => (
          <ListItem
            key={f._id}
            secondaryAction={
              <>
                <IconButton onClick={() => handleRenameFolder(f)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteFolder(f._id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/folders/${f._id}`)}
          >
            <ListItemText primary={f.name} />
          </ListItem>
        ))}
      </List>

      {/* Files */}
      <Typography variant="h6" mt={4}>
        Files
      </Typography>
      <Box display="flex" gap={2} mt={1}>
        <TextField
          label="File name"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
        <TextField
          label="File URL"
          value={newFileUrl}
          onChange={(e) => setNewFileUrl(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreateFile}>
          Add File
        </Button>
      </Box>

      <List>
        {files.map((file) => (
          <ListItem
            key={file._id}
            secondaryAction={
              <>
                <IconButton onClick={() => shareFile(file._id)}>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={() => handleRenameFile(file)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteFile(file._id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={file.name}
              secondary={file.url}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FolderViewPage;
