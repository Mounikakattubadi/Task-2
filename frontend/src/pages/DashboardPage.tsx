import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Folder {
  _id: string;
  name: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchFolders = async () => {
    const res = await api.get("/folders/root");
    setFolders(res.data);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreate = async () => {
    if (!newFolder) return;
    await api.post("/folders", { name: newFolder });
    setNewFolder("");
    fetchFolders();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this folder?")) return;
    await api.delete(`/folders/${id}`);
    fetchFolders();
  };

  const handleRename = async (folder: Folder) => {
    const name = window.prompt("New name", folder.name);
    if (!name) return;
    await api.patch(`/folders/${folder._id}`, { name });
    fetchFolders();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Storage Dashboard</Typography>
        <Button onClick={logout}>Logout</Button>
      </Box>

      <Typography variant="h6" mt={4}>
        Root Folders
      </Typography>

      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="New Folder Name"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {folders.map((folder) => (
            <TableRow key={folder._id} hover>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/folders/${folder._id}`)}
              >
                {folder.name}
              </TableCell>
              <TableCell>{new Date(folder.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleRename(folder)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(folder._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default DashboardPage;
