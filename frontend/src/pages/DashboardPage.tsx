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
  IconButton,
  Paper,
  TableContainer,
  Chip,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

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
    if (!newFolder.trim()) return;
    await api.post("/folders", { name: newFolder.trim() });
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
    if (!name?.trim()) return;
    await api.patch(`/folders/${folder._id}`, { name: name.trim() });
    fetchFolders();
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
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <FolderIcon color="primary" />
              <Typography variant="h4" fontWeight={600}>
                Storage Dashboard
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Manage root folders for your internal storage platform.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Create root folder
            </Typography>
            <Chip
              size="small"
              label={`${folders.length} folder${
                folders.length === 1 ? "" : "s"
              }`}
            />
          </Box>

          <Box
            display="flex"
            gap={2}
            mt={1}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <TextField
              label="New folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ textTransform: "none", whiteSpace: "nowrap" }}
            >
              Create
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created at</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {folders.map((folder) => (
                  <TableRow key={folder._id} hover>
                    <TableCell
                      sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
                      onClick={() => navigate(`/folders/${folder._id}`)}
                    >
                      <FolderIcon fontSize="small" color="primary" />
                      {folder.name}
                    </TableCell>
                    <TableCell>
                      {new Date(folder.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Rename">
                        <IconButton onClick={() => handleRename(folder)} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(folder._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {folders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 3, textAlign: "center" }}
                      >
                        No root folders yet. Create your first one above.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;
